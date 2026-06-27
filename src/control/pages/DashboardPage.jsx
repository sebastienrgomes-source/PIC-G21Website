import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import heatSpotLogo from "../assets/heatspot-logo-reference.png";
import { AddDeviceForm } from "../components/AddDeviceForm";
import { DeviceControlForm } from "../components/DeviceControlForm";
import { SignOutButton } from "../components/SignOutButton";
import { TelemetryChart } from "../components/TelemetryChart";
import { useMqttDeviceFeed } from "../hooks/useMqttDeviceFeed";
import { applyDemoCommand, createDemoPairing, getDemoCommands, getDemoDeviceSettings, getDemoTelemetry, listDemoDevices } from "../services/demo-store";
import { cn } from "../../shared/utils/cn";

const unavailable = "--";
const tempMin = 2;
const tempMax = 42;

const iconPaths = {
  home: "M3 11.5 12 4l9 7.5v8a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5v-8Z",
  devices: "M5 5h14v10H5V5Zm3 14h8M10 15v4m4-4v4",
  automation: "M5 7h4m6 0h4M5 17h4m6 0h4M9 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm2 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z",
  settings: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0-5 1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4L12 3.5Z",
  wifi: "M4 9c4.7-4 11.3-4 16 0M7 12.5c2.9-2.4 7.1-2.4 10 0M10 16c1.2-.9 2.8-.9 4 0m-2 3h.01",
  battery: "M6 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm13 3h1.5v4H19M8 10v4",
  temperature: "M10 4a2 2 0 0 1 4 0v8.3a4 4 0 1 1-4 0V4Zm2 10v-4",
  target: "M12 4v3m0 10v3m8-8h-3M7 12H4m12.3-4.3-2.1 2.1M9.8 14.2l-2.1 2.1m8.6 0-2.1-2.1M9.8 9.8 7.7 7.7M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
  current: "M6 19h12M8 17l3-10 3 6 2-4 2 8",
  flame: "M12 21c-3.2 0-6-2.4-6-6 0-2.5 1.4-4.2 3-5.6.8-.7 1.3-1.9 1-3.4 2.7 1.2 4.6 3.5 4.7 6.3.7-.6 1.2-1.5 1.4-2.6 1.3 1.1 2 2.8 2 5.1 0 3.8-2.8 6.2-6.1 6.2Z",
  mode: "M12 3a9 9 0 1 0 9 9h-4a5 5 0 1 1-5-5V3Zm2 1v6h6",
  check: "M5 12.5 9.5 17 19 7",
  alert: "M12 4 3 20h18L12 4Zm0 5v5m0 3h.01",
  clock: "M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  plus: "M12 5v14m-7-7h14",
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d={iconPaths[name]} />
    </svg>
  );
}

const hasNumericValue = (value) => value !== null && value !== undefined && Number.isFinite(Number(value));

const formatNumber = (value, digits = 1) => (hasNumericValue(value) ? Number(value).toFixed(digits) : unavailable);

const formatTemperature = (value) => (hasNumericValue(value) ? `${Number(value).toFixed(1)}` : unavailable);

const formatDate = (value) => {
  if (!value) return unavailable;
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const normalizeMode = (mode) => {
  if (mode === "AUTO") return "AUTOMATIC";
  if (mode === "MANUAL") return "MANUAL";
  return mode ?? unavailable;
};

const resolveBatteryStatus = (latest) => {
  if (!latest || !hasNumericValue(latest.v_batt)) return { tone: "unknown", label: "Unknown", detail: "Battery not reported" };
  if (latest.state === "LOW_BATT") return { tone: "warning", label: "Warning", detail: "Low battery state" };
  return { tone: "healthy", label: "Reported", detail: "Battery telemetry available" };
};

const resolveDeviceTone = (status) => {
  const normalized = String(status ?? "").trim().toLowerCase();
  if (["online", "ok", "connected", "healthy", "wifi_connected"].includes(normalized)) return "healthy";
  if (["offline", "error", "disconnected", "wifi_disconnected"].includes(normalized)) return "error";
  return "warning";
};

const readNumber = (payload, keys) => {
  if (!payload) return null;
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
};

const readBoolean = (payload, keys) => {
  if (!payload) return null;
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "on", "1", "yes"].includes(normalized)) return true;
      if (["false", "off", "0", "no"].includes(normalized)) return false;
    }
  }
  return null;
};

