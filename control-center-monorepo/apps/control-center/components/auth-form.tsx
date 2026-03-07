'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'login' | 'signup';

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/dashboard';
  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState(demoMode ? 'sebastienrgomes@gmail.com' : '');
  const [password, setPassword] = useState(demoMode ? '1234567890' : '');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    try {
      if (demoMode) {
        const response = await fetch('/api/demo-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: mode,
            email,
            password,
            ...(mode === 'signup' ? { fullName } : {}),
          }),
        });

        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? 'Falha na autenticacao demo.');

        router.push(nextPath);
        router.refresh();
        return;
      }

      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (signUpError) throw signUpError;
        setInfo('Conta criada. Se a confirmacao por email estiver ativa, confirma o email antes de entrar.');
        setMode('login');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push(nextPath);
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha na autenticacao.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-blue-100 bg-[#f4f7ff] p-1.5">
        <Button
          className="h-10"
          variant={mode === 'login' ? 'default' : 'ghost'}
          onClick={() => setMode('login')}
          type="button"
        >
          Login
        </Button>
        <Button
          className="h-10"
          variant={mode === 'signup' ? 'default' : 'ghost'}
          onClick={() => setMode('signup')}
          type="button"
        >
          Signup
        </Button>
      </div>

      {mode === 'signup' ? (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="full-name">
            Nome
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="full-name"
            placeholder="Nome completo"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="email">
          Email
        </Label>
        <Input
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="email"
          placeholder="nome@exemplo.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="password">
          Password
        </Label>
        <Input
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {demoMode && mode === 'login' ? (
        <p className="rounded-lg border border-blue-100 bg-[#f5f8ff] px-3 py-2 text-xs text-[#3e5186]">
          Demo rapido: credenciais ja preenchidas para entrares imediatamente.
        </p>
      ) : null}

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p> : null}

      <Button className="h-11 w-full" disabled={busy} type="submit">
        {busy ? 'A processar...' : mode === 'signup' ? 'Criar conta' : 'Entrar'}
      </Button>
    </form>
  );
}
