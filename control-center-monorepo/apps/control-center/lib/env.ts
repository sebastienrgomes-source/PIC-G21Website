import { z } from 'zod';
import { MQTT_DEFAULTS } from '@/lib/mqtt-defaults';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_MQTT_BROKER_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_MQTT_USER: z.string().min(1).optional(),
  NEXT_PUBLIC_MQTT_PASS: z.string().min(1).optional(),
  NEXT_PUBLIC_DEVICE_UID: z.string().min(1).default(MQTT_DEFAULTS.deviceUid),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MQTT_BROKER_URL: z.string().min(1),
  MQTT_USER: z.string().min(1),
  MQTT_PASS: z.string().min(1),
});

const mqttServerEnvSchema = z.object({
  MQTT_BROKER_URL: z.string().min(1),
  MQTT_USER: z.string().min(1),
  MQTT_PASS: z.string().min(1),
});

export const getClientEnv = () =>
  clientEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MQTT_BROKER_URL: process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? MQTT_DEFAULTS.brokerUrl,
    NEXT_PUBLIC_MQTT_USER: process.env.NEXT_PUBLIC_MQTT_USER ?? MQTT_DEFAULTS.username,
    NEXT_PUBLIC_MQTT_PASS: process.env.NEXT_PUBLIC_MQTT_PASS ?? MQTT_DEFAULTS.password,
    NEXT_PUBLIC_DEVICE_UID: process.env.NEXT_PUBLIC_DEVICE_UID ?? MQTT_DEFAULTS.deviceUid,
  });

export const getServerEnv = () =>
  serverEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    MQTT_BROKER_URL: process.env.MQTT_BROKER_URL ?? MQTT_DEFAULTS.brokerUrl,
    MQTT_USER: process.env.MQTT_USER ?? MQTT_DEFAULTS.username,
    MQTT_PASS: process.env.MQTT_PASS ?? MQTT_DEFAULTS.password,
    NEXT_PUBLIC_MQTT_BROKER_URL: process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? MQTT_DEFAULTS.brokerUrl,
    NEXT_PUBLIC_MQTT_USER: process.env.NEXT_PUBLIC_MQTT_USER ?? MQTT_DEFAULTS.username,
    NEXT_PUBLIC_MQTT_PASS: process.env.NEXT_PUBLIC_MQTT_PASS ?? MQTT_DEFAULTS.password,
    NEXT_PUBLIC_DEVICE_UID: process.env.NEXT_PUBLIC_DEVICE_UID ?? MQTT_DEFAULTS.deviceUid,
  });

export const getMqttServerEnv = () =>
  mqttServerEnvSchema.parse({
    MQTT_BROKER_URL: process.env.MQTT_BROKER_URL ?? MQTT_DEFAULTS.brokerUrl,
    MQTT_USER: process.env.MQTT_USER ?? MQTT_DEFAULTS.username,
    MQTT_PASS: process.env.MQTT_PASS ?? MQTT_DEFAULTS.password,
  });
