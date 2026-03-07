import { useState } from "react";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { DEVICE_MODES } from "../../shared/utils/control";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

const modeOptions = DEVICE_MODES.map((mode) => ({ value: mode, label: mode }));

const copy = {
  pt: {
    labels: {
      setpoint: "Setpoint (2..20 C)",
      mode: "Modo",
    },
    actions: {
      applying: "A aplicar...",
      apply: "Aplicar",
    },
    errors: {
      fallback: "Erro ao enviar comando",
    },
    result: {
      sent: "Comando enviado",
      computedState: "Estado calculado",
      effectiveMode: "modo efetivo",
      rule: "regra",
      lowSolar: "Budget solar reduzido ativo: duty maximo foi limitado.",
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
    },
    errors: {
      fallback: "Error sending command",
    },
    result: {
      sent: "Command sent",
      computedState: "Computed state",
      effectiveMode: "effective mode",
      rule: "rule",
      lowSolar: "Reduced solar budget active: max duty was limited.",
    },
  },
};

export function DeviceControlForm({ deviceId, initialMode, initialTSet, onApply }) {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  const [tSet, setTSet] = useState(initialTSet);
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const apply = async () => {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const payload = await onApply({ deviceId, tSet, mode });
      setResult(payload);
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : text.errors.fallback);
    } finally {
      setBusy(false);
    }
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

      <Button className="h-11 w-full" disabled={busy} onClick={apply}>
        {busy ? text.actions.applying : text.actions.apply}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p>
            {text.result.sent} (status: {result.command.status}, duty: {result.command.payload.duty.toFixed(2)}).
          </p>
          <p>
            {text.result.computedState}: {result.computed.state}, {text.result.effectiveMode}: {result.computed.effectiveMode},{" "}
            {text.result.rule}: {result.computed.reason}.
          </p>
          {result.computed.lowSolarBudget ? <p className="text-amber-700">{text.result.lowSolar}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
