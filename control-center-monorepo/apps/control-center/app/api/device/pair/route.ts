import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hashDeviceSecret } from '@/lib/crypto';
import { isDemoMode } from '@/lib/demo-mode';
import { jsonError } from '@/lib/http';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const runtime = 'nodejs';

const pairSchema = z.object({
  device_uid: z.string().min(4).max(120),
  pairing_code: z.string().min(6).max(12),
  device_secret: z.string().min(16),
});

export async function POST(request: Request) {
  const parsed = pairSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const deviceUid = parsed.data.device_uid.trim();
  const pairingCode = parsed.data.pairing_code.trim().toUpperCase();
  const deviceSecret = parsed.data.device_secret.trim();

  if (isDemoMode()) {
    return NextResponse.json({
      ok: true,
      device_id: `demo-${deviceUid}`,
      paired_at: new Date().toISOString(),
      demo: true,
    });
  }

  const service = createServiceRoleClient();
  const nowIso = new Date().toISOString();

  const { data: pairing, error: pairingError } = await service
    .from('device_pairing_codes')
    .select('code, device_uid, expires_at')
    .eq('code', pairingCode)
    .eq('device_uid', deviceUid)
    .maybeSingle();

  if (pairingError) return jsonError(pairingError.message, 500);
  if (!pairing) return jsonError('Pairing code invalido.', 401);
  if (new Date(pairing.expires_at).getTime() < Date.now()) return jsonError('Pairing code expirado.', 401);

  const { data: device, error: deviceError } = await service
    .from('devices')
    .select('id, owner_id, device_secret_hash')
    .eq('device_uid', deviceUid)
    .maybeSingle();
  if (deviceError) return jsonError(deviceError.message, 500);
  if (!device) return jsonError('Device nao encontrado.', 404);

  const incomingHash = hashDeviceSecret(deviceSecret);
  if (incomingHash !== device.device_secret_hash) return jsonError('Secret invalido.', 401);
  if (!device.owner_id) return jsonError('Device sem owner associado.', 409);

  const { error: updateError } = await service
    .from('devices')
    .update({
      status: 'online',
      last_seen_at: nowIso,
    })
    .eq('id', device.id);
  if (updateError) return jsonError(updateError.message, 500);

  const { error: deleteError } = await service.from('device_pairing_codes').delete().eq('code', pairingCode);
  if (deleteError) return jsonError(deleteError.message, 500);

  return NextResponse.json({
    ok: true,
    device_id: device.id,
    paired_at: nowIso,
  });
}
