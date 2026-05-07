import { z } from 'zod';

export const modeSchema = z.enum(['ECO', 'NORMAL', 'BOOST', 'AUTO']);
export type DeviceMode = z.infer<typeof modeSchema>;

export const deviceStateSchema = z.enum([
  'IDLE',
  'HEATING',
  'LOW_BATT',
  'PROTECT',
  'OFFLINE',
  'ONLINE',
]);
export type DeviceState = z.infer<typeof deviceStateSchema>;

export const commandPayloadSchema = z.object({
  heater_enabled: z.boolean().optional(),
  automatic_mode: z.boolean().optional(),
  target_temperature_c: z.number().min(0).max(35).optional(),
  mode: modeSchema.optional(),
}).refine(
  (payload) =>
    payload.heater_enabled !== undefined ||
    payload.automatic_mode !== undefined ||
    payload.target_temperature_c !== undefined ||
    payload.mode !== undefined,
  'Command payload must include at least one ESP32 command field',
);
export type CommandPayload = z.infer<typeof commandPayloadSchema>;

export const telemetryPayloadSchema = z.object({
  ts: z.number().int().positive().optional(),
  tInternal: z.number().optional(),
  tExternal: z.number().optional(),
  humidity: z.number().optional(),
  vBatt: z.number().optional(),
  iHeater: z.number().optional(),
  duty: z.number().min(0).max(1).optional(),
  state: deviceStateSchema.optional(),
  rssi: z.number().optional(),
  device_id: z.string().optional(),
  temperature_c: z.number().optional(),
  humidity_percent: z.number().optional(),
  target_temperature_c: z.number().optional(),
  heater_enabled: z.boolean().optional(),
  automatic_mode: z.boolean().optional(),
  rssi_dbm: z.number().optional(),
  uptime_s: z.number().optional(),
}).passthrough();
export type TelemetryPayload = z.infer<typeof telemetryPayloadSchema>;

export const ackPayloadSchema = z.object({
  msgId: z.string().uuid(),
  ts: z.number().int().positive().optional(),
  status: z.enum(['ok', 'error']).default('ok'),
  info: z.string().optional(),
});
export type AckPayload = z.infer<typeof ackPayloadSchema>;

export const statusPayloadSchema = z.object({
  status: z.string().optional(),
  wifi_status: z.string().optional(),
  ts: z.number().int().positive().optional(),
}).passthrough();
export type StatusPayload = z.infer<typeof statusPayloadSchema>;
