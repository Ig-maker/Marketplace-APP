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
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        router.push(`/signup/brand?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (!tokenHash || !type) {
        router.push("/signup/brand");
        return;
      }

      const supabase = createSupabaseEmailClient();

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "signup" | "email",
      });

      if (verifyError || !data.session) {
        console.error("[confirm] verifyOtp error:", verifyError?.message);
        router.push(
          `/signup/brand?error=confirm_failed&detail=${encodeURIComponent(
            verifyError?.message ?? "no_session"
          )}`
        );
        return;
      }

      const user = data.session.user;
      const meta = user.user_metadata ?? {};

      // Create the Shelvian session
      const res = await fetch("/api/auth/email-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: user.id,
          email: user.email ?? "",
          fullName: (meta.full_name as string) || "",
          firstName: (meta.first_name as string) || "",
          lastName: (meta.last_name as string) || "",
        }),
      });

      const result = await res.json();

      if (!result.success) {
        console.error("[confirm] session creation error:", result.error);
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
        <div className="w-[68px] h-[68px] rounded-full bg-[var(--lime)] flex items-center justify-center mb-2"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
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
