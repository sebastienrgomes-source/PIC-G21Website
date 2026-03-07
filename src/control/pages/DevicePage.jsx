import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { cn } from "../../shared/utils/cn";
import { DeviceControlForm } from "../components/DeviceControlForm";
import { SignOutButton } from "../components/SignOutButton";
import { TelemetryChart } from "../components/TelemetryChart";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { applyDemoCommand, getDemoCommands, getDemoDeviceById, getDemoDeviceSettings, getDemoTelemetry } from "../services/demo-store";

const copy = {
  pt: {
    nav: {
      monitoring: "Monitorizacao",
      control: "Controlo",
      telemetry: "Telemetria",
      backDashboard: "Dashboard",
      logout: "Logout",
      demo: "Demo",
    },
    hero: {
      station: "Device station | Operacao em tempo real",
      lastSeen: "Last seen",
      noData: "Sem dados",
    },
    cards: {
      internalTemp: "Temp interna",
      battery: "Bateria",
      duty: "Duty",
      state: "Estado",
      commands: "Comandos",
      unknown: "UNKNOWN",
    },
    sections: {
      deviceControl: "Controlo do dispositivo",
      realtime: "Supervisao termica em tempo real",
      controlTitle: "Control",
      controlDescription: "Setpoint e modo de controlo.",
      telemetryTitle: "Telemetria 24h",
      telemetryDescription: "Temperatura interna e duty-cycle enviado.",
      recentCommandsTitle: "Comandos recentes",
      recentCommandsDescription: "Historico de envio e ACK.",
      noCommands: "Ainda nao existem comandos para este dispositivo.",
    },
    table: {
      date: "Data",
      type: "Tipo",
      status: "Status",
      payload: "Payload",
    },
    status: {
      online: "online",
      offline: "offline",
      warning: "warning",
    },
  },
  en: {
    nav: {
      monitoring: "Monitoring",
      control: "Control",
      telemetry: "Telemetry",
      backDashboard: "Dashboard",
      logout: "Logout",
      demo: "Demo",
    },
    hero: {
      station: "Device station | Real-time operation",
      lastSeen: "Last seen",
      noData: "No data",
    },
    cards: {
      internalTemp: "Internal temp",
      battery: "Battery",
      duty: "Duty",
      state: "State",
      commands: "Commands",
      unknown: "UNKNOWN",
    },
    sections: {
      deviceControl: "Device control",
      realtime: "Real-time thermal supervision",
      controlTitle: "Control",
      controlDescription: "Setpoint and control mode.",
      telemetryTitle: "Telemetry 24h",
      telemetryDescription: "Internal temperature and sent duty-cycle.",
      recentCommandsTitle: "Recent commands",
      recentCommandsDescription: "Send and ACK history.",
      noCommands: "No commands yet for this device.",
    },
    table: {
      date: "Date",
      type: "Type",
      status: "Status",
      payload: "Payload",
    },
    status: {
      online: "online",
      offline: "offline",
      warning: "warning",
    },
  },
};

const stateBadgeVariant = (state) => {
  if (state === "LOW_BATT") return "warning";
  if (state === "PROTECT") return "destructive";
  if (state === "HEATING") return "success";
  return "outline";
};

const deviceStatusVariant = (status) => {
  if (status === "online") return "success";
  if (status === "offline") return "outline";
  return "warning";
};

const localizeStatus = (status, text) => {
  if (status === "online") return text.status.online;
  if (status === "offline") return text.status.offline;
  return text.status.warning;
};

