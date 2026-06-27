import { useEffect, useState } from "react";
import { subscribeDeviceMessages } from "../services/mqtt-client";

const emptyState = {
  connected: false,
  telemetry: null,
  status: null,
  telemetryHistory: [],
  lastMessageAt: null,
  error: null,
};

export function useMqttDeviceFeed(deviceUid) {
  const [state, setState] = useState(emptyState);

  useEffect(() => {
    if (!deviceUid) {
      setState(emptyState);
      return undefined;
    }

    let mounted = true;
    let cleanup = () => {};

    setState(emptyState);

    subscribeDeviceMessages({
      deviceUid,
      onConnectionChange(connected) {
        if (!mounted) return;
        setState((current) => ({ ...current, connected }));
      },
      onTelemetry(payload, meta) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          telemetry: payload,
          telemetryHistory: [...current.telemetryHistory, { payload, receivedAt: meta.receivedAt }].slice(-96),
          lastMessageAt: meta.receivedAt,
          error: null,
        }));
      },
      onStatus(payload, meta) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          status: payload,
          lastMessageAt: meta.receivedAt,
          error: null,
        }));
      },
      onError(error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : "Falha na leitura MQTT.",
        }));
      },
    }).then((unsubscribe) => {
      cleanup = unsubscribe;
      if (!mounted) {
        unsubscribe();
      }
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, [deviceUid]);

  return state;
}
