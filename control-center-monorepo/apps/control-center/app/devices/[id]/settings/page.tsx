import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

export default async function DeviceSettingsPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: settings } = await supabase
    .from('device_settings')
    .select('mode, t_set, t_band, max_duty, min_batt_v, max_heater_w, updated_at')
    .eq('device_id', params.id)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <div className="mb-4">
        <Link href={`/devices/${params.id}`} className={cn(buttonVariants({ variant: 'outline' }))}>
          Back
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
          <CardDescription>Valores persistidos em `device_settings`.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-md bg-secondary/40 p-4 text-xs">
            {JSON.stringify(settings ?? { message: 'No settings row found' }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
