import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { commandPayloadSchema, modeSchema, type CommandPayload } from '@pic/shared';
import { z } from 'zod';
import { getDemoSession } from '@/lib/demo-auth';
import { getDemoDeviceById } from '@/lib/demo-data';
import { isDemoMode } from '@/lib/demo-mode';
import { jsonError } from '@/lib/http';
import { publishDeviceCommand } from '@/lib/mqtt-publisher';
import { requireAuthenticatedUser } from '@/lib/route-auth';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const runtime = 'nodejs';

const bodySchema = z.object({
  heater_enabled: z.boolean().optional(),
  automatic_mode: z.boolean().optional(),
  target_temperature_c: z.number().min(0).max(35).optional(),
  tSet: z.number().min(0).max(35).optional(),
  mode: modeSchema.optional(),
}).refine(
  (payload) =>
    payload.heater_enabled !== undefined ||
    payload.automatic_mode !== undefined ||
    payload.target_temperature_c !== undefined ||
    payload.tSet !== undefined ||
    payload.mode !== undefined,
  'Pedido sem campos de comando ESP32.',
);

type CommandRequest = z.infer<typeof bodySchema>;

const normalizeEsp32Payload = (body: CommandRequest): CommandPayload => {
  const payload: Partial<CommandPayload> = {};

  if (body.heater_enabled !== undefined) payload.heater_enabled = body.heater_enabled;
  if (body.automatic_mode !== undefined) payload.automatic_mode = body.automatic_mode;
  if (body.target_temperature_c !== undefined) payload.target_temperature_c = body.target_temperature_c;
  if (body.tSet !== undefined) payload.target_temperature_c = body.tSet;
  if (body.mode !== undefined) {
    if (body.automatic_mode === undefined) payload.automatic_mode = body.mode === 'AUTO';
  }
  if (payload.target_temperature_c !== undefined && payload.automatic_mode === undefined) {
    payload.automatic_mode = false;
  }

  const parsed = commandPayloadSchema.safeParse(payload);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
};

const commandTypeForPayload = (payload: CommandPayload): string => {
  if (payload.heater_enabled !== undefined) return 'SET_HEATER';
  if (payload.target_temperature_c !== undefined) return 'SET_SETPOINT';
  if (payload.automatic_mode !== undefined) return 'SET_AUTOMATIC_MODE';
  return 'ESP32_CONTROL';
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsedBody = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) return jsonError(parsedBody.error.message, 400);

  let esp32Payload: CommandPayload;
  try {
    esp32Payload = normalizeEsp32Payload(parsedBody.data);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Payload MQTT invalido.', 400);
  }

  const requestedDevice = params.id;

  if (isDemoMode()) {
    const session = getDemoSession();
    if (!session) return jsonError('Unauthorized', 401);

    const demoDevice = getDemoDeviceById(requestedDevice);
    const deviceUid = process.env.NEXT_PUBLIC_DEVICE_UID ?? demoDevice?.device_uid ?? requestedDevice;

    try {
      const published = await publishDeviceCommand(deviceUid, esp32Payload);
      return NextResponse.json({
        ok: true,
        topic: published.topic,
        payload: published.payload,
        command: {
          id: randomUUID(),
          status: 'sent',
          payload: published.payload,
          created_at: new Date().toISOString(),
        },
      });
    } catch (mqttError) {
      return jsonError(
        mqttError instanceof Error ? `Falha MQTT: ${mqttError.message}` : 'Falha MQTT ao publicar comando.',
        502,
      );
    }
  }

  const { errorResponse, user, supabase } = await requireAuthenticatedUser();
  if (errorResponse || !user || !supabase) return errorResponse;

  const byUid = await supabase
    .from('devices')
    .select('id, owner_id, device_uid')
    .eq('device_uid', requestedDevice)
    .maybeSingle();

  if (byUid.error) return jsonError(byUid.error.message, 500);

  let device = byUid.data as { id: string; owner_id: string | null; device_uid: string } | null;

  if (!device) {
    const byId = await supabase
      .from('devices')
      .select('id, owner_id, device_uid')
      .eq('id', requestedDevice)
      .maybeSingle();

    if (byId.error) return jsonError('Device nao encontrado.', 404);
    device = byId.data as { id: string; owner_id: string | null; device_uid: string } | null;
  }

  if (!device || device.owner_id !== user.id) return jsonError('Device nao encontrado.', 404);

  const service = createServiceRoleClient();
  const { data: command, error: commandError } = await service
    .from('device_commands')
    .insert({
      device_id: device.id,
      owner_id: user.id,
      command_type: commandTypeForPayload(esp32Payload),
      payload: esp32Payload,
      status: 'queued',
    })
    .select('id, status, payload, created_at')
    .single();

  if (commandError || !command) return jsonError(commandError?.message ?? 'Failed to create command', 500);

  try {
    const published = await publishDeviceCommand(device.device_uid, esp32Payload);
    await service.from('device_commands').update({ status: 'sent' }).eq('id', command.id);

    return NextResponse.json({
      ok: true,
      topic: published.topic,
      payload: published.payload,
      command: {
        ...command,
        status: 'sent',
        payload: published.payload,
      },
    });
  } catch (mqttError) {
    await service.from('device_commands').update({ status: 'failed' }).eq('id', command.id);
    return jsonError(
      mqttError instanceof Error ? `Falha MQTT: ${mqttError.message}` : 'Falha MQTT ao publicar comando.',
      502,
    );
  }
}
