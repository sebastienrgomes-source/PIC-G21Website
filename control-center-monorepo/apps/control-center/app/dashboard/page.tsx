import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AddDeviceForm } from '@/components/add-device-form';
import { SignOutButton } from '@/components/sign-out-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDemoSession } from '@/lib/demo-auth';
import { getDemoDevices } from '@/lib/demo-data';
import { isDemoMode } from '@/lib/demo-mode';
import { cn } from '@/lib/utils';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Device } from '@/types/domain';

const statusVariant = (status: string): 'outline' | 'warning' | 'success' => {
  if (status === 'online') return 'success';
  if (status === 'offline') return 'outline';
  return 'warning';
};

export default async function DashboardPage() {
  const demoMode = isDemoMode();
  let safeDevices: Device[] = [];

  if (demoMode) {
    const session = getDemoSession();
    if (!session) redirect('/login');
    safeDevices = getDemoDevices();
  } else {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: devices, error } = await supabase
      .from('devices')
      .select('id, owner_id, name, device_uid, status, last_seen_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao carregar devices: ${error.message}`);
    }

    safeDevices = (devices ?? []) as Device[];
  }

  const onlineCount = safeDevices.filter((device) => device.status === 'online').length;
  const offlineCount = safeDevices.filter((device) => device.status === 'offline').length;
  const warningCount = Math.max(safeDevices.length - onlineCount - offlineCount, 0);

  return (
     <main className="min-h-screen bg-[#c9d3e5]">
      <section className="hs-hero-bg relative overflow-hidden px-4 pb-24 pt-4 md:px-8 md:pb-28 md:pt-6"><div className="hs-hero-glow pointer-events-none absolute inset-0" />
        <div className="hs-hero-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl">
          <div className="hs-reveal mx-auto flex w-full max-w-6xl items-center justify-between gap-2 rounded-full border border-white/20 bg-[#112b76]/78 px-3 py-2 shadow-[0_8px_26px_rgba(4,11,40,.35)] backdrop-blur md:px-5">
            <div className="flex items-center gap-2 text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffb11f] font-heading text-sm font-bold text-[#081956]">
               {'*'}
              </span>
              <span className="text-sm font-semibold md:text-lg">HeatSpot OFF-Grid</span>
            </div>

            <div className="hidden items-center gap-7 text-[15px] font-semibold md:flex">
              <a className="hs-nav-item" href="#overview">
                Desafio
              </a>
              <a className="hs-nav-item" href="#pairing">
                Solucao
              </a>
              <a className="hs-nav-item" href="#fleet">
                Prototipo
              </a>
              <span className="hs-nav-item">Roadmap</span>
              <span className="hs-nav-item">Equipa</span>
            </div>

            <div className="flex items-center gap-2">
              {demoMode ? (
                <span className="hidden rounded-full border border-orange-200/40 bg-orange-300/20 px-3 py-1 text-xs font-semibold text-orange-100 sm:inline-flex">
                  DEMO
                </span>
              ) : null}

              <SignOutButton
                className="h-9 border-[#f0b135] bg-[#ffb11f] px-4 text-sm text-[#081956] hover:bg-[#f2aa19] hover:text-[#081956]"
                label="Logout"
                variant="outline" />
            </div>
          </div>

          <div className="hs-reveal hs-delay-1 mx-auto mt-12 max-w-5xl text-center text-white md:mt-16">
            <p className="mx-auto inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              Inovacao Sustentavel | 100% OFF-Grid
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-[1.02] md:text-7xl">
              HeatSpot OFF-Grid
              <span className="mt-1 block text-[#ffb928]">Control Center Inteligente</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-blue-100 md:text-2xl">
              Protege ativos remotos com monitorizacao em tempo real, controlo termico inteligente e operacao continua.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a className={cn(buttonVariants({ variant: 'default' }), 'h-12 px-7 text-base')} href="#fleet">
                Ver dispositivos
              </a>
              <a
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-12 border-white/35 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white'
                )}
                href="#pairing"
              >
                Novo pairing
              </a>
            </div>
          </div>

          <div className="hs-reveal hs-delay-2 mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{safeDevices.length}</p>
              <p className="mt-2 text-2xl text-blue-100">Dispositivos</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{onlineCount}</p>
              <p className="mt-2 text-2xl text-blue-100">Online</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-6 text-center text-white">
              <p className="font-heading text-5xl text-[#ffc14a]">{offlineCount + warningCount}</p>
              <p className="mt-2 text-2xl text-blue-100">A verificar</p>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto -mt-10 w-full max-w-7xl px-4 pb-8 md:px-8 md:pb-12">
        <div className="hs-reveal hs-delay-1 rounded-[30px] border border-blue-100/90 bg-[#d3dceb] p-6 shadow-[0_14px_40px_rgba(12,30,79,.13)] md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2e56cd]">O desafio</p>
            <h2 className="mx-auto mt-2 max-w-4xl font-heading text-4xl leading-tight text-[#0a1b58] md:text-6xl">
              Infraestruturas vulneraveis ao frio extremo
            </h2>
            <p className="mx-auto mt-4 max-w-4xl text-lg text-[#556b98] md:text-2xl">
              O Control Center agrega autenticacao, pairing e telemetria para reduzir falhas operacionais em campo.
            </p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))]">
            <Card id="pairing" className="border-blue-100/85 bg-white/92">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-2xl text-[#0a1b58]">Pairing e Provisionamento</CardTitle>
              <CardDescription>Cria codigo de pairing (8 chars, 10 min).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-xl border border-blue-100/90 bg-[#f6f9ff] p-3 text-sm text-[#21376d]">
                <p className="font-semibold">Fluxo rapido</p>
                <ul className="mt-1 space-y-1">
                  <li>1. Regista o `device_uid` com nome.</li>
                  <li>2. Gera credenciais de provisionamento.</li>
                  <li>3. Ativa telemetria e controlo remoto.</li>
                </ul>
              </div>
              <AddDeviceForm />
            </CardContent>
          </Card>

          <Card className="border-blue-100/85 bg-white/92">
            <CardHeader>
              <CardTitle className="font-heading text-6xl text-[#e44134]">{safeDevices.length}</CardTitle>
              <CardDescription className="text-base font-semibold text-[#2f467b]">Fleet ativa</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-100/85 bg-white/92">
            <CardHeader>
              <CardTitle className="font-heading text-6xl text-[#e44134]">{onlineCount}</CardTitle>
              <CardDescription className="text-base font-semibold text-[#2f467b]">Dispositivos online</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-100/85 bg-white/92">
            <CardHeader>
              <CardTitle className="font-heading text-6xl text-[#e44134]">{offlineCount + warningCount}</CardTitle>
              <CardDescription className="text-base font-semibold text-[#2f467b]">Acoes pendentes</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section><section id="fleet" className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8 md:pb-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {safeDevices.map((device, index) => (
            <Card
              key={device.id}
              className={cn(
                'hs-reveal group border-blue-100/80 bg-white/95 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(9,25,71,.18)]',
                index % 3 === 1 ? 'hs-delay-1' : '',
                index % 3 === 2 ? 'hs-delay-2' : ''
              )}
            >
              <CardHeader className="pb-4">
                <div className="mb-3 h-1 w-20 rounded-full bg-[linear-gradient(140deg,#0f45cd,#f08728)]" />
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="font-heading line-clamp-1 text-xl">{device.name}</CardTitle>
                  <Badge variant={statusVariant(device.status)}>{device.status}</Badge>
                </div>
                <CardDescription className="pt-1 text-[#3f5284]">{device.device_uid}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl border border-blue-100/80 bg-[#f4f7ff] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a6b96]">Last seen</p>
                  <p className="mt-1 text-sm text-[#22376f]">
                    {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : 'Sem telemetria ainda'}
                  </p>
                </div>
                <Link
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center text-sm group-hover:brightness-105')}
                  href={`/devices/${device.id}`}
                >
                  Open device
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {safeDevices.length === 0 ? (
          <Card className="mt-6 border-dashed border-blue-200/90 bg-white/70">
            <CardContent className="p-6 text-sm text-[#355089]">
              Ainda nao tens dispositivos associados. Cria o primeiro pairing code para iniciar.
            </CardContent>
          </Card>
        ) : null}
      </section>
    </main>
  );
}
