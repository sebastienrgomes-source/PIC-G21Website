import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDemoSession } from '@/lib/demo-auth';
import { isDemoMode } from '@/lib/demo-mode';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const demoMode = isDemoMode();

  if (demoMode) {
    const session = getDemoSession();
    if (session) redirect('/dashboard');
  } else {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect('/dashboard');
  }

  return (
    <main className="hs-hero-bg relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="hs-hero-glow pointer-events-none absolute inset-0" />
      <div className="hs-hero-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="hs-reveal mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-white/20 bg-[#112b76]/78 px-3 py-2 shadow-[0_8px_26px_rgba(4,11,40,.35)] backdrop-blur md:px-5">
          <div className="flex items-center gap-2 text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffb11f] font-heading text-sm font-bold text-[#081956]">
              *
            </span>
            <span className="text-sm font-semibold md:text-lg">HeatSpot OFF-Grid</span>
          </div>
          <div className="hidden items-center gap-7 text-[15px] font-semibold md:flex">
            <span className="hs-nav-item">Desafio</span>
            <span className="hs-nav-item">Solucao</span>
            <span className="hs-nav-item">Prototipo</span>
            <span className="hs-nav-item">Roadmap</span>
            <span className="hs-nav-item">Equipa</span>
          </div>
          <span className="rounded-full border border-orange-200/45 bg-[#ffb11f] px-4 py-1 text-sm font-semibold text-[#081956]">
            Control Center
          </span>
          </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[1.15fr,0.85fr]">
          <section className="hs-reveal hs-delay-1 text-white">
            <p className="inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              Operacao Segura | Acesso de Equipa
            </p>
            <h1 className="mt-5 font-heading text-5xl leading-[1.05] md:text-6xl">
              PIC Control Center
              <span className="mt-1 block text-[#ffb928]">Pronto para Demo de Investidor</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100 md:text-2xl">
              Plataforma de monitorizacao e controlo para aquecimento assistido em colmeias solares com onboarding
              rapido e telemetria em tempo real.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="hs-glass-card rounded-2xl p-4">
                <p className="font-heading text-3xl text-[#ffc14a]">2 min</p>
                <p className="mt-1 text-sm text-blue-100">Setup demo</p>
              </div>
              <div className="hs-glass-card rounded-2xl p-4">
                <p className="font-heading text-3xl text-[#ffc14a]">24/7</p>
                <p className="mt-1 text-sm text-blue-100">Visibilidade</p>
              </div>
              <div className="hs-glass-card rounded-2xl p-4">
                <p className="font-heading text-3xl text-[#ffc14a]">100%</p>
                <p className="mt-1 text-sm text-blue-100">Off-grid</p>
              </div>
            </div>
          </section>

          <section className="hs-reveal hs-delay-2">
            <Card className="border-blue-100/75 bg-white/96 shadow-[0_18px_50px_rgba(10,29,76,.24)]">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">Entrar</CardTitle>
                <CardDescription>
                  {demoMode
                    ? 'Modo demo ativo. Entra com a conta predefinida ou cria nova conta local.'
                    : 'Autentica-te para gerir os teus spot-heaters solares.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
