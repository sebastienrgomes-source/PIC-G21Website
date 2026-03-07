import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { computeDutyCycle, modeSchema } from '@pic/shared';
import { z } from 'zod';
import { getDemoSession } from '@/lib/demo-auth';
import { getDemoDeviceById, getDemoDeviceSettings, getDemoTelemetry } from '@/lib/demo-data';
import { isDemoMode } from '@/lib/demo-mode';
import { jsonError } from '@/lib/http';
import { publishDeviceCommand } from '@/lib/mqtt-publisher';
import { requireAuthenticatedUser } from '@/lib/route-auth';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const runtime = 'nodejs';

const bodySchema = z.object({
  tSet: z.number().min(2).max(20),
  mode: modeSchema,
});

const isLowSolarBudget = (batterySamples: Array<number | null>, minBattV: number): boolean => {
  const values = batterySamples.filter((sample): sample is number => typeof sample === 'number');
  if (values.length < 3) return false;

  const peak = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

  return peak < minBattV + 0.45 || avg < minBattV + 0.2;
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const { tSet, mode } = parsed.data;

  if (isDemoMode()) {
    const session = getDemoSession();
    if (!session) return jsonError('Unauthorized', 401);

    const device = getDemoDeviceById(params.id);
    if (!device) return jsonError('Device nao encontrado.', 404);

    const settings = getDemoDeviceSettings(params.id);
    const latestTelemetry = getDemoTelemetry(params.id).at(-1);

    const dutyResult = computeDutyCycle({
      tInternal: latestTelemetry?.t_internal ?? null,
      tSet,
      tBand: Number(settings.t_band),
      maxDuty: Number(settings.max_duty),
      vBatt: latestTelemetry?.v_batt ?? null,
      minBattV: Number(settings.min_batt_v),
      mode,
      lowSolarBudget: false,
    });

    const commandPayload = {
      msgId: randomUUID(),
      type: 'SET_CONTROL' as const,
      tSet,
      mode,
      duty: dutyResult.duty,
      maxDuty: Number(settings.max_duty),
      ts: Date.now(),
    };

    return NextResponse.json({
      command: {
        id: randomUUID(),
        status: 'sent',
        payload: commandPayload,
        created_at: new Date().toISOString(),
      },
      computed: {
        ...dutyResult,
        lowSolarBudget: false,
      },
    });
  }

  const { errorResponse, user, supabase } = await requireAuthenticatedUser();
  if (errorResponse || !user || !supabase) return errorResponse;

  const deviceId = params.id;

  const { data: device, error: deviceError } = await supabase
    .from('devices')
    .select('id, owner_id, device_uid')
    .eq('id', deviceId)
    .maybeSingle();

  if (deviceError) return jsonError(deviceError.message, 500);
  if (!device || device.owner_id !== user.id) return jsonError('Device nao encontrado.', 404);

  const service = createServiceRoleClient();
  const { data: settingsRow, error: settingsError } = await service
    .from('device_settings')
    .select('device_id, mode, t_set, t_band, max_duty, min_batt_v, max_heater_w')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (settingsError) return jsonError(settingsError.message, 500);

  const settings = settingsRow ?? {
    device_id: deviceId,
    mode: 'AUTO',
    t_set: 8,
    t_band: 1,
    max_duty: 0.8,
    min_batt_v: 11.6,
    max_heater_w: 60,
  };

  const { data: latestTelemetry, error: telemetryError } = await service
    .from('device_telemetry')
    .select('t_internal, v_batt')
    .eq('device_id', deviceId)
    .order('ts', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (telemetryError) return jsonError(telemetryError.message, 500);

  const lowSolarStartIso = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const { data: recentTelemetry, error: recentTelemetryError } = await service
    .from('device_telemetry')
    .select('v_batt')
    .eq('device_id', deviceId)
    .gte('ts', lowSolarStartIso)
    .order('ts', { ascending: false })
    .limit(72);

  if (recentTelemetryError) return jsonError(recentTelemetryError.message, 500);

  const lowSolarBudget = isLowSolarBudget(
    (recentTelemetry ?? []).map((row) => row.v_batt),
    Number(settings.min_batt_v),
  );

  const dutyResult = computeDutyCycle({
    tInternal: latestTelemetry?.t_internal ?? null,
    tSet,
    tBand: Number(settings.t_band),
    maxDuty: Number(settings.max_duty),
    vBatt: latestTelemetry?.v_batt ?? null,
    minBattV: Number(settings.min_batt_v),
    mode,
    lowSolarBudget,
  });

  const msgId = randomUUID();
  const commandPayload = {
    msgId,
    type: 'SET_CONTROL' as const,
    tSet,
    mode,
    duty: dutyResult.duty,
    maxDuty: Number(settings.max_duty),
    ts: Date.now(),
  };

  const { data: command, error: commandError } = await service
    .from('device_commands')
    .insert({
      device_id: deviceId,
      owner_id: user.id,
      command_type: 'SET_CONTROL',
      payload: commandPayload,
      status: 'queued',
    })
    .select('id, status, payload, created_at')
    .single();

  if (commandError || !command) return jsonError(commandError?.message ?? 'Failed to create command', 500);

  const { error: settingsUpdateError } = await service
    .from('device_settings')
    .upsert(
      {
        device_id: deviceId,
        mode,
        t_set: tSet,
        t_band: settings.t_band,
        max_duty: settings.max_duty,
        min_batt_v: settings.min_batt_v,
        max_heater_w: settings.max_heater_w,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'device_id' },
    );
  if (settingsUpdateError) return jsonError(settingsUpdateError.message, 500);

  try {
    await publishDeviceCommand(device.device_uid, commandPayload);
    await service.from('device_commands').update({ status: 'sent' }).eq('id', command.id);

    return NextResponse.json({
      command: {
        ...command,
        status: 'sent',
        payload: commandPayload,
      },
      computed: {
        ...dutyResult,
        lowSolarBudget,
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
