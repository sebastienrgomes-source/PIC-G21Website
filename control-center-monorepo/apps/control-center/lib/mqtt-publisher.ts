import { deviceTopic } from '@pic/shared';
import type { CommandPayload } from '@pic/shared';
import { getMqttServerEnv } from '@/lib/env';

export const publishDeviceCommand = async (
  deviceUid: string,
  payload: CommandPayload,
): Promise<{ topic: string; payload: CommandPayload }> => {
  const env = getMqttServerEnv();
  const topic = deviceTopic.cmd(deviceUid);
  process.env.WS_NO_BUFFER_UTIL ??= '1';
  process.env.WS_NO_UTF_8_VALIDATE ??= '1';
  const mqtt = (await import('mqtt')).default;

  try {
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      // Prototype academico: publicacao direta no HiveMQ Cloud.
      // Em producao, usar backend/broker com ACLs por dispositivo e credenciais nao expostas no frontend.
      console.log('[MQTT] connecting to', env.MQTT_BROKER_URL);
      const client = mqtt.connect(env.MQTT_BROKER_URL, {
        username: env.MQTT_USER,
        password: env.MQTT_PASS,
        clean: true,
        connectTimeout: 6000,
        reconnectPeriod: 0,
        protocolVersion: 4,
      });

      const done = (error?: unknown) => {
        if (settled) return;
        settled = true;
        client.end(true);
        if (error) reject(error);
        else resolve();
      };

      client.on('connect', () => {
        console.log('[MQTT] connected');
        console.log('[MQTT] publishing', topic, payload);
        client.publish(topic, JSON.stringify(payload), { qos: 1 }, (error) => done(error ?? undefined));
      });

      client.on('error', (error) => done(error));
    });

    console.log('[MQTT] publish success');
  } catch (error) {
    console.error('[MQTT] publish failed', error);
    throw error;
  }

  return { topic, payload };
};
