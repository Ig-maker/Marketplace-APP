"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseEmailClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

type PageState = "loading" | "form" | "success" | "error";

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "var(--red, #C0392B)" };
  if (score <= 2) return { score, label: "Fair", color: "#E67E22" };
  if (score <= 3) return { score, label: "Good", color: "#F1C40F" };
  return { score, label: "Strong", color: "#27AE60" };
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabaseRef = useRef<SupabaseClient | null>(null);
  if (!supabaseRef.current) {
    supabaseRef.current = createSupabaseEmailClient();
  }

  const [pageState, setPageState] = useState<PageState>(
    tokenHash && type === "recovery" ? "loading" : "error"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    if (!tokenHash || type !== "recovery") {
      setTokenError("Invalid or missing reset link. Please request a new one.");
      setPageState("error");
      return;
    }

    const verifyToken = async () => {
      const supabase = supabaseRef.current!;
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (verifyError) {
        console.error("[reset-password] Token verification failed:", verifyError.message);
        setTokenError(
          verifyError.message.includes("expired")
            ? "This reset link has expired. Please request a new one."
            : "This reset link is invalid or has already been used. Please request a new one."
        );
        setPageState("error");
        return;
      }

      setPageState("form");
    };

    verifyToken();
  }, [tokenHash, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = supabaseRef.current!;
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("[reset-password] Update failed:", updateError.message);
        setError(updateError.message || "Failed to update password. Please try again.");
        return;
      }

      setPageState("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[52%] flex-shrink-0 bg-[#0d0d0d] relative flex-col justify-between p-10 xl:px-[52px] xl:py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 80% at 30% 60%, rgba(203,236,69,0.08) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] bg-[var(--lime)] rounded-[9px] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
              </svg>
            </div>
            <span className="font-serif text-xl text-white tracking-tight">Shelvian</span>
          </Link>
          <a href="https://shelvian.co" className="text-[13px] font-medium text-white/40 no-underline hover:text-white/80 transition-colors">
            Back to site &rarr;
          </a>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="font-serif text-5xl font-normal tracking-tight leading-[1.08] text-white mb-5">
            Set a new<br /><em className="not-italic text-[var(--lime)]">password</em>.
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed max-w-[380px] mb-10">
            Choose a strong password to keep your brand dashboard and campaign data secure.
          </p>

          <div className="flex flex-col gap-2 max-w-[400px]">
            {[
              { icon: "🔑", text: "At least 8 characters long" },
              { icon: "🔠", text: "Mix of uppercase and lowercase" },
              { icon: "🔢", text: "Include numbers or special characters" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/[0.06] border border-white/[0.09] rounded-[10px] px-4 py-3 flex items-center gap-3 backdrop-blur-sm"
                style={{ animation: `slideIn 400ms ${100 + i * 100}ms cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-[16px]">
                  {item.icon}
                </div>
                <div className="text-[13px] font-medium text-white/70">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 border-t border-white/[0.08] pt-7">
          {[
            { value: "500+", label: "CPG brands\non platform" },
            { value: "97%", label: "Shift fill\nrate" },
            { value: "4.8★", label: "Avg ambassador\nrating" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-serif text-[28px] text-white leading-none mb-1">
                <span className="text-[var(--lime)]">{stat.value}</span>
              </div>
              <div className="text-[12px] text-white/35 leading-snug whitespace-pre-line">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 overflow-y-auto bg-[var(--off)] relative z-10">
        <div className="w-full max-w-[400px]" style={{ animation: "fadeUp 500ms cubic-bezier(0.22,1,0.36,1) both" }}>

          {/* LOADING STATE */}
          {pageState === "loading" && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
              <p className="text-[14px] text-[var(--text3)]">Verifying your reset link…</p>
            </div>
          )}

          {/* TOKEN ERROR STATE */}
          {pageState === "error" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(192,57,43,0.1)] rounded-[16px] flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="var(--red, #C0392B)" strokeWidth="2" />
                  <path d="M14 9v6M14 18v1" stroke="var(--red, #C0392B)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] mb-2 leading-[1.15]">
                Link expired.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-8 leading-relaxed">
                {tokenError}
              </p>

              <Link
                href="/forgot-password"
                className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 no-underline hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all"
              >
                Request New Link
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>

              <p className="text-center text-[13px] text-[var(--text3)] mt-5">
                <Link href="/login" className="text-[var(--text)] font-semibold no-underline hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          )}

          {/* PASSWORD FORM */}
          {pageState === "form" && (
            <div>
              <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
                Reset your password.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-7 leading-normal">
                Choose a strong new password for your account.
              </p>

              {error && (
                <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      autoFocus
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)] pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition-colors p-1 flex items-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="mt-2.5">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className="flex-1 h-[3px] rounded-full transition-colors duration-200"
                            style={{
                              backgroundColor:
                                level <= strength.score
                                  ? strength.color
                                  : "var(--border)",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        className="text-[11px] font-medium transition-colors"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      className={`w-full bg-[var(--surface)] border-[1.5px] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)] pr-10 ${
                        passwordMismatch
                          ? "border-[var(--red)] focus:border-[var(--red)]"
                          : "border-[var(--border)] focus:border-[var(--dark)]"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition-colors p-1 flex items-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </button>
                  </div>
                  {passwordMismatch && (
                    <div className="text-[11px] text-[var(--red)] mt-1.5">
                      Passwords do not match
                    </div>
                  )}
                  {confirmPassword.length > 0 && !passwordMismatch && (
                    <div className="text-[11px] text-[#27AE60] mt-1.5 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Passwords match
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Reset Password"}
                  {!loading && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SUCCESS STATE */}
          {pageState === "success" && (
            <div className="text-center" style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}>
              <div className="w-16 h-16 bg-[var(--lime)] rounded-[16px] flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M7 14l5 5 9-9" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] mb-2 leading-[1.15]">
                Password updated.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-8 leading-relaxed">
                Your password has been successfully updated. You can now log in with your new password.
              </p>

              <Link
                href="/login"
                className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 no-underline hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all"
              >
                Go to Login
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
