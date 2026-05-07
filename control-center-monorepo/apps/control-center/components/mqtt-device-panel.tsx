'use client';

import { useMemo } from 'react';
import { deviceTopic } from '@pic/shared';
import { useMqttDevice, type MqttDeviceMessage } from '@/lib/use-mqtt-device';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  deviceUid?: string;
}

const asNumber = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const asBoolean = (value: unknown): boolean | null => (typeof value === 'boolean' ? value : null);
const asText = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
};

const formatNumber = (value: number | null, suffix = '', digits = 1) =>
  value === null ? '--' : `${value.toFixed(digits)}${suffix}`;

const formatBool = (value: boolean | null, onLabel: string, offLabel: string) => {
  if (value === null) return '--';
  return value ? onLabel : offLabel;
};

const formatUptime = (seconds: number | null) => {
  if (seconds === null) return '--';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

const readMetric = (telemetry: MqttDeviceMessage | null, key: string): unknown => telemetry?.[key];

export function MqttDevicePanel({ deviceUid = process.env.NEXT_PUBLIC_DEVICE_UID ?? 'esp32-001' }: Props) {
  const { connected, telemetry, status, lastMessageAt, error } = useMqttDevice(deviceUid);

  const metrics = useMemo(() => {
    const temperature = asNumber(readMetric(telemetry, 'temperature_c'));
    const humidity = asNumber(readMetric(telemetry, 'humidity_percent'));
    const target = asNumber(readMetric(telemetry, 'target_temperature_c'));
    const heaterEnabled = asBoolean(readMetric(telemetry, 'heater_enabled'));
    const automaticMode = asBoolean(readMetric(telemetry, 'automatic_mode'));
    const ip = asText(readMetric(telemetry, 'ip'));
    const rssi = asNumber(readMetric(telemetry, 'rssi_dbm'));
    const uptime = asNumber(readMetric(telemetry, 'uptime_s'));
    const wifiStatus = asText(readMetric(telemetry, 'wifi_status')) ?? asText(status?.status) ?? asText(status?.wifi_status);

    return {
      temperature,
      humidity,
      target,
      heaterEnabled,
      automaticMode,
      ip,
      rssi,
      uptime,
      wifiStatus,
    };
  }, [status, telemetry]);

  const rows = [
    { label: 'Temperatura', value: formatNumber(metrics.temperature, ' C') },
    { label: 'Humidade', value: formatNumber(metrics.humidity, '%') },
    { label: 'Setpoint', value: formatNumber(metrics.target, ' C') },
    { label: 'Aquecedor', value: formatBool(metrics.heaterEnabled, 'ON', 'OFF') },
    { label: 'Modo', value: formatBool(metrics.automaticMode, 'Automatico', 'Manual') },
    { label: 'IP ESP32', value: metrics.ip ?? '--' },
    { label: 'RSSI', value: metrics.rssi === null ? '--' : `${metrics.rssi} dBm` },
    { label: 'Uptime', value: formatUptime(metrics.uptime) },
  ];

  return (
    <Card className="border-blue-100/80 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-2xl text-[#0a1b58]">MQTT ESP32</CardTitle>
            <CardDescription>
              {deviceTopic.telemetry(deviceUid)} | {deviceTopic.status(deviceUid)}
            </CardDescription>
          </div>
          <Badge variant={connected ? 'success' : 'outline'}>{connected ? 'MQTT ligado' : 'MQTT desligado'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map((row) => (
            <div key={row.label} className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">{row.label}</p>
              <p className="mt-1 min-h-7 break-words font-heading text-2xl leading-tight text-[#0a1b58]">{row.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">Wi-Fi ESP32</p>
            <p className="mt-1 text-sm font-semibold text-[#22376f]">{metrics.wifiStatus ?? '--'}</p>
          </div>
          <div className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">Ultima mensagem</p>
            <p className="mt-1 text-sm font-semibold text-[#22376f]">
              {lastMessageAt ? new Date(lastMessageAt).toLocaleString() : '--'}
            </p>
          </div>
          <div className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">Dispositivo</p>
            <p className="mt-1 text-sm font-semibold text-[#22376f]">{deviceUid}</p>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="rounded-2xl border border-blue-100/80 bg-[#081956] p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-100">JSON completo da telemetria</p>
            <Badge className="border-white/20 text-blue-50" variant="outline">
              {telemetry ? 'Recebido' : 'A aguardar'}
            </Badge>
          </div>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-blue-50">
            {telemetry ? JSON.stringify(telemetry, null, 2) : '{ }'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
