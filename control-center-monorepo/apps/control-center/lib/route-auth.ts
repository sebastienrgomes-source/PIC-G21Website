import { jsonError } from '@/lib/http';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const requireAuthenticatedUser = async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { errorResponse: jsonError('Unauthorized', 401), user: null, supabase: null };
  }

  return { errorResponse: null, user, supabase };
};
