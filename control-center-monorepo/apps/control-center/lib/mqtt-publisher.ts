import mqtt from 'mqtt';
import { deviceTopic } from '@pic/shared';
import type { CommandPayload } from '@pic/shared';
import { getServerEnv } from '@/lib/env';

export const publishDeviceCommand = async (
  deviceUid: string,
  payload: CommandPayload,
): Promise<void> => {
  const env = getServerEnv();
  const topic = deviceTopic.cmd(deviceUid);

  await new Promise<void>((resolve, reject) => {
    const client = mqtt.connect(env.MQTT_BROKER_URL, {
      username: env.MQTT_USER,
      password: env.MQTT_PASS,
      connectTimeout: 6000,
      reconnectPeriod: 0,
      protocolVersion: 4,
    });

    const done = (error?: unknown) => {
      client.end(true);
      if (error) reject(error);
      else resolve();
    };

    client.on('connect', () => {
      client.publish(topic, JSON.stringify(payload), { qos: 1 }, (error) => done(error ?? undefined));
    });

    client.on('error', (error) => done(error));
  });
};
