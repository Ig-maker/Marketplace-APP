"use client";

export function BrandAlertBanner() {
  return (
    <div className="brand-alert" id="alert-bar">
      <svg width="13" height="13" className="flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 1.5L1 14.5h14L8 1.5z" />
        <line x1="8" y1="6.5" x2="8" y2="9.5" />
        <line x1="8" y1="11.5" x2="8.01" y2="11.5" strokeWidth="2" />
      </svg>
      <div>
        <strong>Action needed:</strong> Parker N. at Target LA has not filed her shift report — 2h overdue.{" "}
        <span className="underline cursor-pointer font-semibold">Send reminder →</span>
      </div>
      <div className="w-px h-3.5 bg-amber/25 flex-shrink-0" />
      <svg width="12" height="12" className="flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="9,1.5 2.5,9.5 7.5,9.5 7,14.5 13.5,6.5 8.5,6.5" />
      </svg>
      <span className="whitespace-nowrap">
        Sprouts Chicago: <strong>low velocity</strong> — 12/100 after 2 hrs
      </span>
      <button
        type="button"
        className="ml-auto opacity-50 hover:opacity-100 flex items-center flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
        onClick={() => document.getElementById("alert-bar")?.remove()}
        aria-label="Dismiss alert"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="3" y1="3" x2="13" y2="13" />
          <line x1="13" y1="3" x2="3" y2="13" />
        </svg>
      </button>
    </div>
  );
}
