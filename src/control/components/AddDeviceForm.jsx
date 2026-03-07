import { useState } from "react";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const copy = {
  pt: {
    fields: {
      deviceUid: "Device UID",
      deviceName: "Nome",
      deviceNamePlaceholder: "Colmeia 1 - Norte",
    },
    actions: {
      creating: "A criar...",
      create: "Adicionar dispositivo",
    },
    errors: {
      fallback: "Falha ao gerar codigo de pairing.",
    },
    result: {
      pairingCode: "Codigo de pairing",
      expiresAt: "expira",
      deviceUid: "Device UID",
      secret: "Device secret (prototipo)",
      firmwareHint: "O firmware deve chamar /api/device/pair com device_uid, pairing_code e device_secret antes de iniciar MQTT.",
    },
  },
  en: {
    fields: {
      deviceUid: "Device UID",
      deviceName: "Name",
      deviceNamePlaceholder: "Hive 1 - North",
    },
    actions: {
      creating: "Creating...",
      create: "Add device",
    },
    errors: {
      fallback: "Failed to generate pairing code.",
    },
    result: {
      pairingCode: "Pairing code",
      expiresAt: "expires",
      deviceUid: "Device UID",
      secret: "Device secret (prototype)",
      firmwareHint: "Firmware must call /api/device/pair with device_uid, pairing_code and device_secret before starting MQTT.",
    },
  },
};

export function AddDeviceForm({ onCreatePairing }) {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  const [deviceUid, setDeviceUid] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = await onCreatePairing({
        device_uid: deviceUid.trim(),
        name: name.trim() || undefined,
      });

      setResult(payload);
      setDeviceUid("");
      setName("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : text.errors.fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form className="grid gap-4 md:grid-cols-[1.25fr_1.25fr_auto]" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="device_uid">
            {text.fields.deviceUid}
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="device_uid"
            onChange={(event) => setDeviceUid(event.target.value)}
            placeholder="BEE-001-ESP32"
            required
            value={deviceUid}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="device_name">
            {text.fields.deviceName}
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="device_name"
            onChange={(event) => setName(event.target.value)}
            placeholder={text.fields.deviceNamePlaceholder}
            value={name}
          />
        </div>
        <div className="mt-auto">
          <Button className="h-11 w-full px-5 md:w-auto" disabled={loading} type="submit">
            {loading ? text.actions.creating : text.actions.create}
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">
            {text.result.pairingCode}:{" "}
            <span className="rounded-md bg-emerald-200 px-2 py-0.5 font-mono">{result.pairingCode}</span> ({text.result.expiresAt}{" "}
            {new Date(result.expiresAt).toLocaleString()})
          </p>
          <p className="mt-2">
            {text.result.deviceUid}: {result.deviceUid}
          </p>
          {result.provisioningSecret ? (
            <p className="mt-2">
              {text.result.secret}: <code className="rounded bg-emerald-200 px-1 py-0.5">{result.provisioningSecret}</code>
            </p>
          ) : null}
          <p className="mt-2 text-emerald-800/80">{text.result.firmwareHint}</p>
        </div>
      ) : null}
    </div>
  );
}
