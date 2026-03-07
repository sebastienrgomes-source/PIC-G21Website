import { cookies } from 'next/headers';
import { DEMO_AUTH_COOKIE, DEMO_AUTH_VALUE, DEMO_EMAIL_COOKIE, DEMO_NAME_COOKIE, isDemoMode } from '@/lib/demo-mode';

export interface DemoSession {
  id: string;
  email: string;
  fullName: string;
}

export const getDemoSession = (): DemoSession | null => {
  if (!isDemoMode()) return null;

  const cookieStore = cookies();
  const authCookie = cookieStore.get(DEMO_AUTH_COOKIE)?.value;
  if (authCookie !== DEMO_AUTH_VALUE) return null;

  const emailRaw = cookieStore.get(DEMO_EMAIL_COOKIE)?.value ?? 'demo@pic.local';
  const nameRaw = cookieStore.get(DEMO_NAME_COOKIE)?.value ?? 'PIC Demo User';

  const email = decodeURIComponent(emailRaw);
  const fullName = decodeURIComponent(nameRaw);

  return {
    id: 'demo-user',
    email,
    fullName,
  };
};
