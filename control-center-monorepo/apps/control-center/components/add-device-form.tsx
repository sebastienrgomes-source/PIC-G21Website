'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PairingResponse {
  pairingCode: string;
  expiresAt: string;
  deviceUid: string;
  provisioningSecret?: string;
}

export function AddDeviceForm() {
  const [deviceUid, setDeviceUid] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PairingResponse | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/pairing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_uid: deviceUid.trim(),
          name: name.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as PairingResponse | { error: string };
      if (!response.ok) throw new Error('error' in payload ? payload.error : 'Falha no pairing');
      setResult(payload as PairingResponse);
      setDeviceUid('');
      setName('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao gerar codigo de pairing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form className="grid gap-4 md:grid-cols-[1.25fr_1.25fr_auto]" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="device_uid">
            Device UID
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="device_uid"
            placeholder="BEE-001-ESP32"
            required
            value={deviceUid}
            onChange={(event) => setDeviceUid(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="device_name">
            Nome
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="device_name"
            placeholder="Hive 1 - Norte"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mt-auto">
          <Button className="h-11 w-full px-5 md:w-auto" disabled={loading} type="submit">
            {loading ? 'A criar...' : 'Add device'}
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">
            Pairing code: <span className="rounded-md bg-emerald-200 px-2 py-0.5 font-mono">{result.pairingCode}</span>{' '}
            (expira {new Date(result.expiresAt).toLocaleString()})
          </p>
          <p className="mt-2">Device UID: {result.deviceUid}</p>
          {result.provisioningSecret ? (
            <p className="mt-2">
              Device secret (prototipo): <code className="rounded bg-emerald-200 px-1 py-0.5">{result.provisioningSecret}</code>
            </p>
          ) : null}
          <p className="mt-2 text-emerald-800/80">
            O firmware deve chamar <code>/api/device/pair</code> com <code>device_uid</code>, <code>pairing_code</code> e
            <code> device_secret</code> antes de iniciar MQTT.
          </p>
        </div>
      ) : null}
    </div>
  );
}
