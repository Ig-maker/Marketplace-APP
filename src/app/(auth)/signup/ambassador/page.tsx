"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";

type Step = 1 | 2 | 3 | 4;
type PinState = "idle" | "verifying" | "success" | "error";

const STEP_META: Record<Step, { eyebrow: string; title: string; sub: string; progress: string }> = {
  1: {
    eyebrow: "Step 1 of 3 — Verify your number",
    title: "Welcome to <em>Shelvian</em>",
    sub: "Enter your mobile number. We'll text you a 6-digit code to verify your identity — no password needed.",
    progress: "25%",
  },
  2: {
    eyebrow: "Step 2 of 3 — Verify your number",
    title: "Check your <em>messages</em>",
    sub: "We sent a 6-digit code to your phone. Enter it below to confirm your number.",
    progress: "55%",
  },
  3: {
    eyebrow: "Step 3 of 3 — Get the app",
    title: "Scan to <em>continue on mobile</em>",
    sub: "Scan this QR code with your phone camera to complete setup and claim your first shift.",
    progress: "85%",
  },
  4: {
    eyebrow: "Account created ✓",
    title: "You're <em>all set!</em>",
    sub: "Your ambassador account is live. Start claiming shifts right now.",
    progress: "100%",
  },
};

const FLAGS = [
  { flag: "🇺🇸", code: "+1" },
  { flag: "🇨🇦", code: "+1" },
  { flag: "🇲🇽", code: "+52" },
  { flag: "🇬🇧", code: "+44" },
  { flag: "🇦🇺", code: "+61" },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length >= 7) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return digits;
}

