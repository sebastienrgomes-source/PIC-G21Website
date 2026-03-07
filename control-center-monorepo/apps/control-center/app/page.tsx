import { redirect } from 'next/navigation';
import { getDemoSession } from '@/lib/demo-auth';
import { isDemoMode } from '@/lib/demo-mode';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  if (isDemoMode()) {
    const session = getDemoSession();
    if (session) redirect('/dashboard');
    redirect('/login');
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');
  redirect('/login');
}
