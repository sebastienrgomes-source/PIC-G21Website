import 'dotenv/config';
import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';
import {
  ackPayloadSchema,
  extractDeviceUidFromTopic,
  statusPayloadSchema,
  telemetryPayloadSchema,
} from '@pic/shared';
import { getEnv } from './env.js';

const env = getEnv();

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const deviceIdCache = new Map<string, string>();

const log = (...args: unknown[]) => {
  console.log(new Date().toISOString(), '-', ...args);
};

const resolveDeviceId = async (deviceUid: string): Promise<string | null> => {
  const cached = deviceIdCache.get(deviceUid);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('devices')
    .select('id')
    .eq('device_uid', deviceUid)
    .maybeSingle();

  if (error) {
    log('resolve device error', deviceUid, error.message);
    return null;
  }
  if (!data?.id) return null;

  deviceIdCache.set(deviceUid, data.id);
  return data.id;
};

const parseJson = <T>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const handleTelemetry = async (topic: string, payloadRaw: string) => {
  const deviceUid = extractDeviceUidFromTopic(topic);
  if (!deviceUid) return;

  const raw = parseJson<unknown>(payloadRaw);
  if (raw === null) {
    log('invalid telemetry json', deviceUid);
    return;
  }

  const parsedPayload = telemetryPayloadSchema.safeParse(raw);
  if (!parsedPayload.success) {
    log('invalid telemetry payload', deviceUid, parsedPayload.error.message);
    return;
  }

  const telemetry = parsedPayload.data;
  const deviceId = await resolveDeviceId(deviceUid);
  if (!deviceId) {
    log('telemetry ignored, unknown device uid', deviceUid);
    return;
  }

  const telemetryTsIso = new Date(telemetry.ts).toISOString();

  const { error: insertError } = await supabase.from('device_telemetry').insert({
    device_id: deviceId,
    ts: telemetryTsIso,
    t_internal: telemetry.tInternal ?? null,
    t_external: telemetry.tExternal ?? null,
    humidity: telemetry.humidity ?? null,
    v_batt: telemetry.vBatt ?? null,
    i_heater: telemetry.iHeater ?? null,
    duty: telemetry.duty ?? null,
    state: telemetry.state ?? null,
    raw: telemetry,
  });

  if (insertError) {
    log('telemetry insert error', deviceUid, insertError.message);
    return;
  }

  const { error: updateError } = await supabase
    .from('devices')
    .update({
      status: 'online',
      last_seen_at: telemetryTsIso,
    })
    .eq('id', deviceId);

  if (updateError) log('device status update error', deviceUid, updateError.message);
};

const handleAck = async (topic: string, payloadRaw: string) => {
  const deviceUid = extractDeviceUidFromTopic(topic);
  if (!deviceUid) return;

  const raw = parseJson<unknown>(payloadRaw);
  if (raw === null) {
    log('invalid ack json', deviceUid);
    return;
  }

  const parsedPayload = ackPayloadSchema.safeParse(raw);
  if (!parsedPayload.success) {
    log('invalid ack payload', deviceUid, parsedPayload.error.message);
    return;
  }

  const ack = parsedPayload.data;
  const deviceId = await resolveDeviceId(deviceUid);
  if (!deviceId) {
    log('ack ignored, unknown device uid', deviceUid);
    return;
  }

  const { error } = await supabase
    .from('device_commands')
    .update({ status: ack.status === 'ok' ? 'acked' : 'failed' })
    .eq('device_id', deviceId)
    .eq('payload->>msgId', ack.msgId)
    .in('status', ['queued', 'sent']);

  if (error) {
    log('ack update error', deviceUid, error.message);
  } else {
    log('ack applied', deviceUid, ack.msgId);
  }
};

const handleStatus = async (topic: string, payloadRaw: string) => {
  const deviceUid = extractDeviceUidFromTopic(topic);
  if (!deviceUid) return;

  const raw = parseJson<unknown>(payloadRaw);
  if (raw === null) {
    log('invalid status json', deviceUid);
    return;
  }

  const parsedPayload = statusPayloadSchema.safeParse(raw);
  if (!parsedPayload.success) {
    log('invalid status payload', deviceUid, parsedPayload.error.message);
    return;
  }

  const status = parsedPayload.data;
  const deviceId = await resolveDeviceId(deviceUid);
  if (!deviceId) return;

  const statusTsIso = new Date(status.ts ?? Date.now()).toISOString();

  const { error } = await supabase
    .from('devices')
    .update({
      status: status.status,
      last_seen_at: statusTsIso,
    })
    .eq('id', deviceId);

  if (error) log('status update error', deviceUid, error.message);
};

const start = () => {
  const client = mqtt.connect(env.MQTT_BROKER_URL, {
    username: env.MQTT_USER,
    password: env.MQTT_PASS,
    reconnectPeriod: 3000,
    connectTimeout: 10_000,
    protocolVersion: 4,
  });

  client.on('connect', () => {
    log('mqtt connected');
    client.subscribe(['devices/+/telemetry', 'devices/+/ack', 'devices/+/status'], { qos: 1 }, (error) => {
      if (error) log('subscribe error', error.message);
      else log('subscriptions active');
    });
  });

  client.on('reconnect', () => log('mqtt reconnecting'));
  client.on('error', (error) => log('mqtt error', error.message));
  client.on('close', () => log('mqtt connection closed'));

  client.on('message', async (topic, payloadBuffer) => {
    const payloadRaw = payloadBuffer.toString();
    try {
      if (topic.endsWith('/telemetry')) {
        await handleTelemetry(topic, payloadRaw);
        return;
      }
      if (topic.endsWith('/ack')) {
        await handleAck(topic, payloadRaw);
        return;
      }
      if (topic.endsWith('/status')) {
        await handleStatus(topic, payloadRaw);
      }
    } catch (error) {
      log('message processing error', topic, error instanceof Error ? error.message : String(error));
    }
  });
};

start();
