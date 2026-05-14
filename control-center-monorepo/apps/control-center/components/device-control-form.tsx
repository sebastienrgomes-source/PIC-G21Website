'use client';

import { useState } from 'react';
import type { DeviceMode } from '@pic/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { publishCommand, type Esp32CommandPayload } from '@/lib/browser-mqtt-client';

interface Props {
  deviceId: string;
  deviceUid?: string;
  initialMode: DeviceMode;
  initialTSet: number;
}

interface CommandResponse {
  ok: boolean;
  topic: string;
  payload: Esp32CommandPayload;
  command?: {
    id: string;
    status: string;
    created_at?: string;
    payload: Esp32CommandPayload;
  };
}

const modeOptions = [
  { value: 'AUTO', label: 'Automatico' },
  { value: 'MANUAL', label: 'Manual' },
];

type ControlMode = 'AUTO' | 'MANUAL';

export function DeviceControlForm({ initialMode, initialTSet }: Props) {
  const [tSet, setTSet] = useState(initialTSet);
  const [mode, setMode] = useState<ControlMode>(initialMode === 'AUTO' ? 'AUTO' : 'MANUAL');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommandResponse | null>(null);

  const sendCommand = async (command: Esp32CommandPayload) => {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const published = await publishCommand(command);
      setResult({
        ok: true,
        topic: published.topic,
        payload: published.payload,
        command: {
          id: crypto.randomUUID(),
          status: 'sent',
          payload: published.payload,
          created_at: new Date().toISOString(),
        },
      });
    } catch {
      setError('Falha ao publicar no MQTT.');
    } finally {
      setBusy(false);
    }
  };

  const applySetpoint = async () => {
    await sendCommand({
      target_temperature_c: tSet,
      automatic_mode: mode === 'AUTO',
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="tset">
            Setpoint (0..35 C)
          </Label>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#183f95]">
            {tSet.toFixed(1)} C
          </span>
        </div>
        <div className="rounded-2xl border border-blue-100/80 bg-[#f5f8ff] p-3">
          <div className="flex items-center gap-3">
            <input
              id="tset"
              type="range"
              min={0}
              max={35}
              step={0.5}
              value={tSet}
              onChange={(event) => setTSet(Number(event.target.value))}
              className="h-2 w-full accent-[hsl(var(--primary))]"
            />
            <Input
              className="h-10 w-24 rounded-lg border-blue-200 bg-white"
              max={35}
              min={0}
              step={0.5}
              type="number"
              value={tSet}
              onChange={(event) => setTSet(Number(event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="mode">
          Mode
        </Label>
        <Select
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="mode"
          options={modeOptions}
          value={mode}
          onChange={(event) => setMode(event.target.value as ControlMode)}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: true })}>
          Ligar aquecedor
        </Button>
        <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: false })} variant="outline">
          Desligar aquecedor
        </Button>
        <Button
          className="h-11"
          disabled={busy}
          onClick={() => {
            setMode('AUTO');
            void sendCommand({ automatic_mode: true });
          }}
          variant="outline"
        >
          Modo automatico
        </Button>
        <Button
          className="h-11"
          disabled={busy}
          onClick={() => {
            setMode('MANUAL');
            void sendCommand({ automatic_mode: false });
          }}
          variant="outline"
        >
          Modo manual
        </Button>
      </div>

      <Button className="h-11 w-full" disabled={busy} onClick={applySetpoint}>
        {busy ? 'A enviar...' : 'Aplicar setpoint'}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">Comando enviado para ESP32.</p>
          <p className="mt-1 break-all">Topico: {result.topic}</p>
          <code className="mt-2 block whitespace-pre-wrap break-all rounded-lg bg-white/70 px-2 py-1 font-mono text-[11px] leading-5">
            {JSON.stringify(result.payload, null, 2)}
          </code>
        </div>
      ) : null}
    </div>
  );
}
