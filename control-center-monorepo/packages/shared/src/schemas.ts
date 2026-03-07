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
  msgId: z.string().uuid(),
  type: z.literal('SET_CONTROL'),
  tSet: z.number().min(0).max(30),
  mode: modeSchema,
  duty: z.number().min(0).max(1),
  maxDuty: z.number().min(0).max(1),
  ts: z.number().int().positive(),
});
export type CommandPayload = z.infer<typeof commandPayloadSchema>;

export const telemetryPayloadSchema = z.object({
  ts: z.number().int().positive(),
  tInternal: z.number().optional(),
  tExternal: z.number().optional(),
  humidity: z.number().optional(),
  vBatt: z.number().optional(),
  iHeater: z.number().optional(),
  duty: z.number().min(0).max(1).optional(),
  state: deviceStateSchema.optional(),
  rssi: z.number().optional(),
});
export type TelemetryPayload = z.infer<typeof telemetryPayloadSchema>;

export const ackPayloadSchema = z.object({
  msgId: z.string().uuid(),
  ts: z.number().int().positive().optional(),
  status: z.enum(['ok', 'error']).default('ok'),
  info: z.string().optional(),
});
export type AckPayload = z.infer<typeof ackPayloadSchema>;

export const statusPayloadSchema = z.object({
  status: z.enum(['online', 'offline']),
  ts: z.number().int().positive().optional(),
});
export type StatusPayload = z.infer<typeof statusPayloadSchema>;