const readText = (payload, keys) => {
  if (!payload) return null;
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
};

const normalizeMqttTelemetry = ({ payload, receivedAt }, deviceId) => {
  if (!payload) return null;

  return {
    id: `mqtt-${receivedAt}`,
    device_id: deviceId,
    ts: receivedAt,
    t_internal: readNumber(payload, ["t_internal", "tInternal", "temperature_c", "internal_temperature_c", "temperature"]),
    v_batt: readNumber(payload, ["v_batt", "vBatt", "battery_voltage", "battery_voltage_v", "battery_v", "voltage"]),
    i_heater: readNumber(payload, ["i_heater", "iHeater", "heater_current", "heater_current_a", "current_a"]),
    duty: readNumber(payload, ["duty", "duty_cycle", "dutyCycle"]),
    state: readText(payload, ["state", "status"]),
    heater_enabled: readBoolean(payload, ["heater_enabled", "heaterEnabled"]),
    automatic_mode: readBoolean(payload, ["automatic_mode", "automaticMode"]),
    target_temperature_c: readNumber(payload, ["target_temperature_c", "targetTemperatureC", "t_set", "tSet"]),
    raw: payload,
  };
};

const modeFromTelemetry = (telemetry, fallbackMode) => {
  if (telemetry?.automatic_mode === true) return "AUTO";
  if (telemetry?.automatic_mode === false) return "MANUAL";
  return fallbackMode;
};

function StatusPill({ icon, label, tone = "unknown" }) {
  return (
    <span className={cn("control-status-pill", `control-status-pill--${tone}`)}>
      <Icon className="h-4 w-4" name={icon} />
      {label}
    </span>
  );
}

