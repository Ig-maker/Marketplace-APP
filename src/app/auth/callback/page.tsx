"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";

const OAUTH_INTENT_KEY = "shelvian_oauth_intent";
const LINK_DATA_KEY = "shelvian_link_data";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      const intent = localStorage.getItem(OAUTH_INTENT_KEY);
      localStorage.removeItem(OAUTH_INTENT_KEY);
      const isLoginMode = intent === "login";

      if (error) {
        console.error("OAuth error:", error, errorDescription);
        const target = isLoginMode ? "/login" : "/signup/brand";
        router.push(`${target}?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (!code) {
        router.push(isLoginMode ? "/login" : "/signup/brand");
        return;
      }

      const supabase = createSupabaseClient();

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError || !data.session) {
        const detail = exchangeError?.message ?? "no_session";
        console.error("Session exchange error:", detail, exchangeError);
        const target = isLoginMode ? "/login" : "/signup/brand";
        router.push(`${target}?error=oauth_failed&detail=${encodeURIComponent(detail)}`);
        return;
      }

      const user = data.session.user;
      const meta = user.user_metadata ?? {};

      const firstName = (meta.given_name as string) || "";
      const lastName = (meta.family_name as string) || "";
      const fullName =
        (meta.full_name as string) ||
        (meta.name as string) ||
        `${firstName} ${lastName}`.trim();

      if (isLoginMode) {
        const res = await fetch("/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseUserId: user.id,
            email: user.email ?? "",
            fullName,
            avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || "",
          }),
        });

        const result = await res.json();

        if (!result.success) {
          if (result.code === "LINKING_REQUIRED") {
            localStorage.setItem(LINK_DATA_KEY, JSON.stringify({
              email: user.email ?? "",
              googleSupabaseUserId: user.id,
              fullName,
              avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || "",
            }));
            router.push("/link-account");
            return;
          }

          const errorMsg = encodeURIComponent(result.error || "Login failed");
          router.push(`/login?google_error=${errorMsg}`);
          return;
        }

        router.push(result.profileCompleted ? "/dashboard" : "/onboarding/brand");
        return;
      }

      const res = await fetch("/api/auth/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: user.id,
          email: user.email ?? "",
          fullName,
          firstName,
          lastName,
          avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || "",
          rawMetadata: meta,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        console.error("Registration error:", result.error);
        router.push("/signup/brand?error=registration_failed");
        return;
      }

      router.push(result.profileCompleted ? "/dashboard" : "/signup/brand/complete");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
        <p className="text-[14px] text-[var(--muted)] font-sans">Completing sign in…</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
