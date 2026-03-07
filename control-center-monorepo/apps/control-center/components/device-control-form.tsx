'use client';

import { useState } from 'react';
import type { DeviceMode } from '@pic/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Props {
  deviceId: string;
  initialMode: DeviceMode;
  initialTSet: number;
}

interface CommandResponse {
  command: {
    id: string;
    status: string;
    payload: {
      duty: number;
      mode: DeviceMode;
      tSet: number;
    };
  };
  computed: {
    duty: number;
    state: string;
    effectiveMode: Exclude<DeviceMode, 'AUTO'>;
    reason: string;
    lowSolarBudget: boolean;
  };
}

const modeOptions = [
  { value: 'ECO', label: 'ECO' },
  { value: 'NORMAL', label: 'NORMAL' },
  { value: 'BOOST', label: 'BOOST' },
  { value: 'AUTO', label: 'AUTO' },
];

export function DeviceControlForm({ deviceId, initialMode, initialTSet }: Props) {
  const [tSet, setTSet] = useState(initialTSet);
  const [mode, setMode] = useState<DeviceMode>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommandResponse | null>(null);

  const apply = async () => {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/devices/${deviceId}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tSet, mode }),
      });

      const payload = (await response.json()) as CommandResponse | { error: string };
      if (!response.ok) throw new Error('error' in payload ? payload.error : 'Falha ao enviar comando');

      setResult(payload as CommandResponse);
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : 'Erro ao enviar comando');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="tset">
            Setpoint (2..20 C)
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
              min={2}
              max={20}
              step={0.5}
              value={tSet}
              onChange={(event) => setTSet(Number(event.target.value))}
              className="h-2 w-full accent-[hsl(var(--primary))]"
            />
            <Input
              className="h-10 w-24 rounded-lg border-blue-200 bg-white"
              max={20}
              min={2}
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
          onChange={(event) => setMode(event.target.value as DeviceMode)}
        />
      </div>

      <Button className="h-11 w-full" disabled={busy} onClick={apply}>
        {busy ? 'A aplicar...' : 'Apply'}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p>
            Comando enviado (status: {result.command.status}, duty: {result.command.payload.duty.toFixed(2)}).
          </p>
          <p>
            Estado calculado: {result.computed.state}, modo efetivo: {result.computed.effectiveMode}, regra:{' '}
            {result.computed.reason}.
          </p>
          {result.computed.lowSolarBudget ? (
            <p className="text-amber-700">Budget solar reduzido ativo: duty maximo foi limitado.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