export default function DevicePage() {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  const { id } = useParams();
  const [refreshToken, setRefreshToken] = useState(0);

  const device = useMemo(() => getDemoDeviceById(id), [id, refreshToken]);
  const settings = useMemo(() => (device ? getDemoDeviceSettings(device.id) : null), [device, refreshToken]);
  const telemetry = useMemo(() => (device ? getDemoTelemetry(device.id) : []), [device, refreshToken]);
  const commands = useMemo(() => (device ? getDemoCommands(device.id) : []), [device, refreshToken]);

  if (!device) {
    return <Navigate replace to="/control" />;
  }

  const latest = telemetry.at(-1) ?? null;

  const handleApplyCommand = async ({ deviceId, tSet, mode }) => {
    const result = applyDemoCommand({ deviceId, tSet, mode });
    setRefreshToken((value) => value + 1);
    return result;
  };

  return (
    <main className="control-app min-h-screen bg-[#c9d3e5]">
      <section className="hs-hero-bg relative overflow-hidden px-4 pb-20 pt-4 md:px-8 md:pb-24 md:pt-6">
        <div className="hs-hero-glow pointer-events-none absolute inset-0" />
        <div className="hs-hero-grid pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl">
          <div className="hs-reveal mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-white/20 bg-[#112b76]/78 px-3 py-2 shadow-[0_8px_26px_rgba(4,11,40,.35)] backdrop-blur md:px-5">
            <div className="flex items-center gap-2 text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffb11f] font-heading text-sm font-bold text-[#081956]">
                *
              </span>
              <span className="text-sm font-semibold md:text-lg">HeatSpot OFF-Grid</span>
            </div>

            <div className="hidden items-center gap-7 text-[15px] font-semibold md:flex">
              <span className="hs-nav-item">{text.nav.monitoring}</span>
              <span className="hs-nav-item">{text.nav.control}</span>
              <span className="hs-nav-item">{text.nav.telemetry}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-9 border-white/35 bg-white/10 px-3 text-xs text-white hover:bg-white/20 hover:text-white",
                )}
                to="/control"
              >
                {"<-"} {text.nav.backDashboard}
              </Link>
              <SignOutButton
                className="h-9 border-[#f0b135] bg-[#ffb11f] px-4 text-sm text-[#081956] hover:bg-[#f2aa19] hover:text-[#081956]"
                label={text.nav.logout}
                variant="outline"
              />
            </div>
          </div>

          <div className="hs-reveal hs-delay-1 mx-auto mt-11 max-w-5xl text-center text-white md:mt-14">
            <p className="mx-auto inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              {text.hero.station}
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-[1.03] md:text-7xl">
              {device.name}
              <span className="mt-1 block text-[#ffb928]">{device.device_uid}</span>
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Badge className="border-white/30 bg-white/12 text-white" variant={deviceStatusVariant(device.status)}>
                {localizeStatus(device.status, text)}
              </Badge>
              <span className="rounded-full border border-white/22 bg-white/12 px-3 py-1 text-xs text-blue-100">
                {text.hero.lastSeen}: {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : text.hero.noData}
              </span>
              <span className="rounded-full border border-orange-200/45 bg-orange-300/20 px-3 py-1 text-xs font-semibold text-orange-100">
                {text.nav.demo}
              </span>
            </div>
          </div>

          <div className="hs-reveal hs-delay-2 mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">{text.cards.internalTemp}</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.t_internal?.toFixed(1) ?? "--"} C</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">{text.cards.battery}</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.v_batt?.toFixed(2) ?? "--"} V</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">{text.cards.duty}</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">
                {latest?.duty !== null && latest?.duty !== undefined ? `${Math.round(latest.duty * 100)}%` : "--"}
              </p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">{text.cards.state}</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.state ?? text.cards.unknown}</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">{text.cards.commands}</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{commands.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 w-full max-w-7xl px-4 pb-12 md:px-8 md:pb-14">
        <div className="hs-reveal hs-delay-1 rounded-[30px] border border-blue-100/90 bg-[#d3dceb] p-6 shadow-[0_14px_40px_rgba(12,30,79,.13)] md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2e56cd]">{text.sections.deviceControl}</p>
            <h2 className="mx-auto mt-2 max-w-4xl font-heading text-4xl leading-tight text-[#0a1b58] md:text-6xl">{text.sections.realtime}</h2>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
            <Card className="border-blue-100/80 bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.sections.controlTitle}</CardTitle>
                <CardDescription>{text.sections.controlDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceControlForm
                  deviceId={device.id}
                  initialMode={settings?.mode ?? "AUTO"}
                  initialTSet={Number(settings?.t_set ?? 8)}
                  onApply={handleApplyCommand}
                />
              </CardContent>
            </Card>

            <Card className="border-blue-100/80 bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.sections.telemetryTitle}</CardTitle>
                <CardDescription>{text.sections.telemetryDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <TelemetryChart points={telemetry.map((row) => ({ ts: row.ts, t_internal: row.t_internal, duty: row.duty }))} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-blue-100/80 bg-white/95">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.sections.recentCommandsTitle}</CardTitle>
              <CardDescription>{text.sections.recentCommandsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              {commands.length === 0 ? (
                <p className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] p-3 text-sm text-[#3e5186]">{text.sections.noCommands}</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-blue-100/80">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f5f8ff] text-[#30457b]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">{text.table.date}</th>
                        <th className="px-4 py-3 font-semibold">{text.table.type}</th>
                        <th className="px-4 py-3 font-semibold">{text.table.status}</th>
                        <th className="px-4 py-3 font-semibold">{text.table.payload}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commands.map((command) => (
                        <tr className="border-t border-blue-100/80 align-top" key={command.id}>
                          <td className="px-4 py-3 text-[#22376f]">{new Date(command.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-[#22376f]">{command.command_type}</td>
                          <td className="px-4 py-3">
                            <Badge variant={command.status === "acked" ? "success" : command.status === "failed" ? "destructive" : "outline"}>
                              {command.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <code className="block max-w-[520px] whitespace-pre-wrap break-all rounded-lg bg-[#f5f8ff] px-2 py-1 font-mono text-[11px] leading-5 text-[#30457b]">
                              {JSON.stringify(command.payload)}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-5 flex justify-end">
            <Badge variant={stateBadgeVariant(latest?.state ?? null)}>{latest?.state ?? text.cards.unknown}</Badge>
          </div>
        </div>
      </section>
    </main>
  );
}
