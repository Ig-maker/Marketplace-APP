"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseEmailClient } from "@/lib/supabase";

type Phase = "loading" | "form" | "success" | "invalid";

function ResetPasswordHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Store tokens from hash so we can use them on submit
  const accessTokenRef = useRef("");
  const refreshTokenRef = useRef("");

  useEffect(() => {
    // Supabase sends the recovery session as hash fragments:
    //   /auth/reset-password#access_token=xxx&refresh_token=xxx&type=recovery
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");
    const hashError = params.get("error_description") || params.get("error");

    // Also check query params (future-proof)
    const queryError = searchParams.get("error");

    if (hashError || queryError) {
      setPhase("invalid");
      setError(hashError || queryError || "Invalid reset link");
      return;
    }

    if (accessToken && refreshToken && type === "recovery") {
      accessTokenRef.current = accessToken;
      refreshTokenRef.current = refreshToken;
      setPhase("form");
    } else {
      setPhase("invalid");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseEmailClient();

      // Establish the Supabase session from the recovery tokens
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessTokenRef.current,
        refresh_token: refreshTokenRef.current,
      });

      if (sessionError || !sessionData.session) {
        setError("Your reset link has expired. Please request a new one.");
        setLoading(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Create the Shelvian session cookie
      const user = sessionData.session.user;
      const meta = (user.user_metadata ?? {}) as Record<string, string>;
      const res = await fetch("/api/auth/email-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: user.id,
          email: user.email ?? "",
          fullName: meta.full_name || "",
          firstName: meta.first_name || "",
          lastName: meta.last_name || "",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setPhase("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        // Password updated but session creation failed — still go to login
        setPhase("success");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--off)]">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
        <div className="w-[60px]" />
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="#1A1A14" />
            <line x1="17" y1="8.5" x2="17" y2="25.5" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="8.5" y1="17" x2="25.5" y2="17" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="11" y1="11" x2="23" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="23" y1="11" x2="11" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          <span className="font-serif text-lg text-[#111] tracking-tight">Shelvian</span>
        </Link>
        <div className="w-[60px]" />
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div
          className="w-full max-w-[420px] bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[0_4px_32px_rgba(0,0,0,0.07)] px-10 py-10"
          style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}
        >

          {/* Loading */}
          {phase === "loading" && (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
              <p className="text-[14px] text-[var(--muted)]">Verifying reset link…</p>
            </div>
          )}

          {/* Invalid link */}
          {phase === "invalid" && (
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[rgba(192,57,43,0.1)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <h2 className="font-serif text-[22px] text-[var(--dark)]">Link invalid or expired</h2>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                {error || "This password reset link has expired or already been used."}
              </p>
              <Link
                href="/auth/forgot-password"
                className="w-full py-3 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] transition-all no-underline mt-2"
              >
                Request a new link
              </Link>
              <Link href="/login" className="text-[13px] text-[var(--muted)] hover:text-[var(--dark)] transition-colors no-underline">
                Back to log in
              </Link>
            </div>
          )}

          {/* Password form */}
          {phase === "form" && (
            <>
              <div className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Reset your password
              </div>
              <h1 className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-1.5">
                Choose a new <em className="italic underline decoration-[var(--lime)] underline-offset-4">password</em>
              </h1>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-7">
                Pick something strong — at least 8 characters.
              </p>

              {error && (
                <div className="bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-[var(--r)] px-4 py-3 mb-5 text-[13px] text-[#C0392B]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-[18px]">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      autoFocus
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 pr-11 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--muted)] hover:text-[var(--dark)] transition-colors p-0 flex items-center"
                    >
                      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        <circle cx="9" cy="9" r="2.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    Confirm password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? "Updating…" : "Set new password"}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Success */}
          {phase === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-[var(--lime)] flex items-center justify-center" style={{ animation: "popIn 480ms cubic-bezier(0.22,1,0.36,1) both" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 14l6 6 12-12" />
                </svg>
              </div>
              <h2 className="font-serif text-[24px] text-[var(--dark)]">Password updated!</h2>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Redirecting you to the dashboard…
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes popIn { from { transform:scale(0.3); opacity:0; } to { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
      </div>
    }>
      <ResetPasswordHandler />
    </Suspense>
  );
}
