"use client";

import { usePathname } from "next/navigation";
import { RetailerLogo } from "@/components/retailer-logo";
import type { User } from "@/types/auth";

const NAV_ITEMS = [
  { href: "/brand/demo-dashboard", label: "Overview", icon: "grid" },
  { href: "#", label: "Manage Shifts", icon: "cal", pip: "14", pipClass: "pip-li" },
  { href: "#", label: "Ambassador Directory", icon: "users" },
  { href: "#", label: "Live Map", icon: "pin", pip: "Live", pipClass: "pip-gr" },
  { href: "#", label: "Schedule", icon: "cal" },
];

const ANALYTICS_ITEMS = [
  { href: "#", label: "Data & Analytics", icon: "bar" },
  { href: "#", label: "Campaign Reports", icon: "file" },
  { href: "#", label: "Live Transcripts", icon: "msg", pip: "3", pipClass: "pip-re" },
  { href: "#", label: "Heatmaps", icon: "wave" },
];

const OPS_ITEMS = [
  { href: "#", label: "Billing & Payouts", icon: "card", pip: "!", pipClass: "pip-am" },
  { href: "#", label: "Inventory", icon: "box" },
];

export function BrandDashboardShell({
  user,
  brandName,
  brandLogoUrl,
  children,
}: {
  user: User;
  brandName: string | null;
  brandLogoUrl: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const displayName = brandName || "Brand";
  const managerLabel = `${user.name} · Brand Manager`;

  return (
    <div className="min-h-screen bg-[var(--off)] flex overflow-x-hidden">
      {/* Sidebar */}
      <aside className="brand-sidebar">
        <div className="brand-sidebar-logo brand-sidebar-brand-header">
          {brandLogoUrl ? (
            <div className="w-10 h-10 rounded-[9px] overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center p-1">
              <RetailerLogo
                src={brandLogoUrl}
                size={40}
                className="w-full h-full object-contain"
                fallback={
                  <div className="w-10 h-10 bg-[var(--lime)] rounded-[9px] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#111" />
                      <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#111" />
                      <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#111" />
                      <rect x="10" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
                    </svg>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-[var(--lime)] rounded-[9px] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-serif text-[16px] font-normal text-white leading-tight tracking-tight uppercase">
              {displayName}
            </div>
            <div className="text-[10px] text-white/35 mt-0.5 leading-tight">
              {managerLabel}
            </div>
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <polyline points="4,10 8,6 12,10" />
          </svg>
        </div>

        <div className="brand-sidebar-sec">Main</div>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`brand-nav-item ${pathname === item.href ? "on" : ""}`}
          >
            <NavIcon name={item.icon} />
            {item.label}
            {item.pip && <span className={`nav-pip ${item.pipClass}`}>{item.pip}</span>}
          </a>
        ))}

        <div className="brand-sidebar-div" />
        <div className="brand-sidebar-sec">Analytics</div>
        {ANALYTICS_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="brand-nav-item">
            <NavIcon name={item.icon} />
            {item.label}
            {item.pip && <span className={`nav-pip ${item.pipClass}`}>{item.pip}</span>}
          </a>
        ))}

        <div className="brand-sidebar-div" />
        <div className="brand-sidebar-sec">Operations</div>
        {OPS_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="brand-nav-item">
            <NavIcon name={item.icon} />
            {item.label}
            {item.pip && <span className={`nav-pip ${item.pipClass}`}>{item.pip}</span>}
          </a>
        ))}

        <div className="brand-sidebar-foot">
          <div className="brand-plan">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="rgba(203,236,69,0.6)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="6.5" />
              <polyline points="8,5 8,8 10,10" />
            </svg>
            <div className="brand-plan-txt">Campaign · Mar 10–Apr 10</div>
            <div className="brand-plan-tag">Pro</div>
          </div>
          <div className="brand-footer">
            <div className="w-5 h-5 bg-[var(--lime)] rounded flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round">
                <line x1="8" y1="1" x2="8" y2="15" />
                <line x1="1" y1="8" x2="15" y2="8" />
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-[11px] text-white/60 leading-tight">Shelvian</div>
              <div className="text-[9px] text-white/30 mt-0.5 leading-tight">Ambassador Marketplace</div>
            </div>
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <polyline points="4,10 8,6 12,10" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="brand-main">
        {/* Topbar */}
        <header className="brand-topbar">
          <div className="font-serif text-[19px] text-[var(--dark)]">Brand Dashboard</div>
          <span className="text-[11px] text-[var(--text3)]">/ Overview</span>
          <div className="flex-1 min-w-1" />
          <div className="brand-search">
            <SearchIcon />
            <input placeholder="Search shifts, ambassadors…" className="bg-transparent border-none outline-none text-xs text-[var(--text)] w-full font-sans placeholder:text-[var(--text3)]" />
          </div>
          <button type="button" className="brand-tb-btn ghost">
            <DownloadIcon /> Export
          </button>
          <button type="button" className="brand-tb-btn ghost">
            <LayersIcon /> Compare
          </button>
          <button type="button" className="brand-tb-btn lime">
            <PlusIcon /> Post a Shift
          </button>
          <div className="w-px h-5 bg-[var(--border)] mx-0.5" />
          <button type="button" className="brand-tb-icon" title="Settings">
            <GearIcon />
          </button>
          <button type="button" className="brand-tb-icon relative">
            <BellIcon />
            <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-[var(--red)] rounded-full border-[1.5px] border-[var(--off)]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--border)] flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-mono text-[10px] text-[var(--text3)] bg-[var(--elevated)] px-2.5 py-1 rounded-full border border-[var(--border)]">
            Mar 17, 2026
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  const size = 14;
  const stroke = "currentColor";
  const strokeW = 1.5;
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      </svg>
    ),
    cal: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
        <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" />
        <line x1="5" y1="1" x2="5" y2="4" />
        <line x1="11" y1="1" x2="11" y2="4" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
        <path d="M11 2.5a2.5 2.5 0 010 5M15 13c0-2.21-1.79-4-4-4" />
      </svg>
    ),
    pin: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.48-2.02-4.5-4.5-4.5z" />
        <circle cx="8" cy="6" r="1.5" />
      </svg>
    ),
    bar: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <line x1="4" y1="14" x2="4" y2="8" />
        <line x1="8" y1="14" x2="8" y2="4" />
        <line x1="12" y1="14" x2="12" y2="10" />
        <line x1="1.5" y1="14" x2="14.5" y2="14" />
      </svg>
    ),
    file: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <path d="M9 1.5H3.5A1.5 1.5 0 002 3v10a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0014 13V6.5L9 1.5z" />
        <polyline points="9,1.5 9,6.5 14,6.5" />
        <line x1="4.5" y1="9" x2="11.5" y2="9" />
        <line x1="4.5" y1="11.5" x2="9" y2="11.5" />
      </svg>
    ),
    msg: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <path d="M14 10.5a1.5 1.5 0 01-1.5 1.5H4L1.5 14.5V3A1.5 1.5 0 013 1.5h9.5A1.5 1.5 0 0114 3v7.5z" />
      </svg>
    ),
    wave: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <polyline points="1,8 4,4 7,11 10,5 13,8 15,8" />
      </svg>
    ),
    card: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
        <line x1="1.5" y1="7" x2="14.5" y2="7" />
      </svg>
    ),
    box: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth={strokeW}>
        <polyline points="14.5,5 8,1.5 1.5,5 1.5,11 8,14.5 14.5,11 14.5,5" />
        <polyline points="1.5,5 8,8.5 14.5,5" />
        <line x1="8" y1="8.5" x2="8" y2="14.5" />
      </svg>
    ),
  };
  return <span className="flex-shrink-0 opacity-55 [.brand-nav-item.on_&]:opacity-100 [.brand-nav-item:hover_&]:opacity-100">{icons[name] ?? null}</span>;
}

function SearchIcon() {
  return (
    <svg width="13" height="13" className="text-[var(--text3)] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5v9M5 8l3 3 3-3" />
      <path d="M2 11.5v1A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-1" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="1.5,6 8,2.5 14.5,6 8,9.5 1.5,6" />
      <polyline points="1.5,10 8,13.5 14.5,10" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="14" height="14" className="text-[var(--text2)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 01-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 01-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 01.52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 011.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 011.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 01.52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 01-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 01-1.255-.52z" />
      <circle cx="8" cy="8" r="2.246" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="14" height="14" className="text-[var(--text2)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 4 1.5 5 1.5 5H2S3.5 10 3.5 6A4.5 4.5 0 018 1.5z" />
      <line x1="6.5" y1="13" x2="9.5" y2="13" />
    </svg>
  );
}
