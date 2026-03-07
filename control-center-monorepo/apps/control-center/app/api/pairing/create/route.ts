import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDeviceSecret, generatePairingCode, hashDeviceSecret } from '@/lib/crypto';
import { getDemoSession } from '@/lib/demo-auth';
import { isDemoMode } from '@/lib/demo-mode';
import { jsonError } from '@/lib/http';
import { requireAuthenticatedUser } from '@/lib/route-auth';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const runtime = 'nodejs';

const requestSchema = z.object({
  device_uid: z.string().min(4).max(120),
  name: z.string().min(2).max(80).optional(),
});

const createPairingCode = async (
  deviceUid: string,
  expiresAt: string,
  service: ReturnType<typeof createServiceRoleClient>,
): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generatePairingCode(8);
    const { error } = await service.from('device_pairing_codes').insert({
      code,
      device_uid: deviceUid,
      expires_at: expiresAt,
    });

    if (!error) return code;
    if (error.code === '23505') continue;

    throw new Error(error.message);
  }

  throw new Error('Failed to generate unique pairing code.');
};

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const payload = parsed.data;

  if (isDemoMode()) {
    const session = getDemoSession();
    if (!session) return jsonError('Unauthorized', 401);

    const pairingCode = generatePairingCode(8);
    const provisioningSecret = generateDeviceSecret();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return NextResponse.json({
      pairingCode,
      expiresAt,
      deviceUid: payload.device_uid,
      provisioningSecret,
    });
  }

  const { errorResponse, user } = await requireAuthenticatedUser();
  if (errorResponse || !user) return errorResponse;

  const service = createServiceRoleClient();
  const provisioningSecret = generateDeviceSecret();
  const secretHash = hashDeviceSecret(provisioningSecret);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error: profileError } = await service.from('profiles').upsert(
    {
      id: user.id,
      full_name: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null,
    },
    { onConflict: 'id' },
  );
  if (profileError) return jsonError(`Profile error: ${profileError.message}`, 500);

  const { data: existing, error: existingError } = await service
    .from('devices')
    .select('id, owner_id, device_uid')
    .eq('device_uid', payload.device_uid)
    .maybeSingle();

  if (existingError) return jsonError(existingError.message, 500);
  if (existing?.owner_id && existing.owner_id !== user.id) {
    return jsonError('Device UID ja associado a outro utilizador.', 403);
  }

  const { data: device, error: upsertError } = await service
    .from('devices')
    .upsert(
      {
        device_uid: payload.device_uid,
        owner_id: user.id,
        name: payload.name ?? 'My Device',
        device_secret_hash: secretHash,
        status: 'offline',
      },
      {
        onConflict: 'device_uid',
      },
    )
    .select('id, device_uid')
    .single();

  if (upsertError || !device) return jsonError(upsertError?.message ?? 'Device upsert failed', 500);

  const { error: settingsError } = await service.from('device_settings').upsert(
    {
      device_id: device.id,
    },
    { onConflict: 'device_id' },
  );
  if (settingsError) return jsonError(`Settings error: ${settingsError.message}`, 500);

  const { error: cleanupError } = await service
    .from('device_pairing_codes')
    .delete()
    .eq('device_uid', payload.device_uid);
  if (cleanupError) return jsonError(`Pairing cleanup error: ${cleanupError.message}`, 500);

  let pairingCode: string;
  try {
    pairingCode = await createPairingCode(payload.device_uid, expiresAt, service);
  } catch (error) {
    return jsonError(error instanceof Error ? `Pairing error: ${error.message}` : 'Pairing error', 500);
  }

  return NextResponse.json({
    pairingCode,
    expiresAt,
    deviceUid: payload.device_uid,
    provisioningSecret,
  });
}
