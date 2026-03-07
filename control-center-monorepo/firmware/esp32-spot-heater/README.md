# ESP32 Spot Heater Firmware (Skeleton)

This firmware skeleton does:

- Wi-Fi connection
- NTP sync (epoch timestamps for backend telemetry)
- Pairing call to `POST /api/device/pair`
- MQTT TLS connection
- Subscribe `devices/<device_uid>/cmd`
- Apply heater duty using ESP32 PWM
- Publish telemetry every 15s to `devices/<device_uid>/telemetry`
- Publish command ACK to `devices/<device_uid>/ack`
- Publish status to `devices/<device_uid>/status`

## Before flashing

1. Set Wi-Fi and MQTT credentials in `src/main.cpp`.
2. Set `CONTROL_CENTER_PAIR_URL`, `DEVICE_UID`, `PAIRING_CODE`, and `DEVICE_SECRET`.
3. Add broker and HTTPS CA certificates (`MQTT_ROOT_CA`, `HTTPS_ROOT_CA`) for production.
4. Replace temp reading function with your real sensor driver.
5. Calibrate battery divider conversion in `readBatteryVoltage()`.

## Pairing flow

1. In Control Center, click **Add device** and create a pairing code.
2. Copy `pairingCode` and `provisioningSecret` to firmware config.
3. Flash/restart ESP32.
4. Device calls `/api/device/pair` until it succeeds.
5. After success, device starts MQTT loop and telemetry publishing.

## Build & flash

```bash
pio run
pio run -t upload
pio device monitor
```
