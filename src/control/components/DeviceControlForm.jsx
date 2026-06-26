import { useState } from "react";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const minTemperature = 2;
const maxTemperature = 20;
const temperatureStep = 0.5;

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

  const clampTemperature = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return tSet;
    return Math.min(maxTemperature, Math.max(minTemperature, numericValue));
  };

  const adjustTemperature = (delta) => {
    setTSet((value) => clampTemperature(Number((value + delta).toFixed(1))));
  };

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
    <div className="control-form">
      <div className="control-form-section">
        <div className="flex items-center justify-between gap-3">
          <Label className="control-form-label" htmlFor="tset">
            {text.labels.setpoint}
          </Label>
          <Input
            className="control-temp-input"
            max={maxTemperature}
            min={minTemperature}
            onChange={(event) => setTSet(clampTemperature(event.target.value))}
            step={temperatureStep}
            type="number"
            value={tSet}
          />
        </div>

        <div className="control-temp-stepper">
          <Button aria-label="Decrease target temperature" className="control-step-button" disabled={busy || tSet <= minTemperature} onClick={() => adjustTemperature(-temperatureStep)} variant="outline">
            -
          </Button>
          <div className="control-temp-readout">
            <span>{tSet.toFixed(1)}</span>
            <small>C</small>
          </div>
          <Button aria-label="Increase target temperature" className="control-step-button control-step-button--hot" disabled={busy || tSet >= maxTemperature} onClick={() => adjustTemperature(temperatureStep)}>
            +
          </Button>
        </div>

        <input
          aria-label={text.labels.setpoint}
          className="control-range"
          id="tset"
          max={maxTemperature}
          min={minTemperature}
          onChange={(event) => setTSet(Number(event.target.value))}
          step={temperatureStep}
          type="range"
          value={tSet}
        />
        <div className="control-range-labels">
          <span>{minTemperature}C</span>
          <span>{maxTemperature}C</span>
        </div>
      </div>

      <div className="control-form-section">
        <Label className="control-form-label" htmlFor="mode-auto">
          {text.labels.mode}
        </Label>
        <div aria-label={text.labels.mode} className="control-mode-switch" role="group">
          <Button
            className={mode === "AUTO" ? "is-active" : ""}
            disabled={busy}
            id="mode-auto"
            onClick={() => {
              setMode("AUTO");
              void sendCommand({ automatic_mode: true });
            }}
            variant="outline"
          >
            Automatic
          </Button>
          <Button
            className={mode === "MANUAL" ? "is-active" : ""}
            disabled={busy}
            onClick={() => {
              setMode("MANUAL");
              void sendCommand({ automatic_mode: false });
            }}
            variant="outline"
          >
            Manual
          </Button>
        </div>
      </div>

      {mode === "AUTO" ? (
        <div className="control-mode-message">
          <span className="control-mode-check">OK</span>
          <span>
            <strong>Automatic Thermal Control Active</strong>
            <small>Maintains the target temperature automatically.</small>
          </span>
        </div>
      ) : (
        <div className="control-manual-actions">
          <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: true })}>
            {text.actions.heaterOn}
          </Button>
          <Button className="h-11" disabled={busy} onClick={() => sendCommand({ heater_enabled: false })} variant="outline">
            {text.actions.heaterOff}
          </Button>
        </div>
      )}

      <Button className="h-11 w-full" disabled={busy} onClick={apply}>
        {busy ? text.actions.applying : text.actions.apply}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">{text.result.sent}</p>
          {result.topic ? (
            <p className="mt-1 break-all">
              {text.result.topic}: {result.topic}
            </p>
          ) : null}
          <code className="mt-2 block whitespace-pre-wrap break-all rounded-lg bg-white/70 px-2 py-1 font-mono text-[11px] leading-5">
            {JSON.stringify(result.payload, null, 2)}
          </code>
        </div>
      ) : null}
    </div>
  );
}
