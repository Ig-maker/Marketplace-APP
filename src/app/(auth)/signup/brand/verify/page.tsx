"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseEmailClient } from "@/lib/supabase";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendError("");
    try {
      const supabase = createSupabaseEmailClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
      });
      if (error) {
        setResendError("Could not resend. Please try again.");
      } else {
        setResendDone(true);
        setTimeout(() => setResendDone(false), 5000);
      }
    } catch {
      setResendError("Network error. Please try again.");
    } finally {
      setResending(false);
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

      {/* PROGRESS */}
      <div className="h-[2px] bg-[var(--border)] sticky top-[60px] z-[99]">
        <div className="h-full bg-[var(--lime)] w-[60%] transition-[width] duration-500" />
      </div>

      {/* CARD */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div
          className="w-full max-w-[440px] bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[0_4px_32px_rgba(0,0,0,0.07)] px-10 py-10 flex flex-col items-center text-center"
          style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {/* Envelope icon */}
          <div className="w-[68px] h-[68px] rounded-full bg-[var(--lime)] flex items-center justify-center mb-6">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="24" height="17" rx="2" />
              <path d="M3 9l12 9 12-9" />
            </svg>
          </div>

          <h1 className="font-serif text-[26px] font-normal tracking-tight text-[var(--dark)] mb-2 leading-[1.2]">
            Check your email
          </h1>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-6">
            We sent a confirmation link to{" "}
            {email ? (
              <strong className="text-[var(--dark)] font-semibold">{email}</strong>
            ) : (
              "your email address"
            )}
            . Click it to activate your account.
          </p>

          {/* Steps */}
          <div className="w-full flex flex-col gap-2 mb-8">
            {[
              { n: "1", text: "Open the email from Shelvian" },
              { n: "2", text: 'Click "Confirm your account"' },
              { n: "3", text: "You'll be taken straight to setup" },
            ].map((step) => (
              <div key={step.n} className="flex items-center gap-3 py-2.5 px-3.5 bg-[var(--elevated)] rounded-[var(--r)] text-left">
                <div className="w-6 h-6 rounded-full bg-[var(--lime)] flex items-center justify-center font-mono text-[11px] font-medium text-[var(--dark)] flex-shrink-0">
                  {step.n}
                </div>
                <span className="text-[13px] text-[var(--text2)]">{step.text}</span>
              </div>
            ))}
          </div>

          {/* Resend */}
          {resendError && (
            <p className="text-[12px] text-[#C0392B] mb-3">{resendError}</p>
          )}
          {resendDone ? (
            <p className="text-[13px] text-[var(--green)] font-medium mb-3">
              ✓ New email sent — check your inbox
            </p>
          ) : (
            <p className="text-[12px] text-[var(--muted)] mb-1">
              Didn&apos;t receive it?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-[var(--dark)] font-semibold bg-transparent border-none cursor-pointer border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors disabled:opacity-50 font-sans text-[12px] p-0"
              >
                {resending ? "Sending…" : "Resend email"}
              </button>
            </p>
          )}

          <p className="text-[11px] text-[var(--muted)] mt-4">
            Wrong email?{" "}
            <Link href="/signup/brand" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors">
              Go back and change it
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--off)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] border-t-[var(--dark)] animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
