"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/lib/constants";

export default function BrandSignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pwRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length >= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length >= 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setError("First name, email, and password are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          phone: phone ? `+1 ${phone}` : undefined,
          role: "brand",
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/onboarding/brand");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkmarks = [
    { bold: "No agency overhead", text: " \u2014 pay only for completed shifts" },
    { bold: "97% fill rate", text: " \u2014 auto-backup fills cancellations in 2 hrs" },
    { bold: "Live event photos", text: " \u2014 GPS check-in and reports per shift" },
  ];

  const stats = [
    { value: "2,471", label: "Ambassadors" },
    { value: "12", label: "Active cities" },
    { value: "94%", label: "Re-book rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
        <a href="https://shelvian.co" className="flex items-center gap-[5px] text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2L3 6.5 8 11" /></svg>
          Back
        </a>
        <a href="/" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="#1A1A14" />
            <line x1="17" y1="8.5" x2="17" y2="25.5" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="8.5" y1="17" x2="25.5" y2="17" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="11" y1="11" x2="23" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="23" y1="11" x2="11" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          <span className="font-serif text-lg text-[#111] tracking-tight">Shelvian</span>
        </a>
        <a href="/login" className="text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">Log in</a>
      </nav>

      {/* PROGRESS BAR */}
      <div className="h-[2px] bg-[var(--border)] sticky top-[60px] z-[99]">
        <div className="h-full bg-[var(--lime)] w-[33%]" />
      </div>

      {/* PAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-62px)] relative z-[1]">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center sticky top-[62px] h-[calc(100vh-62px)] px-16 py-[72px]">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--dark)] bg-[var(--lime)] rounded-full px-3 py-1 w-fit mb-7">
            ● For brands
          </div>
          <h2 className="font-serif text-[42px] font-normal tracking-tight leading-[1.1] text-[var(--dark)] mb-[18px]">
            Post shifts.<br />Get filled<br /><em className="italic underline decoration-[var(--lime)] underline-offset-[5px]">in hours.</em>
          </h2>
          <p className="text-[15px] text-[var(--text2)] leading-[1.75] max-w-[360px] mb-11">
            Shelvian connects CPG brands with vetted in-store demo specialists &mdash; booked, managed, and reported from one dashboard.
          </p>

          <div className="flex flex-col gap-3 mb-12">
            {checkmarks.map((item, i) => (
              <div key={i} className="flex items-start gap-[11px]">
                <div className="w-5 h-5 rounded-[5px] bg-[var(--lime)] flex-shrink-0 flex items-center justify-center mt-px">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2.5 4-4.5" /></svg>
                </div>
                <span className="text-[14px] text-[var(--text2)] leading-[1.55]">
                  <strong className="text-[var(--dark)] font-semibold">{item.bold}</strong>{item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-7 pt-7 border-t border-[var(--border)]">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-[20px] font-medium text-[var(--dark)] tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5 uppercase tracking-[0.07em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[var(--surface)] border-l border-[var(--border)] lg:border-l flex flex-col items-center py-14 px-12 max-lg:px-7 max-lg:py-10 overflow-y-auto">
          <div className="w-full max-w-[400px]" style={{ animation: "fadeUp 500ms cubic-bezier(0.22,1,0.36,1) both" }}>
            <div className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
              Create your account
            </div>
            <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-1.5">
              Welcome to <em className="italic underline decoration-[var(--lime)] underline-offset-4">Shelvian</em>
            </div>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-8">
              Use your work email &mdash; your brand domain builds trust with ambassadors from day one.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
                {error}
              </div>
            )}

            {/* Google SSO */}
            <button
              type="button"
              className="w-full py-3 px-3.5 bg-[var(--surface)] text-[var(--dark)] font-sans text-[14px] font-medium border-[1.5px] border-[var(--border)] rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2.5 hover:border-[var(--border2)] hover:bg-[var(--elevated)] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[11px] text-[var(--muted)]">or sign up with email</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3 mb-[18px]">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="Jake"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                    className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="Chen"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setError(""); }}
                    className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>
              </div>

              {/* Work email */}
              <div className="mb-[18px]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="jake@yourbrand.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                />
                <div className="text-[11px] text-[var(--muted)] mt-[5px]">Your brand domain is visible to ambassadors.</div>
              </div>

              {/* Password */}
              <div className="mb-[18px]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={pwRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
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

              {/* Phone */}
              <div className="mb-[18px]">
                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Phone
                  <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--muted)] italic">Optional</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                />
                <div className="text-[11px] text-[var(--muted)] mt-[5px]">For shift alerts only. No spam.</div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 mt-6 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                )}
              </button>
            </form>

            <div className="text-center mt-4 text-[12px] text-[var(--muted)]">
              Already have an account?{" "}
              <a href="/login" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors">Log in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
