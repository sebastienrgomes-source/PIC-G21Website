import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DeviceControlForm } from '@/components/device-control-form';
import { SignOutButton } from '@/components/sign-out-button';
import { TelemetryChart } from '@/components/telemetry-chart';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDemoSession } from '@/lib/demo-auth';
import { getDemoCommands, getDemoDeviceById, getDemoDeviceSettings, getDemoTelemetry } from '@/lib/demo-data';
import { isDemoMode } from '@/lib/demo-mode';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type { Device, DeviceCommand, DeviceSettings, DeviceTelemetry } from '@/types/domain';

const stateBadgeVariant = (state: string | null): 'outline' | 'warning' | 'success' | 'destructive' => {
  if (state === 'LOW_BATT') return 'warning';
  if (state === 'PROTECT') return 'destructive';
  if (state === 'HEATING') return 'success';
  return 'outline';
};

const deviceStatusVariant = (status: string): 'outline' | 'warning' | 'success' => {
  if (status === 'online') return 'success';
  if (status === 'offline') return 'outline';
  return 'warning';
};

export default async function DevicePage({ params }: { params: { id: string } }) {
  const demoMode = isDemoMode();

  let device: Device;
  let settings: DeviceSettings | null;
  let telemetry: DeviceTelemetry[];
  let commands: DeviceCommand[];

  if (demoMode) {
    const session = getDemoSession();
    if (!session) redirect('/login');

    const foundDevice = getDemoDeviceById(params.id);
    if (!foundDevice) redirect('/dashboard');

    device = foundDevice;
    settings = getDemoDeviceSettings(params.id);
    telemetry = getDemoTelemetry(params.id);
    commands = getDemoCommands(params.id);
  } else {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const deviceRes = await supabase
      .from('devices')
      .select('id, owner_id, name, device_uid, status, last_seen_at, created_at')
      .eq('id', params.id)
      .single();

    if (deviceRes.error || !deviceRes.data) redirect('/dashboard');
    device = deviceRes.data as Device;

    const { data: settingsData } = await supabase
      .from('device_settings')
      .select('device_id, mode, t_set, t_band, max_duty, min_batt_v, max_heater_w, updated_at')
      .eq('device_id', params.id)
      .single();

    settings = settingsData as DeviceSettings | null;

    const { data: telemetryRows } = await supabase
      .from('device_telemetry')
      .select('id, device_id, ts, t_internal, t_external, humidity, v_batt, i_heater, duty, state, raw')
      .eq('device_id', params.id)
      .gte('ts', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('ts', { ascending: true })
      .limit(600);

    const { data: commandsRows } = await supabase
      .from('device_commands')
      .select('id, device_id, owner_id, command_type, payload, status, created_at')
      .eq('device_id', params.id)
      .order('created_at', { ascending: false })
      .limit(12);

    telemetry = (telemetryRows ?? []) as DeviceTelemetry[];
    commands = (commandsRows ?? []) as DeviceCommand[];
  }

  const latest = telemetry.at(-1) ?? null;

  return (
    <main className="min-h-screen bg-[#c9d3e5]">
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
              <span className="hs-nav-item">Monitorizacao</span>
              <span className="hs-nav-item">Controlo</span>
              <span className="hs-nav-item">Telemetria</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-9 border-white/35 bg-white/10 px-3 text-xs text-white hover:bg-white/20 hover:text-white',
                )}
              >
                {'<-'} Dashboard
              </Link>
              <SignOutButton
                className="h-9 border-[#f0b135] bg-[#ffb11f] px-4 text-sm text-[#081956] hover:bg-[#f2aa19] hover:text-[#081956]"
                variant="outline"
              />
            </div>
          </div>          

          <div className="hs-reveal hs-delay-1 mx-auto mt-11 max-w-5xl text-center text-white md:mt-14">
            <p className="mx-auto inline-flex rounded-full border border-blue-200/35 bg-blue-200/15 px-4 py-1 text-xs font-semibold text-blue-50">
              Device station | Operacao em tempo real
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-[1.03] md:text-7xl">
              {device.name}
              <span className="mt-1 block text-[#ffb928]">{device.device_uid}</span>
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Badge className="border-white/30 bg-white/12 text-white" variant={deviceStatusVariant(device.status)}>
                {device.status}
              </Badge>
              <span className="rounded-full border border-white/22 bg-white/12 px-3 py-1 text-xs text-blue-100">
                Last seen: {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : 'Sem dados'}
              </span>
              {demoMode ? (
                <span className="rounded-full border border-orange-200/45 bg-orange-300/20 px-3 py-1 text-xs font-semibold text-orange-100">
                  Demo
                </span>
              ) : null}
            </div>
          </div>

          <div className="hs-reveal hs-delay-2 mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">Temp interna</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.t_internal?.toFixed(1) ?? '--'} C</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">Bateria</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.v_batt?.toFixed(2) ?? '--'} V</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">Duty</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">
                {latest?.duty !== null && latest?.duty !== undefined ? `${Math.round(latest.duty * 100)}%` : '--'}
              </p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">Estado</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{latest?.state ?? 'UNKNOWN'}</p>
            </div>
            <div className="hs-glass-card rounded-[24px] p-5 text-center text-white">
              <p className="text-sm text-blue-100">Comandos</p>
              <p className="mt-2 font-heading text-4xl text-[#ffc14a]">{commands.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 w-full max-w-7xl px-4 pb-12 md:px-8 md:pb-14">
        <div className="hs-reveal hs-delay-1 rounded-[30px] border border-blue-100/90 bg-[#d3dceb] p-6 shadow-[0_14px_40px_rgba(12,30,79,.13)] md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2e56cd]">Controlo do dispositivo</p>
            <h2 className="mx-auto mt-2 max-w-4xl font-heading text-4xl leading-tight text-[#0a1b58] md:text-6xl">
              Supervisao termica em tempo real
            </h2>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
            <Card className="border-blue-100/80 bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">Control</CardTitle>
                <CardDescription>Setpoint e modo de controlo.</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceControlForm
                  deviceId={device.id}
                  initialMode={settings?.mode ?? 'AUTO'}
                  initialTSet={Number(settings?.t_set ?? 8)}
                />
              </CardContent>
            </Card>

            <Card className="border-blue-100/80 bg-white/95">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl text-[#0a1b58]">Telemetria 24h</CardTitle>
                <CardDescription>Temperatura interna e duty-cycle enviado.</CardDescription>
              </CardHeader>
              <CardContent>
                <TelemetryChart points={telemetry.map((row) => ({ ts: row.ts, t_internal: row.t_internal, duty: row.duty }))} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-blue-100/80 bg-white/95">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-2xl text-[#0a1b58]">Comandos recentes</CardTitle>
              <CardDescription>Historico de envio e ACK.</CardDescription>
            </CardHeader>
            <CardContent>
              {commands.length === 0 ? (
                <p className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] p-3 text-sm text-[#3e5186]">
                  Ainda nao existem comandos para este dispositivo.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-blue-100/80">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f5f8ff] text-[#30457b]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Data</th>
                        <th className="px-4 py-3 font-semibold">Tipo</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Payload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commands.map((command) => (
                        <tr key={command.id} className="border-t border-blue-100/80 align-top">
                          <td className="px-4 py-3 text-[#22376f]">{new Date(command.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-[#22376f]">{command.command_type}</td>
                          <td className="px-4 py-3">
                            <Badge variant={command.status === 'acked' ? 'success' : command.status === 'failed' ? 'destructive' : 'outline'}>
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
            <Badge variant={stateBadgeVariant(latest?.state ?? null)}>{latest?.state ?? 'UNKNOWN'}</Badge>
          </div>
        </div>
      </section>
    </main>
  );
}
