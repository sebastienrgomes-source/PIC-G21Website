import { Link } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { AuthForm } from "../components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const copy = {
  pt: {
    heroTag: "Operacao Segura | Acesso de Equipa",
    heroTitle: "PIC Control Center",
    heroSubtitle: "Pronto para Demo de Investidor",
    heroDescription:
      "Plataforma de monitorizacao e controlo para aquecimento assistido em colmeias solares com onboarding rapido e telemetria em tempo real.",
    stats: [
      { value: "2 min", label: "Setup demo" },
      { value: "24/7", label: "Visibilidade" },
      { value: "100%", label: "Off-grid" },
    ],
    cardTitle: "Entrar",
    cardDescription: "Autentica-te para aceder ao Control Center.",
    backToMarketing: "Voltar ao marketing",
  },
  en: {
    heroTag: "Secure Operations | Team Access",
    heroTitle: "PIC Control Center",
    heroSubtitle: "Ready for Investor Demo",
    heroDescription:
      "Monitoring and control platform for solar-assisted heating with fast onboarding and real-time telemetry.",
    stats: [
      { value: "2 min", label: "Demo setup" },
      { value: "24/7", label: "Visibility" },
      { value: "100%", label: "Off-grid" },
    ],
    cardTitle: "Sign in",
    cardDescription: "Authenticate to access the Control Center.",
    backToMarketing: "Back to marketing",
  },
};

export default function LoginPage() {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  return (
    <main className="control-app hs-hero-bg relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="hs-hero-glow pointer-events-none absolute inset-0" />
      <div className="hs-hero-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="hs-reveal mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-white/20 bg-[#112b76]/78 px-3 py-2 shadow-[0_8px_26px_rgba(4,11,40,.35)] backdrop-blur md:px-5">
          <Link className="flex items-center gap-2 text-white no-underline" to="/">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffb11f] font-heading text-sm font-bold text-[#081956]">
              *
            </span>
            <span className="text-sm font-semibold md:text-lg">HeatSpot OFF-Grid</span>
          </Link>
          <span className="rounded-full border border-orange-200/45 bg-[#ffb11f] px-4 py-1 text-sm font-semibold text-[#081956]">
            Control Center
          </span>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[1.15fr,0.85fr]">
          <section className="hs-reveal hs-delay-1 text-white">
            <p className="inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              {text.heroTag}
            </p>
            <h1 className="mt-5 font-heading text-5xl leading-[1.05] md:text-6xl">
              {text.heroTitle}
              <span className="mt-1 block text-[#ffb928]">{text.heroSubtitle}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100 md:text-2xl">{text.heroDescription}</p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {text.stats.map((item) => (
                <div className="hs-glass-card rounded-2xl p-4" key={item.label}>
                  <p className="font-heading text-3xl text-[#ffc14a]">{item.value}</p>
                  <p className="mt-1 text-sm text-blue-100">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="hs-reveal hs-delay-2">
            <Card className="border-blue-100/75 bg-white/96 shadow-[0_18px_50px_rgba(10,29,76,.24)]">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.cardTitle}</CardTitle>
                <CardDescription>{text.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm initialMode="login" />
              </CardContent>
            </Card>
            <div className="mt-4 text-center text-sm text-blue-100">
              <Link className="underline underline-offset-4" to="/">
                {text.backToMarketing}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
