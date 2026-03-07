#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>

// ===== User config =====
static const char* WIFI_SSID = "YOUR_WIFI_SSID";
static const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

static const char* MQTT_HOST = "YOUR_BROKER_HOST";  // e.g. xxxxx.s1.eu.hivemq.cloud
static const int MQTT_PORT = 8883;
static const char* MQTT_USER = "YOUR_MQTT_USER";
static const char* MQTT_PASS = "YOUR_MQTT_PASS";

static const char* CONTROL_CENTER_PAIR_URL = "https://YOUR_CONTROL_CENTER_URL/api/device/pair";
static const char* DEVICE_UID = "BEE-001-ESP32";
static const char* DEVICE_SECRET = "PROVISIONING_SECRET_FROM_PAIRING";
static const char* PAIRING_CODE = "PAIRING_CODE_8_CHARS";

// Use proper CA certificates in production. setInsecure() is only for lab/testing.
static const char* MQTT_ROOT_CA = "";
static const char* HTTPS_ROOT_CA = "";

// Hardware pins
static const int HEATER_PIN = 25;
static const int BATT_PIN = 34;

// PWM
static const int PWM_CHANNEL = 0;
static const int PWM_FREQ = 1000;
static const int PWM_RES = 8;

// Telemetry cadence
static const unsigned long TELEMETRY_INTERVAL_MS = 15000;
static const unsigned long PAIR_RETRY_INTERVAL_MS = 15000;

WiFiClientSecure secureClient;
PubSubClient mqttClient(secureClient);

String cmdTopic = "";
String telemetryTopic = "";
String ackTopic = "";
String statusTopic = "";

float targetTSet = 8.0F;
String currentMode = "AUTO";
float currentDuty = 0.0F;
float maxDuty = 0.8F;

unsigned long lastTelemetryMs = 0;
unsigned long lastPairAttemptMs = 0;
bool devicePaired = false;

uint64_t currentEpochMs() {
  const time_t now = time(nullptr);
  if (now > 1700000000) {
    return static_cast<uint64_t>(now) * 1000ULL;
  }

  // Fallback if NTP did not sync yet.
  return static_cast<uint64_t>(millis());
}

void syncClock() {
  configTime(0, 0, "pool.ntp.org", "time.google.com");

  for (int i = 0; i < 30; i++) {
    if (time(nullptr) > 1700000000) {
      Serial.println("NTP synced");
      return;
    }
    delay(500);
  }

  Serial.println("NTP sync timeout, continuing with millis fallback");
}

float readInternalTempC() {
  // Replace with DS18B20/SHT/NTC sensor reading.
  return temperatureRead();
}

float readBatteryVoltage() {
  // Update conversion factor to match your voltage divider.
  const int raw = analogRead(BATT_PIN);
  const float v = (static_cast<float>(raw) / 4095.0F) * 3.3F * 4.0F;
  return v;
}

void applyDuty(float duty) {
  if (duty < 0.0F) duty = 0.0F;
  if (duty > 1.0F) duty = 1.0F;

  const int pwm = static_cast<int>(roundf(duty * 255.0F));
  ledcWrite(PWM_CHANNEL, pwm);
  currentDuty = duty;
}

void publishStatus(const char* status) {
  StaticJsonDocument<128> doc;
  doc["status"] = status;
  doc["ts"] = currentEpochMs();

  char buffer[128];
  serializeJson(doc, buffer);
  mqttClient.publish(statusTopic.c_str(), buffer, true);
}

void publishAck(const char* msgId, const char* status, const char* info) {
  StaticJsonDocument<192> doc;
  doc["msgId"] = msgId;
  doc["status"] = status;
  doc["info"] = info;
  doc["ts"] = currentEpochMs();

  char buffer[192];
  serializeJson(doc, buffer);
  mqttClient.publish(ackTopic.c_str(), buffer, false);
}

void publishTelemetry() {
  const float tInternal = readInternalTempC();
  const float vBatt = readBatteryVoltage();
  const char* state = vBatt < 11.6F ? "LOW_BATT" : (currentDuty > 0.0F ? "HEATING" : "IDLE");

  StaticJsonDocument<256> doc;
  doc["ts"] = currentEpochMs();
  doc["tInternal"] = tInternal;
  doc["vBatt"] = vBatt;
  doc["duty"] = currentDuty;
  doc["state"] = state;
  doc["rssi"] = WiFi.RSSI();

  char buffer[256];
  serializeJson(doc, buffer);
  mqttClient.publish(telemetryTopic.c_str(), buffer, false);
}

