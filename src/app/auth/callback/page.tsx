"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";

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

      if (error) {
        console.error("OAuth error:", error, errorDescription);
        router.push(`/signup/brand?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (!code) {
        router.push("/signup/brand");
        return;
      }

      const supabase = createSupabaseClient();

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError || !data.session) {
        console.error("Session exchange error:", exchangeError);
        router.push("/signup/brand?error=oauth_failed");
        return;
      }

      const user = data.session.user;
      const meta = user.user_metadata ?? {};

      // Derive name parts — Google provides given_name / family_name
      const firstName = (meta.given_name as string) || "";
      const lastName = (meta.family_name as string) || "";
      const fullName =
        (meta.full_name as string) ||
        (meta.name as string) ||
        `${firstName} ${lastName}`.trim();

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

      // Skip the completion form for returning users who already filled it out
      router.push(result.profileCompleted ? "/dashboard" : "/signup/brand/complete");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
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
