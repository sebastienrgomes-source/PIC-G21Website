import { NextResponse } from 'next/server';
import { z } from 'zod';
import { DEMO_AUTH_COOKIE, DEMO_AUTH_VALUE, DEMO_EMAIL_COOKIE, DEMO_NAME_COOKIE, isDemoMode } from '@/lib/demo-mode';
import { createDemoUser, validateDemoCredentials } from '@/lib/demo-user-store';

export const runtime = 'nodejs';

const requestSchema = z.object({
  action: z.enum(['signup', 'login']),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().min(2).max(120).optional(),
  ),
});

const cookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: false,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
};

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: 'Demo auth is disabled.' }, { status: 404 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { action, email, password, fullName } = parsed.data;
  const fallbackName = email.split('@')[0] || 'PIC Demo User';
  const requestedFullName = fullName?.trim() || fallbackName;
  let resolvedEmail = email.trim();
  let resolvedFullName = requestedFullName;

  if (action === 'signup') {
    const created = createDemoUser({
      email,
      password,
      fullName: requestedFullName,
    });

    if (!created) {
      return NextResponse.json({ error: 'Este email ja existe. Faz login.' }, { status: 409 });
    }

    resolvedEmail = created.email;
    resolvedFullName = created.fullName;
  } else {
    const user = validateDemoCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Email ou password invalidos.' }, { status: 401 });
    }

    resolvedEmail = user.email;
    resolvedFullName = user.fullName;
  }

  const response = NextResponse.json({ ok: true, action });

  response.cookies.set(DEMO_AUTH_COOKIE, DEMO_AUTH_VALUE, cookieOptions);
  response.cookies.set(DEMO_EMAIL_COOKIE, encodeURIComponent(resolvedEmail), cookieOptions);
  response.cookies.set(DEMO_NAME_COOKIE, encodeURIComponent(resolvedFullName), cookieOptions);

  return response;
}

export async function DELETE() {
  if (!isDemoMode()) {
    return NextResponse.json({ ok: true });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEMO_AUTH_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(DEMO_EMAIL_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(DEMO_NAME_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
