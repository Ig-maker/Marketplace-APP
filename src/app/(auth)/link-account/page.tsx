"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LINK_DATA_KEY = "shelvian_link_data";

interface LinkData {
  email: string;
  googleSupabaseUserId: string;
  fullName: string;
  avatarUrl?: string;
}

type PageState = "form" | "success" | "missing";

export default function LinkAccountPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("form");
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LINK_DATA_KEY);
    if (!raw) {
      setPageState("missing");
      return;
    }
    try {
      const data = JSON.parse(raw) as LinkData;
      if (!data.email || !data.googleSupabaseUserId) {
        setPageState("missing");
        return;
      }
      setLinkData(data);
    } catch {
      setPageState("missing");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (!linkData) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/link-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: linkData.email,
          password,
          googleSupabaseUserId: linkData.googleSupabaseUserId,
          fullName: linkData.fullName,
          avatarUrl: linkData.avatarUrl,
        }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.removeItem(LINK_DATA_KEY);
        setPageState("success");
        setTimeout(() => {
          router.push(data.profileCompleted ? "/dashboard" : "/brand/onboarding");
        }, 2000);
      } else {
        setError(data.error || "Verification failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(LINK_DATA_KEY);
    router.push("/login");
  };

  // Mask email: j***@brand.com
  const maskedEmail = linkData?.email
    ? linkData.email.replace(/^(.)(.*)(@.*)$/, (_, first, middle, domain) =>
        `${first}${"•".repeat(Math.min(middle.length, 6))}${domain}`
      )
    : "";

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
            Link your<br />accounts <em className="not-italic text-[var(--lime)]">securely</em>.
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed max-w-[380px] mb-10">
            For your security, we need to confirm your identity before connecting your Google account. This keeps your data safe.
          </p>

          <div className="flex flex-col gap-2 max-w-[400px]">
            {[
              { step: "1", text: "You signed up with email & password" },
              { step: "2", text: "Now you're signing in with Google" },
              { step: "3", text: "Confirm your password to link both" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/[0.06] border border-white/[0.09] rounded-[10px] px-4 py-3 flex items-center gap-3 backdrop-blur-sm"
                style={{ animation: `slideIn 400ms ${100 + i * 100}ms cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center bg-[var(--lime)] font-mono text-[13px] font-bold text-[#111]">
                  {item.step}
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

          {/* MISSING DATA */}
          {pageState === "missing" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(192,57,43,0.1)] rounded-[16px] flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="var(--red, #C0392B)" strokeWidth="2" />
                  <path d="M14 9v6M14 18v1" stroke="var(--red, #C0392B)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] mb-2 leading-[1.15]">
                Session expired.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-8 leading-relaxed">
                The account linking session has expired. Please try signing in with Google again.
              </p>
              <Link
                href="/login"
                className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 no-underline hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M7 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to Login
              </Link>
            </div>
          )}

          {/* PASSWORD FORM */}
          {pageState === "form" && linkData && (
            <div>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text3)] no-underline mb-6 cursor-pointer bg-transparent border-none p-0 hover:text-[var(--text)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to Login
              </button>

              {/* Google identity badge */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--elevated)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {linkData.avatarUrl ? (
                    <img src={linkData.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--text)] truncate">
                    {linkData.fullName || "Google Account"}
                  </div>
                  <div className="text-[12px] text-[var(--text3)] truncate">
                    {maskedEmail}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                </div>
              </div>

              <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
                Confirm your identity.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-7 leading-relaxed">
                Looks like you already signed up with email and password. Please confirm it&apos;s you to continue with Google.
              </p>

              {error && (
                <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-[var(--text3)]">
                      The password you used to sign up
                    </span>
                    <a href="/forgot-password" className="text-[12px] text-[var(--text3)] no-underline hover:text-[var(--text)] transition-colors">
                      Forgot?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--dark)] text-white border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Link Google"}
                  {!loading && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-transparent border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-[11px] px-5 font-sans text-[14px] font-semibold text-[var(--text)] cursor-pointer flex items-center justify-center gap-2 hover:border-[var(--border2)] hover:bg-[var(--surface)] transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M7 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Use Email &amp; Password Instead
                </button>
              </div>
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
                Account linked.
              </div>
              <p className="text-[14px] text-[var(--text3)] mb-6 leading-relaxed">
                Your Google account has been successfully linked. You can now sign in with either method.
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] px-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="var(--text3)" strokeWidth="1.3" />
                    <path d="M1 6l7 4.5L15 6" stroke="var(--text3)" strokeWidth="1.3" />
                  </svg>
                  <span className="text-[12px] text-[var(--text3)]">Email</span>
                </div>
                <div className="text-[var(--lime)] font-mono text-[16px]">+</div>
                <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r)] px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                  <span className="text-[12px] text-[var(--text3)]">Google</span>
                </div>
              </div>

              <p className="text-[13px] text-[var(--text3)]">
                Redirecting to your dashboard…
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
