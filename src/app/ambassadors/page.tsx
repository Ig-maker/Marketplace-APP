"use client";

import { useState } from "react";
import Link from "next/link";
import { AppDownloadQRModal } from "@/components/app-download-qr-modal";

export default function AmbassadorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--off)]">
      {/* NAV */}
      <nav className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] px-10 max-sm:px-5 backdrop-blur-[12px] relative z-10 flex-shrink-0">
        <a href="https://shelvian.co" className="flex items-center gap-[5px] text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors w-20">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L3 6.5 8 11" />
          </svg>
          Back
        </a>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="#1A1A14" />
            <line x1="17" y1="8.5" x2="17" y2="25.5" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="8.5" y1="17" x2="25.5" y2="17" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="11" y1="11" x2="23" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="23" y1="11" x2="11" y2="23" stroke="#CBEC45" strokeWidth="2.3" strokeLinecap="round" />
          </svg>
          <span className="font-serif text-[19px] text-[#111] tracking-tight leading-none">Shelvian</span>
        </Link>
        <Link href="/login" className="text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors w-20 text-right">
          Log in
        </Link>
      </nav>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-[1]">
        <div className="w-full max-w-[560px] text-center" style={{ animation: "fadeUp 450ms cubic-bezier(0.22,1,0.36,1) both" }}>
          <div className="inline-flex items-center gap-[7px] font-mono text-[10px] font-medium uppercase tracking-[0.10em] text-[var(--dark)] bg-[var(--lime)] rounded-full px-3 py-1 mb-6">
            ● For ambassadors
          </div>

          <h1 className="font-serif text-[36px] max-sm:text-[28px] tracking-tight text-[var(--dark)] mb-5">
            Browse shifts. Pick your schedule. <em className="italic underline decoration-[var(--lime)] underline-offset-4">Get paid.</em>
          </h1>

          <p className="text-[15px] text-[var(--text2)] leading-[1.75] mb-10 max-w-[440px] mx-auto">
            Join thousands of ambassadors who earn within 24 hours of every completed event. No resume needed — just sign up and start claiming shifts near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Link
              href="/signup/ambassador"
              className="w-full sm:w-auto py-3.5 px-8 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 no-underline hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all"
            >
              Sign up as ambassador
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-8 bg-[var(--dark)] text-white font-sans text-[14px] font-bold border-[1.5px] border-[var(--dark)] rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v8M5 7l3 3 3-3" />
                <path d="M3 13h10" />
              </svg>
              Download the App
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[13px] text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[var(--lime)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </div>
              <span>Flexible hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[var(--lime)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </div>
              <span>Fast payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[var(--lime)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </div>
              <span>Shifts near you</span>
            </div>
          </div>
        </div>
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

      <AppDownloadQRModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
