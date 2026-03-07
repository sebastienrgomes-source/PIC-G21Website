import { z } from 'zod';

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MQTT_BROKER_URL: z.string().min(1),
  MQTT_USER: z.string().min(1),
  MQTT_PASS: z.string().min(1),
});

export const getEnv = () =>
  schema.parse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    MQTT_BROKER_URL: process.env.MQTT_BROKER_URL,
    MQTT_USER: process.env.MQTT_USER,
    MQTT_PASS: process.env.MQTT_PASS,
  });
