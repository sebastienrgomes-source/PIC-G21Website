'use client';

import mqtt from 'mqtt';

export const MQTT_URL = 'wss://0ec64ea6e0e541fa9f99576dc9200983.s1.eu.hivemq.cloud:8884/mqtt';
export const MQTT_USER = 'heatspot';
export const MQTT_PASS = 'Heatspot2026_';
export const DEVICE_UID = 'esp32-001';
export const CMD_TOPIC = `heatspot/${DEVICE_UID}/cmd`;

export interface Esp32CommandPayload {
  heater_enabled?: boolean;
  automatic_mode?: boolean;
  target_temperature_c?: number;
}

type BrowserMqttClient = ReturnType<typeof mqtt.connect>;

let client: BrowserMqttClient | null = null;
let connectionPromise: Promise<BrowserMqttClient> | null = null;

const resetClient = () => {
  if (client) {
    client.end(true);
  }
  client = null;
  connectionPromise = null;
};

const connectClient = async () => {
  if (client?.connected) {
    return client;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (client) {
    resetClient();
  }

  console.log('[MQTT] connecting to', MQTT_URL);

  const nextClient = mqtt.connect(MQTT_URL, {
    username: MQTT_USER,
    password: MQTT_PASS,
    clean: true,
    connectTimeout: 8000,
    reconnectPeriod: 0,
    protocolVersion: 4,
  });
  client = nextClient;

  connectionPromise = new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      nextClient.removeListener('connect', handleConnect);
      nextClient.removeListener('error', handleError);
      nextClient.removeListener('close', handleClose);
    };

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      resetClient();
      reject(error);
    };

    const handleConnect = () => {
      if (settled) return;
      settled = true;
      cleanup();
      connectionPromise = null;
      nextClient.on('close', () => {
        if (client === nextClient) {
          client = null;
        }
      });
      nextClient.on('error', (error) => {
        console.error('[MQTT] publish failed', error);
      });
      console.log('[MQTT] connected');
      resolve(nextClient);
    };

    const handleError = (error: Error) => {
      fail(error);
    };

    const handleClose = () => {
      if (!settled) {
        fail(new Error('MQTT connection closed before connect.'));
      }
    };

    const timeout = setTimeout(() => {
      fail(new Error('MQTT connection timeout.'));
    }, 10000);

    nextClient.once('connect', handleConnect);
    nextClient.once('error', handleError);
    nextClient.once('close', handleClose);
  });

  return connectionPromise;
};

export const publishCommand = async (payload: Esp32CommandPayload) => {
  try {
    const mqttClient = await connectClient();

    console.log('[MQTT] publishing', CMD_TOPIC, payload);

    await new Promise<void>((resolve, reject) => {
      mqttClient.publish(CMD_TOPIC, JSON.stringify(payload), { qos: 1 }, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    console.log('[MQTT] publish success');
    return { ok: true, topic: CMD_TOPIC, payload };
  } catch (error) {
    console.error('[MQTT] publish failed', error);
    throw error;
  }
};
