"use client";

import { useCallback, useEffect, useRef } from "react";
import QRCode from "qrcode";

const APP_JOIN_URL = "https://app.shelvian.co/join";

function drawLogoCenter(ctx: CanvasRenderingContext2D) {
  const cx = 100;
  const cy = 100;
  const r = 18;
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
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.lineTo(cx, cy + d);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - d, cy);
  ctx.lineTo(cx + d, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - dd, cy - dd);
  ctx.lineTo(cx + dd, cy + dd);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + dd, cy - dd);
  ctx.lineTo(cx - dd, cy + dd);
  ctx.stroke();
}

type AppDownloadQRModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppDownloadQRModal({ isOpen, onClose }: AppDownloadQRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const buildQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      await QRCode.toCanvas(canvas, APP_JOIN_URL, {
        width: 200,
        margin: 1,
        color: { dark: "#111111", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      drawLogoCenter(ctx);
    } catch {
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      buildQR();
    }
  }, [isOpen, buildQR]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(17,17,17,0.5)] backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[400px] bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[var(--r-lg)] shadow-[0_24px_64px_rgba(0,0,0,0.2)] overflow-hidden"
        style={{ animation: "fadeUp 300ms cubic-bezier(0.22,1,0.36,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--dark)] hover:bg-[var(--border)] transition-colors"
          aria-label="Close modal"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
        </button>

        <div className="px-8 pt-8 pb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 id="modal-title" className="font-serif text-[24px] text-[var(--dark)] mb-1">
              Download the <em className="italic underline decoration-[var(--lime)] underline-offset-3">App</em>
            </h2>
            <p className="text-[13px] text-[var(--muted)]">
              Scan with your phone camera to get the Shelvian app
            </p>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative p-4 bg-white rounded-[12px] border border-[var(--border)]">
              <div className="absolute top-[-1px] left-[-1px] w-[18px] h-[18px] border-t-[3px] border-l-[3px] border-[var(--dark)] rounded-tl-[4px]" />
              <div className="absolute top-[-1px] right-[-1px] w-[18px] h-[18px] border-t-[3px] border-r-[3px] border-[var(--dark)] rounded-tr-[4px]" />
              <div className="absolute bottom-[-1px] left-[-1px] w-[18px] h-[18px] border-b-[3px] border-l-[3px] border-[var(--dark)] rounded-bl-[4px]" />
              <div className="absolute bottom-[-1px] right-[-1px] w-[18px] h-[18px] border-b-[3px] border-r-[3px] border-[var(--dark)] rounded-br-[4px]" />
              <canvas ref={canvasRef} width={200} height={200} className="block rounded-[4px]" />
            </div>
            <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">
              app.shelvian.co/join
            </p>
          </div>

          {/* App store links — update href when store URLs are available */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <a
              href="https://apps.apple.com/search?term=shelvian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--dark)] text-white rounded-[var(--r)] text-[12px] font-semibold hover:bg-[#222] transition-colors no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store/search?q=shelvian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--dark)] text-white rounded-[var(--r)] text-[12px] font-semibold hover:bg-[#222] transition-colors no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
