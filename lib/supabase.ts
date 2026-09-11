import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Returns a singleton instance of the Supabase Admin Client using the SERVICE_ROLE_KEY.
 * This client runs strictly on the server (API routes / server components) and must
 * NEVER be exposed to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    // Graceful check: allow compilation and local preview even if env vars are pending setup
    return null;
  }

  try {
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return supabaseAdminInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase admin client:', error);
    return null;
  }
}
