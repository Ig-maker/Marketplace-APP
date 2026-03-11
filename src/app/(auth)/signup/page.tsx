"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--off)]">
      {/* NAV */}
      <nav className="h-16 flex items-center justify-between px-10 max-sm:px-5 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] relative z-10 flex-shrink-0">
        <a href="https://shelvian.co" className="flex items-center gap-[5px] text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors w-20">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2L3 6.5 8 11" /></svg>
          Back
        </a>
        <a href="/" className="flex items-center gap-2 no-underline">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="#1A1A14" />
            <line x1="17" y1="8.5" x2="17" y2="25.5" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="8.5" y1="17" x2="25.5" y2="17" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="11" y1="11" x2="23" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="23" y1="11" x2="11" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          <span className="font-serif text-[19px] text-[#111] tracking-tight leading-none">Shelvian</span>
        </a>
        <Link href="/login" className="text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors w-20 text-right">
          Log in
        </Link>
      </nav>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-[1]">
        <h1
          className="font-serif text-[32px] max-sm:text-[26px] tracking-tight text-center text-[var(--dark)] mb-10"
          style={{ animation: "fadeUp 450ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          Join as a <em className="italic underline decoration-[var(--lime)] underline-offset-4">brand</em> or ambassador?
        </h1>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 w-full max-w-[640px] max-sm:max-w-[360px]">
          {/* Brand Card */}
          <Link
            href="/signup/brand"
            className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[12px] p-8 max-sm:p-7 no-underline flex flex-col gap-3 shadow-[var(--sh)] hover:-translate-y-[3px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.11)] hover:border-[var(--lime)] transition-all duration-[220ms] group"
            style={{ animation: "fadeUp 450ms 80ms cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div className="w-11 h-11 rounded-[10px] bg-[var(--lime)] flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="16" height="12" rx="2" />
                <path d="M6 5V4a2 2 0 014 0v1M10 11v2" />
                <circle cx="10" cy="10" r="1.5" />
              </svg>
            </div>
            <div className="font-serif text-[22px] text-[var(--dark)] leading-[1.2]">I&apos;m a brand</div>
            <div className="text-[13px] text-[var(--text2)] leading-[1.65] flex-1">
              Post shifts, find vetted ambassadors near your stores, and track events live &mdash; all from one dashboard.
            </div>
            <div className="flex items-center justify-between mt-2 pt-[18px] border-t border-[var(--border)] text-[13px] font-semibold text-[var(--muted)] group-hover:text-[var(--dark)] transition-colors">
              Get started
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-[3px] transition-transform duration-200"><path d="M3 7.5h9M8 3.5l4 4-4 4" /></svg>
            </div>
          </Link>

          {/* Ambassador Card */}
          <Link
            href="/signup/ambassador"
            className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[12px] p-8 max-sm:p-7 no-underline flex flex-col gap-3 shadow-[var(--sh)] hover:-translate-y-[3px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.11)] hover:border-[var(--dark)] transition-all duration-[220ms] group"
            style={{ animation: "fadeUp 450ms 160ms cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div className="w-11 h-11 rounded-[10px] bg-[var(--dark)] flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="7" r="3.5" />
                <path d="M3 18c0-4 3.1-6.5 7-6.5s7 2.5 7 6.5" />
              </svg>
            </div>
            <div className="font-serif text-[22px] text-[var(--dark)] leading-[1.2]">I&apos;m an ambassador</div>
            <div className="text-[13px] text-[var(--text2)] leading-[1.65] flex-1">
              Browse open shifts near you, pick your schedule, and get paid within 24 hours of every completed event.
            </div>
            <div className="flex items-center justify-between mt-2 pt-[18px] border-t border-[var(--border)] text-[13px] font-semibold text-[var(--muted)] group-hover:text-[var(--dark)] transition-colors">
              Get started
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-[3px] transition-transform duration-200"><path d="M3 7.5h9M8 3.5l4 4-4 4" /></svg>
            </div>
          </Link>
        </div>

        <p
          className="mt-7 text-[13px] text-[var(--muted)] text-center"
          style={{ animation: "fadeUp 450ms 160ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors">
            Log in
          </Link>
        </p>
      </main>

      {/* FOOTER */}
      <footer className="px-10 max-sm:px-5 py-[18px] border-t border-[var(--border)] flex items-center justify-between relative z-[1] flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">&copy; 2026 Shelvian</span>
        <div className="flex gap-5">
          <a href="#" className="text-[12px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">Privacy</a>
          <a href="#" className="text-[12px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">Terms</a>
          <a href="#" className="text-[12px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
