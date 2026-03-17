import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// OAuth client (Google) — PKCE flow.
// detectSessionInUrl:false prevents Supabase from auto-consuming the code
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

// Email client — no PKCE, so Supabase sends token_hash (not code) in
// confirmation emails. This makes confirmation links work cross-device.
export function createSupabaseEmailClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
