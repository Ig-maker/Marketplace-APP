import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — used in client components for OAuth flow.
// detectSessionInUrl is false so Supabase does NOT auto-consume the PKCE code
// on the callback page; we exchange it manually in /auth/callback.
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