export default function AmbassadorSignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [flagIdx, setFlagIdx] = useState(0);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [pinState, setPinState] = useState<PinState>("idle");
  const [pinMessage, setPinMessage] = useState("Waiting for code…");
  const [resendSeconds, setResendSeconds] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [ambassadorId, setAmbassadorId] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [qrJoinUrl, setQrJoinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMeta = STEP_META[step];

  const goStep = useCallback((n: Step) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = () => {
    if (step > 1) goStep((step - 1) as Step);
    else window.history.back();
  };

  // ── Resend timer ──
  const startResendTimer = useCallback(() => {
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    setResendSeconds(30);
    setResendEnabled(false);
    resendTimerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(resendTimerRef.current!);
          setResendEnabled(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, []);

  // ── QR code drawing ──
  const drawLogoCenter = useCallback((ctx: CanvasRenderingContext2D) => {
    const cx = 100, cy = 100, r = 18;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#CBEC45";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    const d = 9;
    const dd = d * 0.7;
    ctx.beginPath(); ctx.moveTo(cx, cy - d); ctx.lineTo(cx, cy + d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - d, cy); ctx.lineTo(cx + d, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - dd, cy - dd); ctx.lineTo(cx + dd, cy + dd); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + dd, cy - dd); ctx.lineTo(cx - dd, cy + dd); ctx.stroke();
  }, []);

  const buildQR = useCallback(async () => {
    const token = "amb_" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const rawPhone = phone.replace(/\D/g, "");
    const name = encodeURIComponent(firstName || "");
    const url = `https://app.shelvian.co/join?token=${token}&phone=${rawPhone}&name=${name}`;
    setQrToken(token);
    setQrJoinUrl(url);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      await QRCode.toCanvas(canvas, url, {
        width: 200,
        margin: 1,
        color: { dark: "#111111", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      drawLogoCenter(ctx);
    } catch {
      // fallback: draw placeholder pattern
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = "#111";
      ctx.fillRect(10, 10, 60, 60);
      ctx.fillStyle = "#fff";
      ctx.fillRect(18, 18, 44, 44);
      ctx.fillStyle = "#111";
      ctx.fillRect(26, 26, 28, 28);
      drawLogoCenter(ctx);
    }
  }, [phone, firstName, drawLogoCenter]);

  // ── Step transitions ──
  useEffect(() => {
    if (step === 2) {
      startResendTimer();
      setPin(["", "", "", "", "", ""]);
      setPinState("idle");
      setPinMessage("Waiting for code…");
      setTimeout(() => pinRefs.current[0]?.focus(), 150);
    }
    if (step === 3) {
      buildQR();
    }
    if (step === 4) {
      setAmbassadorId("AMB-" + Math.floor(1000 + Math.random() * 9000));
    }
  }, [step, startResendTimer, buildQR]);

  // ── Send OTP ──
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter your mobile number");
      phoneInputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${FLAGS[flagIdx].code} ${phone}` }),
      });
      const data = await res.json();
      if (data.success) {
        goStep(2);
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP verify ──
  const handleVerifyOtp = useCallback(async (code: string) => {
    setPinState("verifying");
    setPinMessage("Verifying…");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `${FLAGS[flagIdx].code} ${phone}`,
          code,
          name: `${firstName} ${lastName}`.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPinState("success");
        setPinMessage("Phone verified!");
        setTimeout(() => goStep(3), 750);
      } else {
        setPinState("error");
        setPinMessage("Incorrect code — please try again");
        setTimeout(() => {
          setPin(["", "", "", "", "", ""]);
          setPinState("idle");
          setPinMessage("Waiting for code…");
          pinRefs.current[0]?.focus();
        }, 1000);
      }
    } catch {
      setPinState("error");
      setPinMessage("Network error. Please try again.");
      setTimeout(() => {
        setPin(["", "", "", "", "", ""]);
        setPinState("idle");
        setPinMessage("Waiting for code…");
      }, 1000);
    }
  }, [phone, firstName, lastName, flagIdx, goStep]);

  // ── PIN input handling ──
  const handlePinInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    if (digit) {
      if (index < 5) {
        pinRefs.current[index + 1]?.focus();
      } else {
        const code = newPin.join("");
        if (code.length === 6) handleVerifyOtp(code);
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newPin = ["", "", "", "", "", ""];
    text.split("").forEach((ch, i) => { newPin[i] = ch; });
    setPin(newPin);
    if (text.length === 6) {
      handleVerifyOtp(text);
    } else if (text.length > 0) {
      pinRefs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const handleResend = async () => {
    setPin(["", "", "", "", "", ""]);
    setPinState("verifying");
    setPinMessage("New code sent!");
    startResendTimer();
    pinRefs.current[0]?.focus();
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${FLAGS[flagIdx].code} ${phone}` }),
      });
    } catch { /* ignore */ }
    setTimeout(() => { setPinState("idle"); setPinMessage("Waiting for code…"); }, 2000);
  };

  // ── QR Download ──
  const handleDownloadQR = () => {
    const source = canvasRef.current;
    if (!source) return;
    const out = document.createElement("canvas");
    out.width = 280;
    out.height = 320;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F5F5F0";
    ctx.fillRect(0, 0, 280, 320);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    const r = 14, x = 16, y = 16, w = 248, h = 288;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.drawImage(source, 40, 36, 200, 200);
    ctx.fillStyle = "#111";
    ctx.font = "600 13px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Shelvian", 140, 260);
    ctx.fillStyle = "#999994";
    ctx.font = "11px DM Mono, monospace";
    ctx.fillText("app.shelvian.co/join", 140, 280);

    const link = document.createElement("a");
    link.download = "shelvian-ambassador-qr.png";
    link.href = out.toDataURL("image/png");
    link.click();
  };

  const handleCopyLink = async () => {
    const url = qrJoinUrl || `https://app.shelvian.co/join?token=${qrToken || "demo"}&phone=${phone.replace(/\D/g, "")}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch { /* ignore */ }
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  // ── Pin box class ──
  const pinBoxClass = (i: number) => {
    const base = "w-[54px] h-[62px] bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] font-mono text-[28px] font-medium text-[var(--dark)] text-center outline-none transition-all duration-200 caret-transparent focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] focus:scale-105";
    if (pinState === "error") return `${base} !border-[#C0392B] !bg-[rgba(192,57,43,0.04)] !shadow-[0_0_0_4px_rgba(192,57,43,0.08)] animate-[shake_300ms_var(--ease)]`;
    if (pinState === "success") return `${base} !border-[var(--green)] !bg-[rgba(24,166,100,0.10)] !shadow-[0_0_0_4px_rgba(24,166,100,0.1)]`;
    if (pin[i]) return `${base} border-[var(--border2)] bg-white`;
    return base;
  };

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="h-[60px] flex items-center justify-between px-10 border-b border-[var(--border)] bg-[rgba(245,245,240,0.97)] backdrop-blur-[12px] sticky top-0 z-[100]">
        <button
          onClick={handleBack}
          className="flex items-center gap-[5px] text-[13px] text-[var(--muted)] bg-transparent border-none font-sans cursor-pointer hover:text-[var(--dark)] transition-colors p-0"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L3 6.5 8 11" />
          </svg>
          Back
        </button>
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
        <a href="/login" className="text-[13px] text-[var(--muted)] no-underline hover:text-[var(--dark)] transition-colors">Log in</a>
      </nav>

      {/* PROGRESS BAR */}
      <div className="h-[2px] bg-[var(--border)] sticky top-[60px] z-[99]">
        <div
          className="h-full bg-[var(--lime)] transition-[width] duration-500"
          style={{ width: currentMeta.progress }}
        />
      </div>

      {/* PAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] min-h-[calc(100vh-62px)] relative z-[1]">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center sticky top-[62px] h-[calc(100vh-62px)] px-16 py-[72px]">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--dark)] bg-[var(--lime)] rounded-full px-3 py-1 w-fit mb-7">
            ● For ambassadors
          </div>
          <h2 className="font-serif text-[42px] font-normal tracking-tight leading-[1.1] text-[var(--dark)] mb-[18px]">
            Pick shifts.<br />Show up.<br />
            <em className="italic underline decoration-[var(--lime)] underline-offset-[5px]">Get paid.</em>
          </h2>
          <p className="text-[15px] text-[var(--text2)] leading-[1.75] max-w-[360px] mb-11">
            Shelvian connects you with vetted CPG brands for in-store demo shifts &mdash; flexible schedule, fast pay, zero paperwork.
          </p>

          <div className="flex flex-col gap-3 mb-12">
            {[
              { bold: "$28–$45/hr", text: " — competitive pay with same-day bonuses" },
              { bold: "24-hour payout", text: " — direct deposit after every completed shift" },
              { bold: "You set your schedule", text: " — claim shifts that fit your life" },
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
              { value: "150+", label: "Brand partners" },
              { value: "12", label: "Active cities" },
              { value: "4.9★", label: "Avg rating" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-mono text-[20px] font-medium text-[var(--dark)] tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5 uppercase tracking-[0.07em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[var(--surface)] border-l border-[var(--border)] lg:border-l flex flex-col py-14 px-16 max-lg:px-7 max-lg:py-10">
          <div className="w-full max-w-[520px]">

            {/* Step header */}
            <div className="font-mono text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
              {currentMeta.eyebrow}
            </div>
            <div
              className="font-serif text-[28px] font-normal tracking-tight text-[var(--dark)] leading-[1.2] mb-1.5"
              dangerouslySetInnerHTML={{
                __html: currentMeta.title.replace(/<em>/g, '<em class="italic underline decoration-[var(--lime)] underline-offset-[4px]">'),
              }}
            />
            <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-8">
              {currentMeta.sub}
            </p>

            {/* ══ STEP 1 — Phone ══ */}
            {step === 1 && (
              <div style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}>
                {error && (
                  <div className="bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-[var(--r)] px-4 py-3 mb-5 text-[13px] text-[#C0392B]">
                    {error}
                  </div>
                )}

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3 mb-[18px]">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="Maya"
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
                      placeholder="Rodriguez"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setError(""); }}
                      className="w-full bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[14px] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] transition-all placeholder:text-[var(--text3)]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-[18px]">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                    Mobile number
                  </label>
                  <div className="flex">
                    {/* Flag prefix */}
                    <button
                      type="button"
                      onClick={() => setFlagIdx((i) => (i + 1) % FLAGS.length)}
                      title="Change country"
                      className="flex items-center gap-[7px] bg-[var(--elevated)] border-[1.5px] border-[var(--border)] border-r-0 rounded-l-[var(--r)] px-3.5 py-3 font-mono text-[14px] text-[var(--dark)] whitespace-nowrap flex-shrink-0 cursor-pointer hover:bg-[#e8e8e3] transition-colors select-none"
                    >
                      <span className="text-[17px] leading-none">{FLAGS[flagIdx].flag}</span>
                      <span className="text-[13px] text-[var(--text2)]">{FLAGS[flagIdx].code}</span>
                      <span className="text-[9px] text-[var(--muted)]">▾</span>
                    </button>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      className="flex-1 bg-[var(--elevated)] border-[1.5px] border-[var(--border)] border-l-0 rounded-r-[var(--r)] py-3 px-3.5 font-mono text-[16px] tracking-[0.04em] text-[var(--dark)] outline-none focus:border-[var(--dark)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,17,17,0.06)] focus:relative focus:z-[1] transition-all placeholder:text-[var(--text3)]"
                    />
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-[5px] leading-snug">
                    We&apos;ll send a 6-digit verification code via SMS. Standard rates may apply.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 mt-6 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all disabled:bg-[var(--elevated)] disabled:text-[var(--text3)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                >
                  {loading ? "Sending…" : "Send Code"}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  )}
                </button>

                <div className="flex items-center gap-3 my-5 mt-5">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-[11px] text-[var(--muted)]">already have an account?</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                <div className="text-center text-[12px] text-[var(--muted)]">
                  <a href="/login" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)] transition-colors">
                    Log in with your phone →
                  </a>
                </div>

                <p className="text-[11px] text-[var(--muted)] leading-[1.65] mt-3.5 text-center">
                  By continuing you agree to our{" "}
                  <a href="#" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)]">Terms of Use</a>
                  {" "}and{" "}
                  <a href="#" className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] hover:border-[var(--dark)]">Privacy Policy</a>.
                </p>
              </div>
            )}

            {/* ══ STEP 2 — OTP ══ */}
            {step === 2 && (
              <div style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}>
                {/* Phone display */}
                <div className="flex items-center gap-2.5 bg-[var(--elevated)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] px-3.5 py-3 mb-5">
                  <svg className="text-[var(--muted)] flex-shrink-0" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="1" width="8" height="14" rx="2" />
                    <circle cx="8" cy="12.5" r="0.6" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-[15px] text-[var(--dark)] flex-1 tracking-[0.03em]">
                    {FLAGS[flagIdx].code} {phone}
                  </span>
                  <button
                    onClick={() => goStep(1)}
                    className="text-[12px] font-semibold text-[var(--muted)] bg-transparent border-none border-b border-[var(--border)] cursor-pointer hover:text-[var(--dark)] hover:border-[var(--dark)] transition-all font-sans p-0"
                  >
                    Edit
                  </button>
                </div>

                {/* PIN label */}
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-[7px]">
                  6-digit verification code
                </label>

                {/* PIN boxes */}
                <div className="flex gap-2.5">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { pinRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinInput(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      onPaste={i === 0 ? handlePinPaste : undefined}
                      disabled={pinState === "verifying" || pinState === "success"}
                      className={pinBoxClass(i)}
                    />
                  ))}
                </div>

                {/* PIN status */}
                <div className={`flex items-center gap-2 text-[12px] mt-3 min-h-[18px] ${
                  pinState === "verifying" ? "text-[var(--dark)]" :
                  pinState === "success" ? "text-[var(--green)]" :
                  pinState === "error" ? "text-[#C0392B]" : "text-[var(--muted)]"
                }`}>
                  <div className={`w-[7px] h-[7px] rounded-full flex-shrink-0 transition-colors ${
                    pinState === "verifying" ? "bg-[var(--lime-dark)] animate-[blink_1s_infinite]" :
                    pinState === "success" ? "bg-[var(--green)]" :
                    pinState === "error" ? "bg-[#C0392B]" : "bg-[var(--border2)]"
                  }`} />
                  <span className={pinState === "verifying" || pinState === "success" || pinState === "error" ? "font-semibold" : ""}>
                    {pinMessage}
                  </span>
                </div>

                {/* Resend row */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handleResend}
                    disabled={!resendEnabled}
                    className="text-[12px] font-semibold text-[var(--dark)] bg-transparent border-none border-b border-[var(--border)] cursor-pointer hover:border-[var(--dark)] transition-colors font-sans p-0 disabled:text-[var(--muted)] disabled:cursor-default disabled:border-transparent"
                  >
                    Resend code
                  </button>
                  {!resendEnabled && (
                    <span className="font-mono text-[11px] text-[var(--muted)]">
                      Resend in 0:{String(resendSeconds).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Demo hint */}
                <div className="mt-5 bg-[rgba(203,236,69,0.12)] border border-[rgba(203,236,69,0.45)] rounded-[var(--r)] px-3.5 py-2.5 flex items-center gap-2.5">
                  <span className="text-[16px]">💡</span>
                  <p className="text-[12px] text-[var(--text2)] leading-snug">
                    Demo only: enter <strong className="font-mono text-[var(--dark)]">123456</strong> to continue
                  </p>
                </div>

                <div className="text-center mt-5 text-[12px] text-[var(--muted)]">
                  <button
                    onClick={() => goStep(1)}
                    className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] bg-transparent border-none cursor-pointer font-sans text-[12px] hover:border-[var(--dark)] transition-colors p-0"
                  >
                    ← Use a different number
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 3 — QR Code ══ */}
            {step === 3 && (
              <div style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}>
                {/* QR Card */}
                <div className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[16px] px-7 py-7 flex flex-col items-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-4">
                  {/* Badge */}
                  <div className="flex flex-col items-center gap-1.5 mb-5 w-full">
                    <div className="inline-flex items-center gap-[7px] font-mono text-[10px] font-medium uppercase tracking-[0.10em] text-[var(--dark)] bg-[var(--lime)] rounded-full px-3 py-1">
                      <span className="w-[6px] h-[6px] rounded-full bg-[var(--dark)] animate-[blink_2s_infinite]" />
                      Continue on mobile
                    </div>
                    <p className="text-[13px] text-[var(--muted)]">Scan with your phone camera</p>
                  </div>

                  {/* QR frame */}
                  <div className="relative p-4 bg-white rounded-[12px] border border-[var(--border)] mb-[18px]">
                    {/* Corner accents */}
                    <div className="absolute top-[-1px] left-[-1px] w-[18px] h-[18px] border-t-[3px] border-l-[3px] border-[var(--dark)] rounded-tl-[4px]" />
                    <div className="absolute top-[-1px] right-[-1px] w-[18px] h-[18px] border-t-[3px] border-r-[3px] border-[var(--dark)] rounded-tr-[4px]" />
                    <div className="absolute bottom-[-1px] left-[-1px] w-[18px] h-[18px] border-b-[3px] border-l-[3px] border-[var(--dark)] rounded-bl-[4px]" />
                    <div className="absolute bottom-[-1px] right-[-1px] w-[18px] h-[18px] border-b-[3px] border-r-[3px] border-[var(--dark)] rounded-br-[4px]" />
                    <canvas ref={canvasRef} width={200} height={200} className="block rounded-[4px]" />
                  </div>

                  {/* URL chip */}
                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--muted)] bg-[var(--elevated)] border border-[var(--border)] rounded-full px-3 py-[5px] max-w-full overflow-hidden">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 6H6a4 4 0 000 8h1M6 10h4a4 4 0 000-8H9" />
                    </svg>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {qrToken ? `app.shelvian.co/join?token=${qrToken}` : "app.shelvian.co/join/…"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center gap-[7px] py-[11px] px-3.5 bg-[var(--dark)] text-white border-[1.5px] border-[var(--dark)] rounded-[var(--r)] font-sans text-[13px] font-semibold cursor-pointer hover:bg-[#222] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 2v8M5 7l3 3 3-3" /><path d="M3 13h10" />
                    </svg>
                    Download QR Code
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center gap-[7px] py-[11px] px-3.5 rounded-[var(--r)] font-sans text-[13px] font-semibold cursor-pointer border-[1.5px] transition-all ${
                      copyState === "copied"
                        ? "bg-[rgba(24,166,100,0.10)] border-[rgba(24,166,100,0.3)] text-[var(--green)]"
                        : "bg-[var(--surface)] text-[var(--dark)] border-[var(--border)] hover:border-[var(--border2)] hover:bg-[var(--elevated)]"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="5" width="9" height="9" rx="2" /><path d="M3 11V3a2 2 0 012-2h8" />
                    </svg>
                    {copyState === "copied" ? "Copied!" : "Copy Link"}
                  </button>
                </div>

                {/* Or divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-[11px] text-[var(--muted)]">or complete signup on desktop</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                <button
                  onClick={() => goStep(4)}
                  className="w-full py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all"
                >
                  Continue on Desktop
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>

                <div className="text-center mt-4 text-[12px] text-[var(--muted)]">
                  <button
                    onClick={() => goStep(2)}
                    className="text-[var(--dark)] font-semibold no-underline border-b border-[var(--border)] bg-transparent border-none cursor-pointer font-sans text-[12px] hover:border-[var(--dark)] transition-colors p-0"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 4 — Success ══ */}
            {step === 4 && (
              <div style={{ animation: "fadeUp 400ms cubic-bezier(0.22,1,0.36,1) both" }}>
                <div className="text-center py-2">
                  {/* Success icon */}
                  <div className="w-[72px] h-[72px] bg-[var(--lime)] rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#111" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 16l7 7 13-13" />
                    </svg>
                  </div>

                  <div className="font-serif text-[30px] text-[var(--dark)] mb-2">
                    You&apos;re in, <span>{firstName || "Ambassador"}</span>!
                  </div>
                  <p className="text-[14px] text-[var(--text2)] leading-[1.75] mb-6 max-w-[400px] mx-auto">
                    Your ambassador account is live. Head to your dashboard to complete your profile and start claiming shifts in your city.
                  </p>

                  {/* Ambassador ID */}
                  <div className="font-mono text-[11px] text-[var(--muted)] bg-[var(--elevated)] border border-[var(--border)] rounded-[var(--r)] px-3.5 py-2 inline-block mb-6">
                    Ambassador ID: {ambassadorId}
                  </div>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full max-w-[340px] mx-auto py-3.5 bg-[var(--lime)] text-[var(--dark)] font-sans text-[14px] font-bold border-none rounded-[var(--r)] cursor-pointer flex items-center justify-center gap-2 hover:bg-[var(--lime-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--lime-glow)] transition-all"
                  >
                    Go to Dashboard
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
