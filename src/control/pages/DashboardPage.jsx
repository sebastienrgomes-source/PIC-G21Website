import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { AddDeviceForm } from "../components/AddDeviceForm";
import { SignOutButton } from "../components/SignOutButton";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { createDemoPairing, listDemoDevices } from "../services/demo-store";
import { cn } from "../../shared/utils/cn";

const copy = {
  pt: {
    nav: {
      challenge: "Desafio",
      solution: "Solucao",
      prototype: "Prototipo",
      roadmap: "Roadmap",
      team: "Equipa",
      logout: "Logout",
      demo: "DEMO",
    },
    hero: {
      tag: "Inovacao Sustentavel | 100% OFF-Grid",
      title: "HeatSpot OFF-Grid",
      subtitle: "Control Center Inteligente",
      description: "Protege ativos remotos com monitorizacao em tempo real, controlo termico inteligente e operacao continua.",
      viewDevices: "Ver dispositivos",
      newPairing: "Novo pairing",
    },
    stats: {
      devices: "Dispositivos",
      online: "Online",
      checking: "A verificar",
    },
    overview: {
      kicker: "O desafio",
      title: "Infraestruturas vulneraveis ao frio extremo",
      description: "O Control Center agrega autenticacao, pairing e telemetria para reduzir falhas operacionais em campo.",
      pairingTitle: "Pairing e Provisionamento",
      pairingDescription: "Cria codigo de pairing (8 chars, 10 min).",
      quickFlow: "Fluxo rapido",
      step1: "1. Regista o device_uid com nome.",
      step2: "2. Gera credenciais de provisionamento.",
      step3: "3. Ativa telemetria e controlo remoto.",
      fleet: "Fleet ativa",
      devicesOnline: "Dispositivos online",
      pending: "Acoes pendentes",
    },
    fleet: {
      lastSeen: "Last seen",
      noTelemetry: "Sem telemetria ainda",
      openDevice: "Abrir dispositivo",
      empty: "Ainda nao tens dispositivos associados. Cria o primeiro pairing code para iniciar.",
    },
    status: {
      online: "online",
      offline: "offline",
      warning: "warning",
    },
  },
  en: {
    nav: {
      challenge: "Challenge",
      solution: "Solution",
      prototype: "Prototype",
      roadmap: "Roadmap",
      team: "Team",
      logout: "Logout",
      demo: "DEMO",
    },
    hero: {
      tag: "Sustainable Innovation | 100% OFF-Grid",
      title: "HeatSpot OFF-Grid",
      subtitle: "Smart Control Center",
      description: "Protect remote assets with real-time monitoring, smart thermal control and continuous operation.",
      viewDevices: "View devices",
      newPairing: "New pairing",
    },
    stats: {
      devices: "Devices",
      online: "Online",
      checking: "Needs check",
    },
    overview: {
      kicker: "The challenge",
      title: "Infrastructure exposed to extreme cold",
      description: "The Control Center combines authentication, pairing and telemetry to reduce field failures.",
      pairingTitle: "Pairing and Provisioning",
      pairingDescription: "Create pairing code (8 chars, 10 min).",
      quickFlow: "Quick flow",
      step1: "1. Register device_uid with name.",
      step2: "2. Generate provisioning credentials.",
      step3: "3. Enable telemetry and remote control.",
      fleet: "Active fleet",
      devicesOnline: "Devices online",
      pending: "Pending actions",
    },
    fleet: {
      lastSeen: "Last seen",
      noTelemetry: "No telemetry yet",
      openDevice: "Open device",
      empty: "No devices associated yet. Create your first pairing code to start.",
    },
    status: {
      online: "online",
      offline: "offline",
      warning: "warning",
    },
  },
};

const statusVariant = (status) => {
  if (status === "online") return "success";
  if (status === "offline") return "outline";
  return "warning";
};

const localizeStatus = (status, text) => {
  if (status === "online") return text.status.online;
  if (status === "offline") return text.status.offline;
  return text.status.warning;
};

