import type { DeviceMode, DeviceState } from '@pic/shared';

export interface Device {
  id: string;
  owner_id: string | null;
  name: string;
  device_uid: string;
  status: string;
  last_seen_at: string | null;
  created_at: string;
}

export interface DeviceSettings {
  device_id: string;
  mode: DeviceMode;
  t_set: number;
  t_band: number;
  max_duty: number;
  min_batt_v: number;
  max_heater_w: number;
  updated_at: string;
}

export interface DeviceTelemetry {
  id: number;
  device_id: string;
  ts: string;
  t_internal: number | null;
  t_external: number | null;
  humidity: number | null;
  v_batt: number | null;
  i_heater: number | null;
  duty: number | null;
  state: DeviceState | null;
  raw: Record<string, unknown> | null;
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  owner_id: string | null;
  command_type: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
}
