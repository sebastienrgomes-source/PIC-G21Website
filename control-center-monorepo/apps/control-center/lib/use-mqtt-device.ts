'use client';

import { useEffect, useMemo, useState } from 'react';
import mqtt from 'mqtt';
import { deviceTopic } from '@pic/shared';
import { MQTT_DEFAULTS } from '@/lib/mqtt-defaults';

export type MqttDeviceMessage = Record<string, unknown>;

export interface MqttDeviceState {
  connected: boolean;
  telemetry: MqttDeviceMessage | null;
  status: MqttDeviceMessage | null;
  lastMessageAt: string | null;
  error: string | null;
}

const defaultState: MqttDeviceState = {
  connected: false,
  telemetry: null,
  status: null,
  lastMessageAt: null,
  error: null,
};

const parseJsonObject = (raw: string): MqttDeviceMessage => {
  const parsed = JSON.parse(raw) as unknown;
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as MqttDeviceMessage;
  }

  return { value: parsed };
};

export function useMqttDevice(deviceUid = process.env.NEXT_PUBLIC_DEVICE_UID ?? MQTT_DEFAULTS.deviceUid): MqttDeviceState {
  const [state, setState] = useState<MqttDeviceState>(defaultState);

  const topics = useMemo(
    () => ({
      telemetry: deviceTopic.telemetry(deviceUid),
      status: deviceTopic.status(deviceUid),
    }),
    [deviceUid],
  );

  useEffect(() => {
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? MQTT_DEFAULTS.brokerUrl;
    const username = process.env.NEXT_PUBLIC_MQTT_USER ?? MQTT_DEFAULTS.username;
    const password = process.env.NEXT_PUBLIC_MQTT_PASS ?? MQTT_DEFAULTS.password;

    if (!brokerUrl) {
      setState((current) => ({
        ...current,
        connected: false,
        error: 'NEXT_PUBLIC_MQTT_BROKER_URL nao esta configurado.',
      }));
      return undefined;
    }

    // Prototype academico: as credenciais MQTT ficam no frontend para teste rapido.
    // Em producao, comandos e credenciais devem passar pelo backend com permissoes por dispositivo.
    const client = mqtt.connect(brokerUrl, {
      username,
      password,
      clean: true,
      connectTimeout: 6000,
      reconnectPeriod: 3000,
      protocolVersion: 4,
    });

    client.on('connect', () => {
      setState((current) => ({ ...current, connected: true, error: null }));
      client.subscribe([topics.telemetry, topics.status], { qos: 1 }, (subscribeError) => {
        if (subscribeError) {
          setState((current) => ({ ...current, error: subscribeError.message }));
        }
      });
    });

    client.on('reconnect', () => {
      setState((current) => ({ ...current, connected: false }));
    });

    client.on('close', () => {
      setState((current) => ({ ...current, connected: false }));
    });

    client.on('error', (mqttError) => {
      setState((current) => ({ ...current, error: mqttError.message }));
    });

    client.on('message', (topic, payloadBuffer) => {
      const raw = payloadBuffer.toString();
      try {
        const parsed = parseJsonObject(raw);
        const lastMessageAt = new Date().toISOString();

        setState((current) => ({
          ...current,
          telemetry: topic === topics.telemetry ? parsed : current.telemetry,
          status: topic === topics.status ? parsed : current.status,
          lastMessageAt,
          error: null,
        }));
      } catch {
        setState((current) => ({
          ...current,
          lastMessageAt: new Date().toISOString(),
          error: `Mensagem MQTT invalida em ${topic}: JSON mal formado.`,
        }));
      }
    });

    return () => {
      client.end(true);
    };
  }, [topics.status, topics.telemetry]);

  return state;
}
