"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/lib/constants";

type Role = "brand" | "ambassador";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("ambassador");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(DEFAULT_REDIRECT);
      } else {
        setError(data.error || "Signup failed");
      }
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
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h1 className="font-serif text-5xl font-normal tracking-tight leading-[1.08] text-white mb-5">
            Join the<br /><em className="not-italic text-[var(--lime)]">marketplace</em>.
          </h1>
          <p className="text-[15px] text-white/45 leading-relaxed max-w-[380px]">
            Whether you&apos;re a CPG brand looking to scale in-store demos, or an ambassador ready to earn — Shelvian connects you.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 border-t border-white/[0.08] pt-7">
          <div>
            <div className="font-serif text-[28px] text-white leading-none mb-1"><span className="text-[var(--lime)]">12K</span>+</div>
            <div className="text-[12px] text-white/35 leading-snug">Active<br />ambassadors</div>
          </div>
          <div>
            <div className="font-serif text-[28px] text-white leading-none mb-1"><span className="text-[var(--lime)]">500</span>+</div>
            <div className="text-[12px] text-white/35 leading-snug">CPG brands<br />on platform</div>
          </div>
          <div>
            <div className="font-serif text-[28px] text-white leading-none mb-1"><span className="text-[var(--lime)]">97</span>%</div>
            <div className="text-[12px] text-white/35 leading-snug">Shift fill<br />rate</div>
          </div>
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

          {error && (
            <div className="bg-[rgba(192,57,43,0.08)] border border-[var(--red)]/20 rounded-[var(--r)] px-4 py-3 mb-4 text-[13px] text-[var(--red)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="font-serif text-[32px] font-normal tracking-tight text-[var(--dark)] mb-1.5 leading-[1.15]">
              Create your account.
            </div>
            <p className="text-[14px] text-[var(--text3)] mb-7 leading-normal">
              {role === "brand"
                ? "Set up your brand dashboard to start posting shifts and managing ambassadors."
                : "Join 12,000+ ambassadors earning $260/shift on average with CPG brands."}
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
                {role === "brand" ? "Company Name" : "Full Name"}
              </label>
              <input
                type="text"
                placeholder={role === "brand" ? "Acme Foods" : "Jane Smith"}
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                {role === "brand" ? "Work Email" : "Email"}
              </label>
              <input
                type="email"
                placeholder={role === "brand" ? "you@brand.com" : "jane@example.com"}
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[var(--text3)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full border-none rounded-[var(--r)] py-[13px] px-5 font-sans text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 mt-1 transition-all disabled:opacity-50 ${
                role === "ambassador"
                  ? "bg-[var(--lime)] text-[#111] hover:bg-[var(--lime-dark)] hover:shadow-[0_6px_20px_var(--lime-glow)]"
                  : "bg-[var(--dark)] text-white hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </button>

            <p className="text-center text-[13px] text-[var(--text3)] mt-6">
              Already have an account? <a href="/login" className="text-[var(--text)] font-semibold no-underline hover:underline">Log in &rarr;</a>
            </p>
            <p className="text-[11px] text-[var(--text3)] text-center leading-relaxed mt-4">
              By continuing you agree to our <a href="#" className="text-[var(--text3)] underline">Terms of Use</a> and <a href="#" className="text-[var(--text3)] underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
