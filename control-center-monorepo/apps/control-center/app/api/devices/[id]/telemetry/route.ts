import { getDemoSession } from '@/lib/demo-auth';
import { getDemoDeviceById, getDemoTelemetry } from '@/lib/demo-data';
import { isDemoMode } from '@/lib/demo-mode';
import { jsonError } from '@/lib/http';
import { requireAuthenticatedUser } from '@/lib/route-auth';

const resolveRangeStart = (range: string | null): string => {
  const now = Date.now();
  if (range === '1h') return new Date(now - 60 * 60 * 1000).toISOString();
  if (range === '6h') return new Date(now - 6 * 60 * 60 * 1000).toISOString();
  if (range === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  return new Date(now - 24 * 60 * 60 * 1000).toISOString();
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const startIso = resolveRangeStart(searchParams.get('range'));

  if (isDemoMode()) {
    const session = getDemoSession();
    if (!session) return jsonError('Unauthorized', 401);

    const device = getDemoDeviceById(params.id);
    if (!device) return jsonError('Device nao encontrado.', 404);

    const telemetry = getDemoTelemetry(params.id).filter((row) => row.ts >= startIso);
    return Response.json({ telemetry });
  }

  const { errorResponse, user, supabase } = await requireAuthenticatedUser();
  if (errorResponse || !user || !supabase) return errorResponse;

  const { data: device, error: deviceError } = await supabase
    .from('devices')
    .select('id, owner_id')
    .eq('id', params.id)
    .maybeSingle();
  if (deviceError) return jsonError(deviceError.message, 500);
  if (!device || device.owner_id !== user.id) return jsonError('Device nao encontrado.', 404);

  const { data, error } = await supabase
    .from('device_telemetry')
    .select('id, ts, t_internal, t_external, humidity, v_batt, i_heater, duty, state, raw')
    .eq('device_id', params.id)
    .gte('ts', startIso)
    .order('ts', { ascending: true })
    .limit(2000);

  if (error) return jsonError(error.message, 500);
  return Response.json({ telemetry: data ?? [] });
}
