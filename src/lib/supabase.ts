import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — used in client components for OAuth flow
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      persistSession: true,
    },
  });
}
