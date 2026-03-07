'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { Button, type ButtonProps } from '@/components/ui/button';

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface SignOutButtonProps {
  className?: string;
  label?: string;
  variant?: ButtonProps['variant'];
}

export function SignOutButton({ className, label = 'Logout', variant = 'outline' }: SignOutButtonProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const onClick = async () => {
    if (demoMode) {
      await fetch('/api/demo-auth', { method: 'DELETE' });
    } else {
      await supabase.auth.signOut();
    }

    router.push('/login');
    router.refresh();
  };

  return (
    <Button className={className} onClick={onClick} variant={variant}>
      {label}
    </Button>
  );
}
