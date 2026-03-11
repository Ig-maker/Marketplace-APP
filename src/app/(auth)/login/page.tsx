"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/lib/constants";

type Role = "brand" | "ambassador";
type AmbStep = "phone" | "otp";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || DEFAULT_REDIRECT;

  const [role, setRole] = useState<Role>("ambassador");
  const [ambStep, setAmbStep] = useState<AmbStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length >= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length >= 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setError("");
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter your phone number");
      phoneRef.current?.focus();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setAmbStep("otp");
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(redirectTo);
      } else {
        setError(data.error || "Invalid code");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [phone, redirectTo, router]);

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    if (code.length === 6) {
      handleVerifyOtp(code);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleBrandLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(redirectTo);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backToPhone = () => {
    setAmbStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  // Left panel content based on role
  const leftContent = role === "ambassador" ? {
    headline: <>Your next shift<br />is <em className="not-italic text-[var(--lime)]">waiting</em>.</>,
    sub: "CPG brands are posting demos right now. Log in to claim shifts near you, track earnings, and build your reputation.",
    shifts: [
      { code: "OAT", bg: "#CBEC45", brand: "Oatly — Whole Foods Silver Lake", detail: "Sat Mar 14 · 10am–2pm · $260" },
      { code: "SIE", bg: "#E8D5FF", brand: "Siete Foods — Target Culver City", detail: "Sun Mar 15 · 11am–3pm · $240" },
      { code: "CHO", bg: "#FFE4CC", brand: "Chomps — Sprouts Santa Monica", detail: "Sat Mar 14 · 12pm–4pm · $300" },
    ],
    stats: [
      { value: "12K+", label: "Active\nambassadors" },
      { value: "$260", label: "Avg earnings\nper shift" },
      { value: "24hr", label: "Average\npayout time" },
    ],
  } : {
    headline: <>Manage your<br />campaigns <em className="not-italic text-[var(--lime)]">live</em>.</>,
    sub: "Your brand dashboard shows real-time shift status, ambassador ratings, and event photo reports — all in one place.",
    shifts: [
      { code: "OAT", bg: "#CBEC45", brand: "Oatly Spring Push — 8 stores", detail: "Live now · 6 of 8 ambassadors checked in" },
      { code: "97%", bg: "rgba(255,255,255,0.08)", brand: "Shift Fill Rate · March", detail: "32 of 33 shifts filled this month" },
      { code: "RPT", bg: "rgba(255,255,255,0.08)", brand: "Event report ready", detail: "Chomps · Sprouts Mar 14 · 94 samples out" },
    ],
    stats: [
      { value: "500+", label: "CPG brands\non platform" },
      { value: "97%", label: "Shift fill\nrate" },
      { value: "4.8★", label: "Avg ambassador\nrating" },
    ],
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[52%] flex-shrink-0 bg-[#0d0d0d] relative flex-col justify-between p-10 xl:px-[52px] xl:py-10 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 80% at 30% 60%, rgba(203,236,69,0.08) 0%, transparent 65%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] bg-[var(--lime)] rounded-[9px] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
              </svg>
            </div>
            <span className="font-serif text-xl text-white tracking-tight">Shelvian</span>
          </a>
          <a href="/" className="text-[13px] font-medium text-white/40 no-underline hover:text-white/80 transition-colors">
            Back to site &rarr;
          </a>
        </div>

        {/* Middle content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="font-serif text-5xl font-normal tracking-tight leading-[1.08] text-white mb-5">
            {leftContent.headline}
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed max-w-[380px] mb-10">
            {leftContent.sub}
          </p>

          <div className="flex flex-col gap-2 max-w-[400px]">
            {leftContent.shifts.map((shift, i) => (
              <div
                key={i}
                className="bg-white/[0.06] border border-white/[0.09] rounded-[10px] px-4 py-3 flex items-center gap-3 backdrop-blur-sm hover:bg-white/[0.09] hover:border-[rgba(203,236,69,0.25)] hover:translate-x-[3px] transition-all duration-200"
                style={{ animation: `slideIn 400ms ${100 + i * 100}ms cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-medium text-[#111]" style={{ background: shift.bg }}>
                  {shift.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">{shift.brand}</div>
                  <div className="text-[11px] text-white/35 mt-px">{shift.detail}</div>
                </div>
                <div className="font-mono text-[15px] font-medium text-[var(--lime)] flex-shrink-0">&rarr;</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 border-t border-white/[0.08] pt-7">
          {leftContent.stats.map((stat, i) => (
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

          {/* Role tabs */}
          <div className="flex bg-[var(--elevated)] border border-[var(--border)] rounded-[var(--r-lg)] p-1 mb-8 gap-1">
            {(["brand", "ambassador"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(""); }}
                className={`flex-1 py-2.5 px-4 rounded-[10px] text-[13px] font-semibold flex items-center justify-center gap-[7px] border-none cursor-pointer transition-all duration-150 ${
                  role === r
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--sh)]"
                    : "bg-transparent text-[var(--text3)]"
                }`}
              >
                <div className={`w-[22px] h-[22px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition-colors ${
                  role === r ? "bg-[var(--lime)]" : "bg-[var(--elevated)]"
                }`}>
                  {r === "brand" ? (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M4 6.5h5M6.5 4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M1.5 11c0-2.5 2.24-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                {r === "brand" ? "Brand" : "Ambassador"}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
              {error}
            </div>
          )}

          {/* BRAND PANEL */}
          {role === "brand" && (
            <form onSubmit={handleBrandLogin}>
              <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
                Welcome back.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-7 leading-normal">
                Log in to your brand dashboard to manage shifts and ambassadors.
              </p>

              <button
                type="button"
                className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-[11px] px-4 font-sans text-[14px] font-semibold text-[var(--text)] cursor-pointer flex items-center justify-center gap-2.5 hover:border-[var(--border2)] hover:shadow-[var(--sh)] hover:-translate-y-px transition-all duration-150 mb-4"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[12px] text-[var(--text3)] font-mono uppercase tracking-wider flex-shrink-0">or</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="you@brand.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-[7px]">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)]">
                    Password
                  </label>
                  <a href="#" className="text-[12px] text-[var(--text3)] no-underline hover:text-[var(--text)] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition-colors p-1 flex items-center"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 mt-1 hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log in to Dashboard"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>

              <p className="text-center text-[13px] text-[var(--text3)] mt-6">
                New to Shelvian? <a href="/signup" className="text-[var(--text)] font-semibold no-underline hover:underline">Sign up as a brand &rarr;</a>
              </p>
              <p className="text-[11px] text-[var(--text3)] text-center leading-relaxed mt-4">
                By continuing you agree to our <a href="#" className="text-[var(--text3)] underline">Terms of Use</a> and <a href="#" className="text-[var(--text3)] underline">Privacy Policy</a>.
              </p>
            </form>
          )}

          {/* AMBASSADOR PANEL — Phone Step */}
          {role === "ambassador" && ambStep === "phone" && (
            <div>
              <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
                Log in.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-7 leading-normal">
                Enter your mobile number and we&apos;ll send you a verification code.
              </p>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[15px] text-[var(--text3)] pointer-events-none">
                    +1
                  </span>
                  <input
                    ref={phoneRef}
                    type="tel"
                    placeholder="(555) 000-0000"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 pl-11 pr-3.5 font-mono text-[16px] tracking-wide text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>
                <div className="text-[11px] text-[var(--text3)] mt-1.5 leading-snug">
                  We&apos;ll send a one-time code. Standard message rates may apply.
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[var(--lime)] text-[#111] border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 mt-1 hover:bg-[var(--lime-dark)] hover:shadow-[0_6px_20px_var(--lime-glow)] active:translate-y-0 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>

              <p className="text-center text-[13px] text-[var(--text3)] mt-6">
                New to Shelvian? <a href="/signup" className="text-[var(--text)] font-semibold no-underline hover:underline">Create ambassador account &rarr;</a>
              </p>
              <p className="text-[11px] text-[var(--text3)] text-center leading-relaxed mt-4">
                By continuing you agree to our <a href="#" className="text-[var(--text3)] underline">Terms of Use</a> and <a href="#" className="text-[var(--text3)] underline">Privacy Policy</a>.
              </p>
            </div>
          )}

          {/* AMBASSADOR PANEL — OTP Step */}
          {role === "ambassador" && ambStep === "otp" && (
            <div style={{ animation: "fadeUp 320ms cubic-bezier(0.22,1,0.36,1) both" }}>
              <button
                onClick={backToPhone}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text3)] no-underline mb-5 cursor-pointer bg-transparent border-none p-0 hover:text-[var(--text)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>

              <div className="w-14 h-14 bg-[var(--lime)] rounded-[14px] flex items-center justify-center mx-auto mb-5">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M6 13l5 5 9-9" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15] text-center">
                Enter your code.
              </div>
              <p className="text-[13px] text-[var(--text2)] text-center mb-5 leading-relaxed">
                We sent a 6-digit code to<br />
                <strong className="text-[var(--dark)]">+1 {phone}</strong>
              </p>

              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] font-mono text-[22px] font-medium text-[var(--text)] text-center outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp(otp.join(""))}
                disabled={loading || otp.join("").length < 6}
                className="w-full bg-[var(--lime)] text-[#111] border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] hover:shadow-[0_6px_20px_var(--lime-glow)] transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Log In"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>

              <p className="text-[13px] text-center text-[var(--text3)] mt-3.5">
                Didn&apos;t receive it?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); handleSendOtp(); }} className="text-[var(--text)] font-semibold no-underline hover:underline">Resend code</a>
                {" · "}
                <a href="#" onClick={(e) => { e.preventDefault(); backToPhone(); }} className="text-[var(--text)] font-semibold no-underline hover:underline">Change number</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
