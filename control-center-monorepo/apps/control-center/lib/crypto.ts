import { createHash, randomBytes } from 'crypto';

export const generatePairingCode = (length = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};

export const generateDeviceSecret = (): string => randomBytes(24).toString('base64url');

export const hashDeviceSecret = (secret: string): string =>
  createHash('sha256').update(secret).digest('hex');
