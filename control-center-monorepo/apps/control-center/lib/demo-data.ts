import type { DeviceMode, DeviceState } from '@pic/shared';
import type { Device, DeviceCommand, DeviceSettings, DeviceTelemetry } from '@/types/domain';

interface DemoDeviceConfig {
  id: string;
  name: string;
  uid: string;
  status: string;
  lastSeenOffsetMin: number;
  createdAtOffsetHours: number;
  tempBase: number;
  battBase: number;
  phase: number;
}

const demoConfig: DemoDeviceConfig[] = [
  {
    id: 'demo-hive-01',
    name: 'Hive Norte',
    uid: 'BEE-001-ESP32',
    status: 'online',
    lastSeenOffsetMin: 1,
    createdAtOffsetHours: 72,
    tempBase: 7.5,
    battBase: 12.2,
    phase: 0,
  },
  {
    id: 'demo-hive-02',
    name: 'Hive Sul',
    uid: 'BEE-002-ESP32',
    status: 'online',
    lastSeenOffsetMin: 3,
    createdAtOffsetHours: 36,
    tempBase: 8.3,
    battBase: 12.0,
    phase: 8,
  },
];

const modeByDevice: Record<string, DeviceMode> = {
  'demo-hive-01': 'AUTO',
  'demo-hive-02': 'ECO',
};

const safeState = (duty: number, batt: number): DeviceState => {
  if (batt < 11.6) return 'LOW_BATT';
  return duty > 0 ? 'HEATING' : 'IDLE';
};

const buildTelemetry = (config: DemoDeviceConfig): DeviceTelemetry[] => {
  const now = Date.now();
  const points: DeviceTelemetry[] = [];

  for (let idx = 95; idx >= 0; idx -= 1) {
    const ts = new Date(now - idx * 15 * 60 * 1000).toISOString();
    const waveA = Math.sin((idx + config.phase) / 7);
    const waveB = Math.cos((idx + config.phase) / 11);

    const tInternal = Number((config.tempBase + waveA * 1.15 + waveB * 0.35).toFixed(2));
    const vBatt = Number((config.battBase + Math.cos((idx + config.phase) / 17) * 0.25).toFixed(2));
    const duty = tInternal < 7.8 ? 0.72 : tInternal > 9.2 ? 0 : 0.2;
    const state = safeState(duty, vBatt);

    points.push({
      id: 1000 + idx,
      device_id: config.id,
      ts,
      t_internal: tInternal,
      t_external: Number((5.8 + waveB * 1.9).toFixed(2)),
      humidity: Number((58 + waveA * 4).toFixed(2)),
      v_batt: vBatt,
      i_heater: Number((duty * 2.8).toFixed(2)),
      duty,
      state,
      raw: {
        ts: Date.parse(ts),
        tInternal,
        vBatt,
        duty,
        state,
      },
    });
  }

  return points;
};

export const getDemoDevices = (): Device[] => {
  const now = Date.now();
  return demoConfig.map((device) => ({
    id: device.id,
    owner_id: 'demo-user',
    name: device.name,
    device_uid: device.uid,
    status: device.status,
    last_seen_at: new Date(now - device.lastSeenOffsetMin * 60 * 1000).toISOString(),
    created_at: new Date(now - device.createdAtOffsetHours * 60 * 60 * 1000).toISOString(),
  }));
};

export const getDemoDeviceById = (id: string): Device | null =>
  getDemoDevices().find((device) => device.id === id) ?? null;

export const getDemoDeviceSettings = (deviceId: string): DeviceSettings => ({
  device_id: deviceId,
  mode: modeByDevice[deviceId] ?? 'AUTO',
  t_set: 8,
  t_band: 1,
  max_duty: 0.8,
  min_batt_v: 11.6,
  max_heater_w: 60,
  updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
});

export const getDemoTelemetry = (deviceId: string): DeviceTelemetry[] => {
  const config = demoConfig.find((item) => item.id === deviceId) ?? demoConfig[0];
  return buildTelemetry(config);
};

export const getDemoCommands = (deviceId: string): DeviceCommand[] => {
  const now = Date.now();
  return [
    {
      id: `${deviceId}-cmd-1`,
      device_id: deviceId,
      owner_id: 'demo-user',
      command_type: 'SET_CONTROL',
      payload: {
        msgId: `${deviceId}-msg-1`,
        type: 'SET_CONTROL',
        tSet: 8,
        mode: 'AUTO',
        duty: 0.2,
        maxDuty: 0.8,
        ts: now - 8 * 60 * 1000,
      },
      status: 'acked',
      created_at: new Date(now - 8 * 60 * 1000).toISOString(),
    },
    {
      id: `${deviceId}-cmd-2`,
      device_id: deviceId,
      owner_id: 'demo-user',
      command_type: 'SET_CONTROL',
      payload: {
        msgId: `${deviceId}-msg-2`,
        type: 'SET_CONTROL',
        tSet: 8.5,
        mode: 'BOOST',
        duty: 0.8,
        maxDuty: 0.8,
        ts: now - 42 * 60 * 1000,
      },
      status: 'acked',
      created_at: new Date(now - 42 * 60 * 1000).toISOString(),
    },
  ];
};
