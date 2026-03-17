"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseEmailClient } from "@/lib/supabase";

function ConfirmHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleConfirm = async () => {
      // Supabase redirects after /verify using hash fragments (implicit flow):
      //   /auth/confirm#access_token=xxx&refresh_token=xxx&type=signup
      // We also handle the token_hash query-param format (if email template is customised):
      //   /auth/confirm?token_hash=xxx&type=signup
      const hash = window.location.hash.slice(1);
      const hashParams = new URLSearchParams(hash);

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hashError = hashParams.get("error");
      const hashErrorDesc = hashParams.get("error_description");

      const tokenHash = searchParams.get("token_hash");
      const typeParam = searchParams.get("type") || hashParams.get("type") || "signup";
      const queryError = searchParams.get("error");
      const queryErrorDesc = searchParams.get("error_description") || searchParams.get("detail");

      // Surface any error from either flow
      const error = queryError || hashError;
      const errorDesc = queryErrorDesc || hashErrorDesc;
      if (error) {
        router.push(
          `/signup/brand?error=${encodeURIComponent(errorDesc || error)}`
        );
        return;
      }

      const supabase = createSupabaseEmailClient();
      let sessionUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null = null;

      if (accessToken && refreshToken) {
        // ── Implicit flow ──────────────────────────────────────────────────────
        // Supabase /verify redirected here with tokens in the URL hash.
        const { data, error: setError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setError || !data.session) {
          console.error("[confirm] setSession error:", setError?.message);
          router.push(`/signup/brand?error=confirm_failed&detail=${encodeURIComponent(setError?.message ?? "no_session")}`);
          return;
        }
        sessionUser = data.session.user;
      } else if (tokenHash) {
        // ── Token-hash flow ────────────────────────────────────────────────────
        // Email template uses {{ .TokenHash }} pointing directly to this page.
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: typeParam as "signup" | "email",
        });
        if (verifyError || !data.session) {
          console.error("[confirm] verifyOtp error:", verifyError?.message);
          router.push(`/signup/brand?error=confirm_failed&detail=${encodeURIComponent(verifyError?.message ?? "no_session")}`);
          return;
        }
        sessionUser = data.session.user;
      } else {
        // No recognisable params — send back to sign up
        router.push("/signup/brand");
        return;
      }

      // Create the Shelvian session cookie
      const meta = (sessionUser.user_metadata ?? {}) as Record<string, string>;
      const res = await fetch("/api/auth/email-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: sessionUser.id,
          email: sessionUser.email ?? "",
          fullName: meta.full_name || "",
          firstName: meta.first_name || "",
          lastName: meta.last_name || "",
        }),
      });

      const result = await res.json();
      if (!result.success) {
        console.error("[confirm] email-confirm error:", result.error);
        router.push("/signup/brand?error=confirm_failed");
        return;
      }

      router.push("/onboarding/brand");
    };

    handleConfirm();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-[68px] h-[68px] rounded-full bg-[var(--lime)] flex items-center justify-center mb-2"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="24" height="17" rx="2" />
            <path d="M3 9l12 9 12-9" />
          </svg>
        </div>
        <p className="font-serif text-[20px] text-[var(--dark)] tracking-tight">Confirming your account…</p>
        <p className="text-[13px] text-[var(--muted)]">Just a moment</p>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.96); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
      </div>
    }>
      <ConfirmHandler />
    </Suspense>
  );
}
