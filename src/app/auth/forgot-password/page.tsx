"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseEmailClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseEmailClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--off)]">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
        <Link
          href="/login"
          className="flex items-center gap-[5px] text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L3 6.5 8 11" />
          </svg>
          Back
        </Link>
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
          {!sent ? (
            <>
              <div className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Account recovery
              </div>
              <h1 className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-1.5">
                Forgot your <em className="italic underline decoration-[var(--lime)] underline-offset-4">password?</em>
              </h1>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-7">
                Enter your work email and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-[var(--r)] px-4 py-3 mb-5 text-[13px] text-[#C0392B]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="you@yourbrand.com"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? "Sending…" : "Send reset link"}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  )}
                </button>
              </form>

              <p className="text-center text-[12px] text-[var(--muted)] mt-5">
                Remember it?{" "}
                <Link href="/login" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors">
                  Back to log in
                </Link>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-[68px] h-[68px] rounded-full bg-[var(--lime)] flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="24" height="17" rx="2" />
                  <path d="M3 9l12 9 12-9" />
                </svg>
              </div>
              <h2 className="font-serif text-[24px] text-[var(--dark)]">Check your email</h2>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[300px]">
                We sent a reset link to <strong className="text-[var(--dark)]">{email}</strong>.
                Click it to choose a new password.
              </p>
              <p className="text-[12px] text-[var(--muted)]">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-[var(--dark)] font-semibold bg-transparent border-none cursor-pointer border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors font-sans text-[12px] p-0"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}
