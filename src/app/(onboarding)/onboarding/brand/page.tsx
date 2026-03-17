"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | "success";

export default function BrandOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Form state — Step 1
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [pitch, setPitch] = useState("");
  const [retailer, setRetailer] = useState("");

  // Form state — Step 2
  const [cities, setCities] = useState("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user?.name || "");
          setUserEmail(data.user?.email || "");
          // Pre-fill brand name if it was saved during signup
          if (data.brandName) {
            setBrandName(data.brandName);
          }
        }
      } catch {
        // Silently fail — layout handles auth redirect
      }
    };
    fetchUser();
  }, []);

  const firstName = userName.split(" ")[0] || "there";
  const initial = userName.charAt(0).toUpperCase() || "?";

  const progressWidth =
    step === 1 ? "50%" : step === 2 ? "82%" : "100%";

  const toggleRequirement = (req: string) => {
    setRequirements((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const goStep = (n: Step) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goSuccess = () => {
    // TODO: Save onboarding data to backend
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--off)]">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 max-sm:px-5 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
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
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
          <div className="w-7 h-7 rounded-full bg-[var(--dark)] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {initial}
          </div>
          <span className="hidden sm:inline">{userEmail}</span>
        </div>
      </nav>

      {/* Top progress bar */}
      <div className="h-[2px] bg-[var(--border)] sticky top-[60px] z-[99]">
        <div
          className="h-full bg-[var(--lime)] transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>

      {/* PAGE */}
      <div className="min-h-[calc(100vh-62px)] flex items-start justify-center py-12 px-6 max-sm:px-4 max-sm:py-6 relative z-[1]">
        <div className="w-full max-w-[480px] bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[0_4px_32px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Card head — step indicators */}
          <div className="px-7 pt-6 max-sm:px-5 max-sm:pt-5">
            <div className="flex items-center gap-0 mb-5">
              {/* Step 1: Account (always done) */}
              <div className="flex items-center gap-[7px]">
                <StepDot status="done" number={1} />
                <span className="text-[12px] font-medium text-[#18A664] max-sm:hidden">Account</span>
              </div>
              <div className="flex-1 h-px bg-[var(--border)] mx-2 min-w-5" />
              {/* Step 2: Brand profile */}
              <div className="flex items-center gap-[7px]">
                <StepDot
                  status={step === 1 ? "active" : step === 2 || step === "success" ? "done" : "pending"}
                  number={2}
                />
                <span className={`text-[12px] font-medium max-sm:hidden ${
                  step === 1 ? "text-[var(--dark)] font-semibold" : step === 2 || step === "success" ? "text-[#18A664]" : "text-[var(--muted)]"
                }`}>Brand profile</span>
              </div>
              <div className="flex-1 h-px bg-[var(--border)] mx-2 min-w-5" />
              {/* Step 3: Preferences */}
              <div className="flex items-center gap-[7px]">
                <StepDot
                  status={step === 2 ? "active" : step === "success" ? "done" : "pending"}
                  number={3}
                />
                <span className={`text-[12px] font-medium max-sm:hidden ${
                  step === 2 ? "text-[var(--dark)] font-semibold" : step === "success" ? "text-[#18A664]" : "text-[var(--muted)]"
                }`}>Preferences</span>
              </div>
            </div>
            {/* Card progress bar */}
            <div className="h-[2px] bg-[var(--elevated)]">
              <div
                className="h-full bg-[var(--lime)] transition-all duration-[450ms]"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Card body */}
          <div className="px-7 py-7 max-sm:px-5 max-sm:py-5">
            {/* STEP 1: Brand Profile */}
            {step === 1 && (
              <div className="flex flex-col" style={{ animation: "fadeUp 280ms cubic-bezier(0.22,1,0.36,1) both" }}>
                <div className="font-serif text-2xl font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-[5px]">
                  About your <em className="italic underline decoration-[var(--lime)] underline-offset-4">brand</em>
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-6">
                  Ambassadors see this before every shift. Make it specific and honest.
                </p>

                <Field label="Brand / company name">
                  <input
                    type="text"
                    placeholder="e.g. Oatly USA, Goodles, Magic Spoon..."
                    autoComplete="organization"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="field-input"
                  />
                </Field>

                <Field label="Product category">
                  <SelectWrap>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="field-input cursor-pointer pr-9">
                      <option value="" disabled>Select a category</option>
                      <option>Food & Beverage</option>
                      <option>Health & Wellness</option>
                      <option>Beauty & Personal Care</option>
                      <option>Supplements & Vitamins</option>
                      <option>Pet Products</option>
                      <option>Household & Cleaning</option>
                      <option>Baby & Kids</option>
                      <option>Other</option>
                    </select>
                  </SelectWrap>
                </Field>

                <Field label="Brand pitch" hint="2-3 sentences">
                  <textarea
                    placeholder="We make plant-based oat milk for people who love great coffee. Our barista blend is in 400+ Whole Foods locations nationwide."
                    value={pitch}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) setPitch(e.target.value);
                    }}
                    className="field-input resize-none h-[82px] leading-relaxed"
                  />
                  <div className={`font-mono text-[10px] mt-1 text-right ${pitch.length > 260 ? "text-[#D97706]" : "text-[var(--muted)]"}`}>
                    {pitch.length} / 300
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-1 leading-relaxed">
                    What you make → who it&apos;s for → where to find it.
                  </div>
                </Field>

                <Field label="Primary retailer">
                  <SelectWrap>
                    <select value={retailer} onChange={(e) => setRetailer(e.target.value)} className="field-input cursor-pointer pr-9">
                      <option value="" disabled>Where are your demos happening?</option>
                      <option>Whole Foods Market</option>
                      <option>Sprouts Farmers Market</option>
                      <option>Kroger / Ralph&apos;s</option>
                      <option>Target</option>
                      <option>Costco</option>
                      <option>HEB</option>
                      <option>Publix</option>
                      <option>Safeway / Albertsons</option>
                      <option>Independent Natural Retailers</option>
                      <option>Multiple chains</option>
                    </select>
                  </SelectWrap>
                </Field>

                <button onClick={() => goStep(2)} className="btn-primary mt-[22px]">
                  Save & Continue
                  <ArrowIcon />
                </button>
              </div>
            )}

            {/* STEP 2: Preferences */}
            {step === 2 && (
              <div className="flex flex-col" style={{ animation: "fadeUp 280ms cubic-bezier(0.22,1,0.36,1) both" }}>
                <div className="font-serif text-2xl font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-[5px]">
                  Your <em className="italic underline decoration-[var(--lime)] underline-offset-4">preferences</em>
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-6">
                  Sets your default match criteria — fine-tunable per shift at any time.
                </p>

                <Field label="Cities needed">
                  <SelectWrap>
                    <select value={cities} onChange={(e) => setCities(e.target.value)} className="field-input cursor-pointer pr-9">
                      <option value="" disabled>How many markets?</option>
                      <option>1 city — just getting started</option>
                      <option>2–5 cities</option>
                      <option>6–10 cities</option>
                      <option>10+ cities (national)</option>
                    </select>
                  </SelectWrap>
                </Field>

                <Field label="Monthly shift budget">
                  <div className="grid grid-cols-2 gap-[7px]">
                    {[
                      { amt: "Under $1K", lbl: "Getting started" },
                      { amt: "$1K – $5K", lbl: "Growing brand" },
                      { amt: "$5K – $15K", lbl: "Scaling up" },
                      { amt: "$15K+", lbl: "National footprint" },
                    ].map((b) => (
                      <button
                        key={b.amt}
                        type="button"
                        onClick={() => setBudget(b.amt)}
                        className={`py-[11px] px-[13px] bg-[var(--elevated)] border-[1.5px] rounded-[var(--r)] cursor-pointer text-left transition-all font-sans ${
                          budget === b.amt
                            ? "border-[var(--dark)] bg-white"
                            : "border-[var(--border)] hover:border-[var(--border2)] hover:bg-white"
                        }`}
                      >
                        <div className={`font-mono text-[13px] font-medium ${budget === b.amt ? "text-[var(--dark)]" : "text-[var(--dark)]"}`}>
                          {b.amt}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5">{b.lbl}</div>
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-[7px] leading-relaxed">
                    Estimate only — you pay per completed shift, nothing upfront.
                  </div>
                </Field>

                <div className="mb-0">
                  <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[6px]">
                    Ambassador requirements
                    <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--muted)] italic">Optional</span>
                  </label>
                  <div className="h-2" />
                  <div className="flex flex-col gap-[7px]">
                    {[
                      { id: "food-handler", label: "Food handler certified", sub: "Required for food sampling in most states" },
                      { id: "bilingual", label: "Bilingual (Spanish / English)", sub: "For stores with large Spanish-speaking shoppers" },
                      { id: "wellness", label: "Natural & wellness experience", sub: "Familiar with CPG, health, and grocery audiences" },
                      { id: "veteran", label: "Veterans only (20+ shifts)", sub: "Top-rated ambassadors with a proven track record" },
                    ].map((opt) => {
                      const selected = requirements.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleRequirement(opt.id)}
                          className={`flex items-center gap-[11px] py-[11px] px-[13px] bg-[var(--elevated)] border-[1.5px] rounded-[var(--r)] cursor-pointer select-none transition-all text-left ${
                            selected
                              ? "border-[var(--dark)] bg-white"
                              : "border-[var(--border)] hover:border-[var(--border2)] hover:bg-white"
                          }`}
                        >
                          <div className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
                            selected
                              ? "bg-[var(--lime)] border-[var(--lime-dark)]"
                              : "bg-white border-[var(--border2)]"
                          }`}>
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}>
                              <path d="M1.5 4.5l2 2.5 4-4.5" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[13px] text-[var(--dark)] font-medium">{opt.label}</div>
                            <div className="text-[11px] text-[var(--muted)] mt-px">{opt.sub}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={goSuccess} className="btn-primary mt-[22px]">
                  Finish Setup
                  <ArrowIcon />
                </button>
                <button
                  onClick={() => goStep(1)}
                  className="w-full py-[11px] bg-transparent text-[var(--muted)] font-sans text-[13px] font-medium border-[1.5px] border-[var(--border)] rounded-[var(--r)] cursor-pointer mt-2 hover:border-[var(--border2)] hover:text-[var(--dark)] transition-all"
                >
                  ← Back to brand profile
                </button>
                <span
                  onClick={goSuccess}
                  className="block text-center mt-[13px] text-[12px] text-[var(--muted)] cursor-pointer hover:text-[var(--dark)] hover:underline"
                >
                  Skip for now — I&apos;ll set preferences later
                </span>
              </div>
            )}

            {/* SUCCESS */}
            {step === "success" && (
              <div className="flex flex-col items-center text-center py-3 pb-2" style={{ animation: "fadeUp 280ms cubic-bezier(0.22,1,0.36,1) both" }}>
                <div
                  className="w-16 h-16 rounded-full bg-[var(--lime)] flex items-center justify-center mb-5"
                  style={{ animation: "popIn 480ms cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <svg viewBox="0 0 34 34" fill="none" stroke="#111" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" width="30" height="30">
                    <path d="M7 17l7 7 13-13" />
                  </svg>
                </div>
                <div className="font-serif text-[28px] text-[var(--dark)] mb-[7px]">
                  You&apos;re all set, {firstName}.
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[280px] mb-[26px]">
                  Your brand profile is live. Post your first shift and get filled today.
                </p>

                <div className="flex flex-col gap-2 w-full mb-6">
                  {[
                    { n: "1", title: "Post your first shift", sub: "Pick a date, store, and pay rate — under 4 minutes" },
                    { n: "2", title: "Review ambassador matches", sub: "Best fits for your brand and location surfaced instantly" },
                    { n: "3", title: "Get live event photos", sub: "GPS check-in and full report per shift" },
                  ].map((item) => (
                    <div key={item.n} className="flex items-center gap-3 py-[13px] px-[14px] bg-[var(--elevated)] rounded-[var(--r)] text-left">
                      <div className="w-6 h-6 rounded-full bg-[var(--lime)] flex items-center justify-center font-mono text-[11px] font-medium text-[var(--dark)] flex-shrink-0">
                        {item.n}
                      </div>
                      <div>
                        <strong className="block text-[13px] font-semibold text-[var(--dark)] mb-px">{item.title}</strong>
                        <span className="text-[11px] text-[var(--muted)]">{item.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={goToDashboard}
                  className="w-full py-[13px] bg-[var(--dark)] text-white font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[#222] transition-colors"
                >
                  Go to Dashboard
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .field-input {
          width: 100%;
          background: var(--elevated);
          border: 1.5px solid var(--border);
          border-radius: var(--r);
          padding: 11px 13px;
          font-family: var(--f-body);
          font-size: 14px;
          color: var(--dark);
          outline: none;
          transition: border-color 160ms, background 160ms, box-shadow 160ms;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: var(--text3); }
        .field-input:focus {
          border-color: var(--dark);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(17,17,17,0.06);
        }
        .btn-primary {
          width: 100%;
          padding: 13px;
          background: var(--lime);
          color: var(--dark);
          font-family: var(--f-body);
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: var(--r);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .btn-primary:hover {
          background: var(--lime-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--lime-glow);
        }
        .btn-primary:hover svg {
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}

/* ── Shared sub-components ── */

function StepDot({ status, number }: { status: "pending" | "active" | "done"; number: number }) {
  if (status === "done") {
    return (
      <div className="w-6 h-6 rounded-full bg-[#18A664] border-[1.5px] border-[#18A664] flex items-center justify-center flex-shrink-0">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4l2.5 3L9 1" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 font-mono text-[10px] ${
      status === "active"
        ? "bg-[var(--dark)] text-white border-[var(--dark)]"
        : "border-[var(--border2)] text-[var(--muted)]"
    }`}>
      {number}
    </div>
  );
}

function Field({ label, hint, noMargin, children }: { label: string; hint?: string; noMargin?: boolean; children: React.ReactNode }) {
  return (
    <div className={noMargin ? "mb-0" : "mb-4"}>
      <label className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[6px]">
        {label}
        {hint && <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--muted)] italic">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--muted)]" />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