export default function DashboardPage() {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  const [devices, setDevices] = useState(() => listDemoDevices());

  const metrics = useMemo(() => {
    const online = devices.filter((device) => device.status === "online").length;
    const offline = devices.filter((device) => device.status === "offline").length;
    const warning = Math.max(devices.length - online - offline, 0);

    return {
      online,
      offline,
      warning,
    };
  }, [devices]);

  const handleCreatePairing = async ({ device_uid, name }) => {
    const result = createDemoPairing({ device_uid, name });
    setDevices(listDemoDevices());
    return result;
  };

  return (
    <main className="control-app min-h-screen bg-[#c9d3e5]">
      <section className="hs-hero-bg relative overflow-hidden px-4 pb-24 pt-4 md:px-8 md:pb-28 md:pt-6">
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
              <a className="hs-nav-item" href="#overview">
                {text.nav.challenge}
              </a>
              <a className="hs-nav-item" href="#pairing">
                {text.nav.solution}
              </a>
              <a className="hs-nav-item" href="#fleet">
                {text.nav.prototype}
              </a>
              <span className="hs-nav-item">{text.nav.roadmap}</span>
              <span className="hs-nav-item">{text.nav.team}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-orange-200/40 bg-orange-300/20 px-3 py-1 text-xs font-semibold text-orange-100 sm:inline-flex">
                {text.nav.demo}
              </span>

              <SignOutButton
                className="h-9 border-[#f0b135] bg-[#ffb11f] px-4 text-sm text-[#081956] hover:bg-[#f2aa19] hover:text-[#081956]"
                label={text.nav.logout}
                variant="outline"
              />
            </div>
          </div>

          <div className="hs-reveal hs-delay-1 mx-auto mt-12 max-w-5xl text-center text-white md:mt-16">
            <p className="mx-auto inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              {text.hero.tag}
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-[1.02] md:text-7xl">
              {text.hero.title}
              <span className="mt-1 block text-[#ffb928]">{text.hero.subtitle}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-2xl">{text.hero.description}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a className={cn(buttonVariants({ variant: "default" }), "h-12 px-7 text-base")} href="#fleet">
                {text.hero.viewDevices}
              </a>
              <a
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 border-white/35 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white",
                )}
                href="#pairing"
              >
                {text.hero.newPairing}
              </a>
            </div>
          </div>

          <div className="hs-reveal hs-delay-2 mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{devices.length}</p>
              <p className="mt-2 text-2xl text-blue-100">{text.stats.devices}</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{metrics.online}</p>
              <p className="mt-2 text-2xl text-blue-100">{text.stats.online}</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{metrics.offline + metrics.warning}</p>
              <p className="mt-2 text-2xl text-blue-100">{text.stats.checking}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 w-full max-w-7xl px-4 pb-8 md:px-8 md:pb-12" id="overview">
        <div className="hs-reveal hs-delay-1 rounded-[30px] border border-blue-100/90 bg-[#d3dceb] p-6 shadow-[0_14px_40px_rgba(12,30,79,.13)] md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2e56cd]">{text.overview.kicker}</p>
            <h2 className="mx-auto mt-2 max-w-4xl font-heading text-4xl leading-tight text-[#0a1b58] md:text-6xl">{text.overview.title}</h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-[#556b98] md:text-2xl">{text.overview.description}</p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))]">
            <Card className="border-blue-100/85 bg-white/92" id="pairing">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.overview.pairingTitle}</CardTitle>
                <CardDescription>{text.overview.pairingDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-xl border border-blue-100/90 bg-[#f6f9ff] p-3 text-sm text-[#21376d]">
                  <p className="font-semibold">{text.overview.quickFlow}</p>
                  <ul className="mt-1 space-y-1">
                    <li>{text.overview.step1}</li>
                    <li>{text.overview.step2}</li>
                    <li>{text.overview.step3}</li>
                  </ul>
                </div>
                <AddDeviceForm onCreatePairing={handleCreatePairing} />
              </CardContent>
            </Card>

            <Card className="border-blue-100/85 bg-white/92">
              <CardHeader>
                <CardTitle className="font-heading text-6xl text-[#e44134]">{devices.length}</CardTitle>
                <CardDescription className="text-base font-semibold text-[#2f467b]">{text.overview.fleet}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-blue-100/85 bg-white/92">
              <CardHeader>
                <CardTitle className="font-heading text-6xl text-[#e44134]">{metrics.online}</CardTitle>
                <CardDescription className="text-base font-semibold text-[#2f467b]">{text.overview.devicesOnline}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-blue-100/85 bg-white/92">
              <CardHeader>
                <CardTitle className="font-heading text-6xl text-[#e44134]">{metrics.offline + metrics.warning}</CardTitle>
                <CardDescription className="text-base font-semibold text-[#2f467b]">{text.overview.pending}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8 md:pb-14" id="fleet">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device, index) => (
            <Card
              className={cn(
                "hs-reveal group border-blue-100/80 bg-white/95 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(9,25,71,.18)]",
                index % 3 === 1 ? "hs-delay-1" : "",
                index % 3 === 2 ? "hs-delay-2" : "",
              )}
              key={device.id}
            >
              <CardHeader className="pb-4">
                <div className="mb-3 h-1 w-20 rounded-full bg-[linear-gradient(140deg,#0f45cd,#f08728)]" />
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="font-heading text-xl">{device.name}</CardTitle>
                  <Badge variant={statusVariant(device.status)}>{localizeStatus(device.status, text)}</Badge>
                </div>
                <CardDescription className="pt-1 text-[#3f5284]">{device.device_uid}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl border border-blue-100/80 bg-[#f4f7ff] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">{text.fleet.lastSeen}</p>
                  <p className="mt-1 text-sm text-[#22376f]">
                    {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : text.fleet.noTelemetry}
                  </p>
                </div>
                <Link
                  className={cn(buttonVariants({ variant: "default" }), "w-full justify-center text-sm group-hover:brightness-105")}
                  to={`/control/device/${device.id}`}
                >
                  {text.fleet.openDevice}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {devices.length === 0 ? (
          <Card className="mt-6 border-dashed border-blue-200/90 bg-white/70">
            <CardContent className="p-6 text-sm text-[#355089]">{text.fleet.empty}</CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