function MetricCard({ icon, tone = "blue", label, value, unit, subtitle, action, progress, valueVariant = "numeric" }) {
  return (
    <article className="control-metric-card">
      <div className="control-metric-heading">
        <span className={cn("control-metric-icon", `control-metric-icon--${tone}`)}>
          <Icon className="h-7 w-7" name={icon} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="control-card-label">{label}</p>
        </div>
      </div>
      <div className={cn("control-card-value-row", valueVariant === "text" && "control-card-value-row--text")}>
        <span className={cn("control-card-value", valueVariant === "text" && "control-card-value--text")}>{value}</span>
        {unit ? <span className="control-card-unit">{unit}</span> : null}
      </div>
      {progress !== undefined ? (
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dce3ee]">
          <div className="h-full rounded-full bg-[#16a338]" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
        </div>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="control-card-subtitle">{subtitle}</p>
        {action}
      </div>
    </article>
  );
}

function Sidebar({ activeDevice, session }) {
  const userName = session?.fullName || session?.email?.split("@")[0] || "Control User";
  const email = session?.email || "Authenticated user";
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("") || "HS";

  return (
    <aside className="control-sidebar">
      <div className="px-5 pb-6 pt-8">
        <img alt="HeatSpot OFF-GRID" className="mx-auto h-auto w-[172px]" src={heatSpotLogo} />
      </div>

      <nav aria-label="Control navigation" className="space-y-2 px-3">
        <Link className="control-nav-item control-nav-item--active" to="/control">
          <Icon className="h-5 w-5" name="home" />
          Overview
        </Link>
        <a className="control-nav-item" href="#devices">
          <Icon className="h-5 w-5" name="devices" />
          Devices
        </a>
        <span aria-disabled="true" className="control-nav-item control-nav-item--disabled">
          <Icon className="h-5 w-5" name="automation" />
          Automation
        </span>
        <span aria-disabled="true" className="control-nav-item control-nav-item--disabled">
          <Icon className="h-5 w-5" name="settings" />
          Settings
        </span>
      </nav>

      <div className="mt-8 border-t border-[#e4eaf3] px-4 pt-6">
        <p className="control-sidebar-kicker">Quick actions</p>
        <div className="mt-4 space-y-2">
          <a className="control-quick-action" href="#heater-control">
            <Icon className="h-4 w-4" name="wifi" />
            Remote Control
          </a>
          <a className="control-quick-action" href="#devices">
            <Icon className="h-4 w-4" name="plus" />
            Pair Device
          </a>
        </div>
      </div>

      <div className="mt-auto p-3">
        <div className="control-user-card">
          <span className="control-avatar">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#0c1938]">{userName}</span>
            <span className="block truncate text-xs text-[#53617d]">{email}</span>
          </span>
          <SignOutButton className="h-9 rounded-lg border-[#dce5f2] bg-white px-3 text-xs text-[#082b73] hover:bg-[#f4f7fb]" label="Logout" />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ devices, selectedDeviceId, onDeviceChange, activeDevice, latest, settings, mqttFeed }) {
  const battery = resolveBatteryStatus(latest);
  const reportedStatus = readText(mqttFeed?.status, ["status", "wifi_status"]) ?? activeDevice?.status;
  const currentDate = new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  return (
    <header className="control-topbar">
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor="control-device-selector">
          Active device
        </label>
        <div className="control-device-select-wrap">
          <Icon className="h-5 w-5 text-[#53617d]" name="devices" />
          <select className="control-device-select" disabled={devices.length === 0} id="control-device-selector" onChange={(event) => onDeviceChange(event.target.value)} value={selectedDeviceId ?? ""}>
            {devices.length === 0 ? <option value="">No devices</option> : null}
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-topbar-status">
        <StatusPill icon="wifi" label={reportedStatus ?? "No device"} tone={reportedStatus ? resolveDeviceTone(reportedStatus) : "unknown"} />
        <StatusPill icon="wifi" label={mqttFeed?.connected ? "MQTT Live" : "MQTT Waiting"} tone={mqttFeed?.connected ? "healthy" : "unknown"} />
        <StatusPill icon="battery" label={`Battery ${battery.label}`} tone={battery.tone} />
        <StatusPill icon="mode" label={`Mode ${normalizeMode(settings?.mode)}`} tone={settings?.mode ? "healthy" : "unknown"} />
      </div>

      <div className="control-date-pill">
        <Icon className="h-4 w-4" name="clock" />
        {currentDate}
      </div>
    </header>
  );
}

function SystemStatusBar({ activeDevice, latest, settings, mqttFeed }) {
  const battery = resolveBatteryStatus(latest);
  const reportedStatus = readText(mqttFeed?.status, ["status", "wifi_status"]) ?? activeDevice?.status;
  const deviceTone = reportedStatus ? resolveDeviceTone(reportedStatus) : "unknown";
  const heaterActive = latest?.heater_enabled ?? (latest?.state === "HEATING" || Number(latest?.duty) > 0);
  const telemetryTone = latest ? "healthy" : "unknown";

  const items = [
    {
      label: "Device",
      detail: reportedStatus ?? "Unavailable",
      tone: deviceTone,
    },
    {
      label: "Battery",
      detail: battery.detail,
      tone: battery.tone,
    },
    {
      label: "MQTT",
      detail: mqttFeed?.lastMessageAt ? `Last ${formatDate(mqttFeed.lastMessageAt)}` : mqttFeed?.connected ? "Waiting for ESP32 data" : "Not connected",
      tone: mqttFeed?.connected ? "healthy" : mqttFeed?.error ? "error" : "unknown",
    },
    {
      label: "Heater",
      detail: latest ? (heaterActive ? "Currently heating" : "Standby") : "Unavailable",
      tone: latest ? (heaterActive ? "healthy" : "unknown") : "unknown",
    },
    {
      label: "Control Mode",
      detail: normalizeMode(settings?.mode),
      tone: settings?.mode ? "healthy" : "unknown",
    },
  ];

  return (
    <section className="control-status-bar" aria-label="System status">
      <h2 className="sr-only">System status</h2>
      {items.map((item) => (
        <div className="control-status-item" key={item.label}>
          <span className={cn("control-status-dot", `control-status-dot--${item.tone}`)}>
            <Icon className="h-5 w-5" name={item.tone === "warning" || item.tone === "error" ? "alert" : "check"} />
          </span>
          <span>
            <span className="block font-bold text-[#0c1938]">{item.label}</span>
            <span className="block text-sm text-[#53617d]">{item.detail}</span>
          </span>
        </div>
      ))}
    </section>
  );
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [devices, setDevices] = useState(() => listDemoDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!selectedDeviceId && devices[0]?.id) {
      setSelectedDeviceId(devices[0].id);
      return;
    }

    if (selectedDeviceId && devices.length > 0 && !devices.some((device) => device.id === selectedDeviceId)) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  const activeDevice = useMemo(
    () => devices.find((device) => device.id === selectedDeviceId) ?? devices[0] ?? null,
    [devices, selectedDeviceId],
  );

  const settings = useMemo(() => (activeDevice ? getDemoDeviceSettings(activeDevice.id) : null), [activeDevice, refreshToken]);
  const demoTelemetry = useMemo(() => (activeDevice ? getDemoTelemetry(activeDevice.id) : []), [activeDevice, refreshToken]);
  const commands = useMemo(() => (activeDevice ? getDemoCommands(activeDevice.id) : []), [activeDevice, refreshToken]);
  const mqttFeed = useMqttDeviceFeed(activeDevice?.device_uid);
  const liveTelemetry = useMemo(
    () => mqttFeed.telemetryHistory.map((entry) => normalizeMqttTelemetry(entry, activeDevice?.id)).filter(Boolean),
    [activeDevice?.id, mqttFeed.telemetryHistory],
  );
  const telemetry = liveTelemetry.length > 0 ? liveTelemetry : demoTelemetry;
  const latest = telemetry.at(-1) ?? null;
  const currentMode = modeFromTelemetry(latest, settings?.mode);
  const targetTemperature = latest?.target_temperature_c ?? settings?.t_set;
  const battery = resolveBatteryStatus(latest);
  const heaterActive = latest?.heater_enabled ?? (latest?.state === "HEATING" || Number(latest?.duty) > 0);

  const handleCreatePairing = async ({ device_uid, name }) => {
    const result = createDemoPairing({ device_uid, name });
    const nextDevices = listDemoDevices();
    setDevices(nextDevices);
    const createdDevice = nextDevices.find((device) => device.device_uid.toLowerCase() === result.deviceUid.toLowerCase());
    if (createdDevice) {
      setSelectedDeviceId(createdDevice.id);
    }
    return result;
  };

  const handleApplyCommand = async ({ deviceId, payload }) => {
    try {
      const result = await applyDemoCommand({ deviceId, payload });
      setRefreshToken((value) => value + 1);
      setDevices(listDemoDevices());
      return result;
    } catch (error) {
      setRefreshToken((value) => value + 1);
      throw error;
    }
  };

  return (
    <main className="control-app control-dashboard-shell">
      <Sidebar activeDevice={activeDevice} session={session} />

      <section className="control-main">
        <Topbar activeDevice={activeDevice} devices={devices} latest={latest} mqttFeed={mqttFeed} onDeviceChange={setSelectedDeviceId} selectedDeviceId={activeDevice?.id ?? ""} settings={{ ...(settings ?? {}), mode: currentMode }} />

        <div className="control-content">
          {activeDevice ? (
            <>
              <section className="control-metric-grid" aria-label="Primary metrics">
                <MetricCard
                  icon="temperature"
                  label="Current Temperature"
                  subtitle={latest?.state ?? "Telemetry loaded"}
                  tone="orange"
                  unit={latest ? "\u00b0C" : ""}
                  value={formatTemperature(latest?.t_internal)}
                />
                <MetricCard
                  action={
                    <a className="control-small-action" href="#heater-control">
                      Edit
                    </a>
                  }
                  icon="target"
                  label="Target Temperature"
                  subtitle={`Set point range ${tempMin}-${tempMax} C`}
                  tone="orange"
                  unit={targetTemperature !== undefined ? "\u00b0C" : ""}
                  value={formatTemperature(targetTemperature)}
                />
                <MetricCard
                  icon="battery"
                  label="Battery Voltage"
                  subtitle={battery.detail}
                  tone="green"
                  value={latest?.v_batt !== undefined ? formatNumber(latest.v_batt, 2) : unavailable}
                  unit={latest?.v_batt !== undefined ? "V" : ""}
                />
                <MetricCard
                  icon="current"
                  label="Heater Current"
                  subtitle="Existing telemetry metric"
                  tone="blue"
                  value={latest?.i_heater !== undefined ? formatNumber(latest.i_heater, 2) : unavailable}
                  unit={latest?.i_heater !== undefined ? "A" : ""}
                />
                <MetricCard
                  icon="flame"
                  label="Heater Status"
                  subtitle={latest ? (heaterActive ? "Currently heating" : "Standby") : "Not reported"}
                  tone="orange"
                  value={latest ? (heaterActive ? "ON" : "OFF") : unavailable}
                />
                <MetricCard
                  icon="mode"
                  label="Operating Mode"
                  subtitle={currentMode === "AUTO" ? "Automatic thermal control" : currentMode === "MANUAL" ? "Manual remote control" : "Reported mode"}
                  tone="blue"
                  value={normalizeMode(currentMode)}
                  valueVariant="text"
                />
              </section>

              <section className="control-main-grid">
                <article className="control-panel">
                  <div className="control-panel-header">
                    <div>
                      <p className="control-panel-kicker">Temperature History</p>
                      <h2 className="control-panel-title">Thermal telemetry</h2>
                    </div>
                    <div className="control-range-tabs" aria-label="Telemetry range">
                      <span aria-disabled="true">6H</span>
                      <span className="is-active">24H</span>
                      <span aria-disabled="true">7D</span>
                      <span aria-disabled="true">30D</span>
                    </div>
                  </div>
                  <TelemetryChart points={telemetry.map((row) => ({ ts: row.ts, t_internal: row.t_internal, duty: row.duty }))} showDuty={false} targetTemperature={targetTemperature} />
                </article>

                <article className="control-panel" id="heater-control">
                  <div className="control-panel-header">
                    <div>
                      <p className="control-panel-kicker">Heater Control</p>
                      <h2 className="control-panel-title">Remote command</h2>
                    </div>
                    <StatusPill icon="wifi" label={mqttFeed.connected ? "Live MQTT" : "Waiting MQTT"} tone={mqttFeed.connected ? "healthy" : "unknown"} />
                  </div>
                  {mqttFeed.error ? <p className="control-inline-alert">{mqttFeed.error}</p> : null}
                  <DeviceControlForm
                    deviceId={activeDevice.id}
                    initialMode={settings?.mode ?? "AUTO"}
                    initialTSet={Number(settings?.t_set ?? 8)}
                    key={`${activeDevice.id}-${settings?.updated_at ?? refreshToken}`}
                    onApply={handleApplyCommand}
                  />
                </article>
              </section>

              <SystemStatusBar activeDevice={activeDevice} latest={latest} mqttFeed={mqttFeed} settings={{ ...(settings ?? {}), mode: currentMode }} />
            </>
          ) : (
            <section className="control-empty-state">
              <img alt="HeatSpot OFF-GRID" className="mx-auto h-auto w-40" src={heatSpotLogo} />
              <h1>No device paired yet</h1>
              <p>Add the first device using the existing pairing workflow. No telemetry or controls are shown until a real device exists.</p>
            </section>
          )}

          <section className="control-device-management" id="devices">
            <article className="control-panel">
              <div className="control-panel-header">
                <div>
                  <p className="control-panel-kicker">Devices</p>
                  <h2 className="control-panel-title">Active fleet</h2>
                </div>
                <span className="control-count-pill">{devices.length} total</span>
              </div>
              <div className="control-device-list">
                {devices.length === 0 ? (
                  <p className="control-muted-box">No devices associated yet.</p>
                ) : (
                  devices.map((device) => (
                    <button
                      className={cn("control-device-row", device.id === activeDevice?.id ? "control-device-row--active" : "")}
                      key={device.id}
                      onClick={() => setSelectedDeviceId(device.id)}
                      type="button"
                    >
                      <span>
                        <span className="block font-bold">{device.name}</span>
                        <span className="block text-xs text-[#53617d]">{device.device_uid}</span>
                      </span>
                      <span className={cn("control-row-status", `control-row-status--${resolveDeviceTone(device.status)}`)}>{device.status}</span>
                    </button>
                  ))
                )}
              </div>
              {activeDevice ? (
                <Link className="control-secondary-link mt-4" to={`/control/device/${activeDevice.id}`}>
                  Open technical device page
                </Link>
              ) : null}
            </article>

            <article className="control-panel">
              <div className="control-panel-header">
                <div>
                  <p className="control-panel-kicker">Pairing</p>
                  <h2 className="control-panel-title">Add device</h2>
                </div>
              </div>
              <AddDeviceForm onCreatePairing={handleCreatePairing} />
            </article>
          </section>

          {commands.length > 0 ? (
            <section className="control-recent-commands">
              <div className="control-panel-header">
                <div>
                  <p className="control-panel-kicker">Commands</p>
                  <h2 className="control-panel-title">Recent acknowledgements</h2>
                </div>
              </div>
              <div className="control-command-list">
                {commands.slice(0, 4).map((command) => (
                  <div className="control-command-row" key={command.id}>
                    <span>
                      <span className="block font-bold text-[#0c1938]">{command.command_type}</span>
                      <span className="block text-xs text-[#53617d]">{formatDate(command.created_at)}</span>
                    </span>
                    <span className="control-count-pill">{command.status}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