bool callPairEndpoint() {
  WiFiClientSecure httpsClient;
  if (strlen(HTTPS_ROOT_CA) > 0) {
    httpsClient.setCACert(HTTPS_ROOT_CA);
  } else {
    httpsClient.setInsecure();
  }

  HTTPClient http;
  if (!http.begin(httpsClient, CONTROL_CENTER_PAIR_URL)) {
    Serial.println("Pairing HTTP begin failed");
    return false;
  }

  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> requestDoc;
  requestDoc["device_uid"] = DEVICE_UID;
  requestDoc["pairing_code"] = PAIRING_CODE;
  requestDoc["device_secret"] = DEVICE_SECRET;

  String body;
  serializeJson(requestDoc, body);

  const int statusCode = http.POST(body);
  const String responseBody = http.getString();
  http.end();

  if (statusCode < 200 || statusCode >= 300) {
    Serial.printf("Pairing failed. HTTP %d: %s\n", statusCode, responseBody.c_str());
    return false;
  }

  StaticJsonDocument<256> responseDoc;
  const DeserializationError error = deserializeJson(responseDoc, responseBody);
  if (error) {
    Serial.printf("Pairing response parse failed: %s\n", error.c_str());
    return false;
  }

  const bool ok = responseDoc["ok"] | false;
  if (!ok) {
    Serial.println("Pairing response did not contain ok=true");
    return false;
  }

  Serial.println("Pairing successful");
  return true;
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<320> doc;
  const DeserializationError err = deserializeJson(doc, payload, length);
  if (err) {
    publishAck("unknown", "error", "invalid_json");
    return;
  }

  const char* type = doc["type"] | "";
  const char* msgId = doc["msgId"] | "";
  if (String(type) != "SET_CONTROL") {
    publishAck(msgId, "error", "unsupported_type");
    return;
  }

  targetTSet = doc["tSet"] | targetTSet;
  currentMode = String(static_cast<const char*>(doc["mode"] | "AUTO"));
  maxDuty = doc["maxDuty"] | maxDuty;
  float duty = doc["duty"] | 0.0F;

  const float vBatt = readBatteryVoltage();
  if (vBatt < 11.6F) duty = 0.0F;
  if (duty > maxDuty) duty = maxDuty;

  applyDuty(duty);
  publishAck(msgId, "ok", "control_applied");
}

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
}

void connectMqtt() {
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);

  while (!mqttClient.connected()) {
    const String clientId = String("esp32-") + DEVICE_UID;
    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS, statusTopic.c_str(), 1, true, "{\"status\":\"offline\"}")) {
      mqttClient.subscribe(cmdTopic.c_str(), 1);
      publishStatus("online");
      Serial.println("MQTT connected");
    } else {
      Serial.printf("MQTT connect failed (%d). Retrying...\n", mqttClient.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);

  cmdTopic = String("devices/") + DEVICE_UID + "/cmd";
  telemetryTopic = String("devices/") + DEVICE_UID + "/telemetry";
  ackTopic = String("devices/") + DEVICE_UID + "/ack";
  statusTopic = String("devices/") + DEVICE_UID + "/status";

  ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RES);
  ledcAttachPin(HEATER_PIN, PWM_CHANNEL);
  applyDuty(0.0F);

  if (strlen(MQTT_ROOT_CA) > 0) {
    secureClient.setCACert(MQTT_ROOT_CA);
  } else {
    secureClient.setInsecure();
  }

  connectWifi();
  syncClock();

  if (strlen(PAIRING_CODE) == 0) {
    devicePaired = true;
    Serial.println("PAIRING_CODE empty: skipping pairing step");
  } else {
    devicePaired = callPairEndpoint();
    lastPairAttemptMs = millis();
  }

  if (devicePaired) {
    connectMqtt();
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
    syncClock();
  }

  if (!devicePaired) {
    const unsigned long now = millis();
    if (now - lastPairAttemptMs >= PAIR_RETRY_INTERVAL_MS) {
      devicePaired = callPairEndpoint();
      lastPairAttemptMs = now;

      if (devicePaired) {
        connectMqtt();
      }
    }

    delay(200);
    return;
  }

  if (!mqttClient.connected()) {
    connectMqtt();
  }

  mqttClient.loop();

  const unsigned long now = millis();
  if (now - lastTelemetryMs >= TELEMETRY_INTERVAL_MS) {
    publishTelemetry();
    lastTelemetryMs = now;
  }
}
