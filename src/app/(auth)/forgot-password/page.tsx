"use client";

import { useState } from "react";
import Link from "next/link";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setError(data.error || "Too many requests. Please try again later.");
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            &larr; Back to site
          </a>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="font-serif text-5xl font-normal tracking-tight leading-[1.08] text-white mb-5">
            Secure your<br />account <em className="not-italic text-[var(--lime)]">easily</em>.
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed max-w-[380px] mb-10">
            We&apos;ll send a secure link to your email. Click it to set a new password and get back to managing your campaigns.
          </p>

          <div className="flex flex-col gap-2 max-w-[400px]">
            {[
              { icon: "✉", text: "Secure reset link sent to your email" },
              { icon: "⏱", text: "Link expires after 15 minutes" },
              { icon: "🔒", text: "One-time use for your protection" },
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

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--lime)] rounded-[16px] flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="3" y="7" width="22" height="15" rx="2" stroke="#111" strokeWidth="2" />
                  <path d="M3 9l11 8 11-8" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] mb-2 leading-[1.15]">
                Check your email.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-8 leading-relaxed">
                If an account exists with <strong className="text-[var(--dark)]">{email}</strong>, a password reset link has been sent. The link will expire in 15 minutes.
              </p>

              <Link
                href="/login"
                className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 no-underline hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M7 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to Login
              </Link>

              <p className="text-[12px] text-[var(--text3)] mt-5 leading-relaxed">
                Didn&apos;t receive it? Check your spam folder, or{" "}
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-[var(--text)] font-semibold bg-transparent border-none cursor-pointer p-0 underline hover:no-underline"
                >
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text3)] no-underline mb-6 hover:text-[var(--text)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to Login
              </Link>

              <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
                Forgot your password?
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-7 leading-normal">
                Enter the email associated with your account and we&apos;ll send you a password reset link.
              </p>

              {error && (
                <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@brand.com"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
