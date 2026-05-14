import { useState } from "react";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

const modeOptions = [
  { value: "AUTO", label: "Automatico" },
  { value: "MANUAL", label: "Manual" },
];

const copy = {
  pt: {
    labels: {
      setpoint: "Setpoint (2..20 C)",
      mode: "Modo",
    },
    actions: {
      applying: "A aplicar...",
      apply: "Aplicar",
      heaterOn: "Ligar aquecedor",
      heaterOff: "Desligar aquecedor",
      autoMode: "Modo automatico",
      manualMode: "Modo manual",
    },
    errors: {
      fallback: "Falha ao publicar no MQTT.",
    },
    result: {
      sent: "Comando enviado para ESP32.",
      topic: "Topico",
    },
  },
  en: {
    labels: {
      setpoint: "Setpoint (2..20 C)",
      mode: "Mode",
    },
    actions: {
      applying: "Applying...",
      apply: "Apply",
      heaterOn: "Turn heater on",
      heaterOff: "Turn heater off",
      autoMode: "Automatic mode",
      manualMode: "Manual mode",
    },
    errors: {
      fallback: "Falha ao publicar no MQTT.",
    },
    result: {
      sent: "Command sent to ESP32.",
      topic: "Topic",
    },
  },
};

export function DeviceControlForm({ deviceId, initialMode, initialTSet, onApply }) {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  const [tSet, setTSet] = useState(initialTSet);
  const [mode, setMode] = useState(initialMode === "AUTO" ? "AUTO" : "MANUAL");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const sendCommand = async (payload) => {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await onApply({ deviceId, payload });
      setResult(response);
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : text.errors.fallback);
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    await sendCommand({
      target_temperature_c: tSet,
      automatic_mode: mode === "AUTO",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="tset">
            {text.labels.setpoint}
          </Label>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#183f95]">
            {tSet.toFixed(1)} C
          </span>
        </div>
        <div className="rounded-2xl border border-blue-100/80 bg-[#f5f8ff] p-3">
          <div className="flex items-center gap-3">
            <input
              className="h-2 w-full accent-[hsl(var(--primary))]"
              id="tset"
              max={20}
              min={2}
              onChange={(event) => setTSet(Number(event.target.value))}
              step={0.5}
              type="range"
              value={tSet}
            />
            <Input
              className="h-10 w-24 rounded-lg border-blue-200 bg-white"
              max={20}
              min={2}
              onChange={(event) => setTSet(Number(event.target.value))}
              step={0.5}
              type="number"
              value={tSet}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="mode">
          {text.labels.mode}
        </Label>
        <Select
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="mode"
          onChange={(event) => setMode(event.target.value)}
          options={modeOptions}
          value={mode}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: true })}>
          {text.actions.heaterOn}
        </Button>
        <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: false })} variant="outline">
          {text.actions.heaterOff}
        </Button>
        <Button
          className="h-11"
          disabled={busy}
          onClick={() => {
            setMode("AUTO");
            void sendCommand({ automatic_mode: true });
          }}
          variant="outline"
        >
          {text.actions.autoMode}
        </Button>
        <Button
          className="h-11"
          disabled={busy}
          onClick={() => {
            setMode("MANUAL");
            void sendCommand({ automatic_mode: false });
          }}
          variant="outline"
        >
          {text.actions.manualMode}
        </Button>
      </div>

      <Button className="h-11 w-full" disabled={busy} onClick={apply}>
        {busy ? text.actions.applying : text.actions.apply}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">{text.result.sent}</p>
          {result.topic ? <p className="mt-1 break-all">{text.result.topic}: {result.topic}</p> : null}
          <code className="mt-2 block whitespace-pre-wrap break-all rounded-lg bg-white/70 px-2 py-1 font-mono text-[11px] leading-5">
            {JSON.stringify(result.payload, null, 2)}
          </code>
        </div>
      ) : null}
    </div>
  );
}
