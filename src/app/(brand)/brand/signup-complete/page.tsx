"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length >= 7) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return digits;
}

export default function BrandSignupCompletePage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      setError("Brand name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/brand-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          companyWebsite: website || undefined,
          phone: phone ? `+1 ${phone}` : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/brand/onboarding");
      } else {
        setError(data.error || "Failed to save. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
        <div className="w-[60px]" />
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
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

      {/* PROGRESS BAR */}
      <div className="h-[2px] bg-[var(--border)] sticky top-[60px] z-[99]">
        <div className="h-full bg-[var(--lime)] w-[66%] transition-[width] duration-500" />
      </div>

      {/* PAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-62px)]">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center sticky top-[62px] h-[calc(100vh-62px)] px-16 py-[72px]">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--dark)] bg-[var(--lime)] rounded-full px-3 py-1 w-fit mb-7">
            ● One more step
          </div>
          <h2 className="font-serif text-[42px] font-normal tracking-tight leading-[1.1] text-[var(--dark)] mb-[18px]">
            Tell us about<br />
            <em className="italic underline decoration-[var(--lime)] underline-offset-[5px]">your brand.</em>
          </h2>
          <p className="text-[15px] text-[var(--text2)] leading-[1.75] max-w-[360px] mb-11">
            This helps ambassadors instantly recognise your brand and builds trust before your first shift is posted.
          </p>

          <div className="flex flex-col gap-3 mb-12">
            {[
              { bold: "Brand profile", text: " — ambassadors see your logo and name on every shift" },
              { bold: "Instant matching", text: " — we surface shifts to ambassadors near your stores" },
              { bold: "Ready in minutes", text: " — complete setup and post your first shift today" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-[11px]">
                <div className="w-5 h-5 rounded-[5px] bg-[var(--lime)] flex-shrink-0 flex items-center justify-center mt-px">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5l2 2.5 4-4.5" />
                  </svg>
                </div>
                <span className="text-[14px] text-[var(--text2)] leading-[1.55]">
                  <strong className="text-[var(--dark)] font-semibold">{item.bold}</strong>{item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-7 pt-7 border-t border-[var(--border)]">
            {[
              { value: "2,471", label: "Ambassadors" },
              { value: "12", label: "Active cities" },
              { value: "94%", label: "Re-book rate" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-[20px] font-medium text-[var(--dark)] tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5 uppercase tracking-[0.07em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[var(--surface)] border-l border-[var(--border)] flex flex-col items-center py-14 px-12 max-lg:px-7 max-lg:py-10 overflow-y-auto">
          <div className="w-full max-w-[400px]" style={{ animation: "fadeUp 500ms cubic-bezier(0.22,1,0.36,1) both" }}>

            <div className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
              Step 2 of 2 — Brand details
            </div>
            <div className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-1.5">
              Your brand <em className="italic underline decoration-[var(--lime)] underline-offset-4">profile</em>
            </div>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-8">
              Quick details to set up your brand account. You can update these any time from settings.
            </p>

            {error && (
              <div className="bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-[var(--r)] px-4 py-3 mb-5 text-[13px] text-[#C0392B]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Brand name */}
              <div className="mb-[18px]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Brand name
                </label>
                <input
                  type="text"
                  placeholder="Oatly, Siete Foods…"
                  autoComplete="organization"
                  autoFocus
                  value={brandName}
                  onChange={(e) => { setBrandName(e.target.value); setError(""); }}
                  className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                />
                <div className="text-[11px] text-[var(--muted)] mt-[5px]">This is displayed to ambassadors on every shift.</div>
              </div>

              {/* Company website */}
              <div className="mb-[18px]">
                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Company website
                  <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--muted)] italic">Optional</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourbrand.com"
                  autoComplete="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                />
              </div>

              {/* Phone */}
              <div className="mb-[18px]">
                <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  Phone
                  <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--muted)] italic">Optional</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[14px] text-[var(--text3)] pointer-events-none select-none">
                    +1
                  </span>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 pl-11 pr-3.5 font-mono text-[14px] tracking-wide text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                  />
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-[5px]">For shift alerts only. No spam.</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 mt-6 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              >
                {loading ? "Saving…" : "Continue to Dashboard"}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                )}
              </button>
            </form>

            <p className="text-[11px] text-[var(--muted)] leading-[1.65] mt-5 text-center">
              By continuing you agree to our{" "}
              <a href="#" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)]">Terms of Use</a>
              {" "}and{" "}
              <a href="#" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
