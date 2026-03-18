import Link from "next/link";

export default function BrandSignupConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--off)]">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 h-[68px] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] border-b border-[var(--border)] z-[100]">
        <div className="max-w-[1400px] mx-auto px-16 max-sm:px-5 h-[68px] flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-[22px] font-normal text-[var(--dark)] no-underline tracking-tight">
            Shelvian
          </Link>
          <span className="text-[13px] text-[var(--muted)]">
            Questions?{" "}
            <a href="mailto:brands@shelvian.com" className="text-[var(--text2)] no-underline font-medium hover:text-[var(--dark)]">
              brands@shelvian.com
            </a>
          </span>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-6 py-[120px] max-sm:py-[100px] relative z-[1]">
        <div className="w-full max-w-[560px] flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className="w-[72px] h-[72px] rounded-full bg-[var(--lime)] flex items-center justify-center mb-7"
            style={{
              boxShadow: "0 0 0 8px rgba(203,236,69,0.15), 0 0 0 16px rgba(203,236,69,0.07)",
              animation: "iconPop 0.5s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <path d="M6 17L13 24L26 9" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Status tag */}
          <div
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#D97706] bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.2)] rounded-full py-1 px-3 mb-5"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D97706]"
              style={{ animation: "blink 2s ease-in-out infinite" }}
            />
            Application Under Review
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-[42px] max-sm:text-[32px] font-normal tracking-[-0.02em] leading-[1.1] text-[var(--dark)] mb-4"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}
          >
            Thank you for
            <br />
            signing <em className="italic underline decoration-[var(--lime)] underline-offset-[5px]">up!</em>
          </h1>

          {/* Body */}
          <p
            className="text-[15px] text-[var(--text2)] leading-[1.7] max-w-[440px] mx-auto mb-8"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
          >
            We&apos;ve received your application and our team is on it. Once approved, you&apos;ll get a personal access link straight to your inbox — sit tight, we&apos;ll be in touch{" "}
            <span className="font-mono font-medium text-[var(--dark)]">soon</span>.
          </p>

          {/* Steps card */}
          <div
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh)] p-6 max-sm:p-5 mb-7 text-left"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s both" }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text3)] mb-[18px]">
              What happens next
            </div>

            <div className="flex items-start gap-3.5 py-2.5 relative">
              <div className="w-7 h-7 rounded-full bg-[var(--lime)] text-[var(--dark)] border-2 border-[var(--lime-dark)] flex items-center justify-center font-serif text-[13px] flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[var(--dark)] leading-tight">Application submitted</div>
                <div className="text-[12px] text-[var(--muted)] mt-0.5 leading-snug">Your brand profile is in our queue</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-2.5 relative">
              <div className="w-7 h-7 rounded-full bg-[rgba(217,119,6,0.08)] text-[#D97706] border-2 border-[rgba(217,119,6,0.25)] flex items-center justify-center font-serif text-[13px] flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[var(--dark)] leading-tight">Team review</div>
                <div className="text-[12px] text-[var(--muted)] mt-0.5 leading-snug">We verify your brand details — typically within 1–2 days</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-2.5 relative">
              <div className="w-7 h-7 rounded-full bg-[var(--elevated)] text-[var(--text3)] border-2 border-[var(--border)] flex items-center justify-center font-serif text-[13px] flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="text-[13px] font-medium text-[var(--text3)] leading-tight">Access link sent to your email</div>
                <div className="text-[12px] text-[var(--muted)] mt-0.5 leading-snug">You&apos;ll get full access to your brand dashboard</div>
              </div>
            </div>
          </div>

          <div
            className="w-full h-px bg-[var(--border)] my-1 mb-7"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}
          />

          {/* CTA */}
          <Link
            href="/dashboard"
            className="w-full py-4 px-8 bg-[var(--lime)] text-[var(--dark)] font-sans text-[15px] font-semibold rounded-[var(--r)] flex items-center justify-center gap-2 no-underline transition-all duration-[180ms] hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)]"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="#111" strokeWidth="1.5" />
              <path d="M1 6h14" stroke="#111" strokeWidth="1.5" />
              <path d="M5 10h2M9 10h2" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            View Demo Dashboard
          </Link>

          {/* Note */}
          <p
            className="mt-4 text-[12px] text-[var(--text3)] leading-relaxed"
            style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.4s both" }}
          >
            The demo gives you a full preview of your brand dashboard with sample data.
            <br />
            Need help?{" "}
            <a href="mailto:brands@shelvian.com" className="text-[var(--text2)] underline underline-offset-2 hover:text-[var(--dark)]">
              Reach out to our team
            </a>{" "}
            anytime.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-[1] border-t border-[var(--border)] py-5 px-16 max-sm:px-5 flex items-center justify-between">
        <span className="font-serif text-base text-[var(--dark)]">Shelvian</span>
        <span className="text-[12px] text-[var(--text3)]">© 2025 Shelvian. All rights reserved.</span>
      </footer>
    </div>
  );
}
