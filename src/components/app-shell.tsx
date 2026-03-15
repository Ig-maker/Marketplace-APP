"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@/types/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/billing", label: "Billing", icon: BillingIcon },
];

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        // Fallback: use GET route which also clears cookies and redirects
        window.location.assign("/api/auth/logout");
      }
    } catch {
      window.location.assign("/api/auth/logout");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--off)]">
      {/* Top Nav */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <div className="w-[30px] h-[30px] bg-[var(--lime)] rounded-[7px] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#111" />
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
              </svg>
            </div>
            <span className="font-serif text-lg text-[var(--dark)] tracking-tight">Shelvian</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[var(--r)] text-[13px] font-medium no-underline transition-colors ${
                    isActive
                      ? "bg-[var(--elevated)] text-[var(--text)]"
                      : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--elevated)]"
                  }`}
                >
                  <item.icon active={isActive} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-medium text-[var(--text)]">{user.name}</div>
            <div className="text-[11px] text-[var(--text3)] capitalize">{user.role}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--lime)] flex items-center justify-center text-[12px] font-bold text-[#111] flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            type="button"
            disabled={isLoggingOut}
            className="text-[12px] font-medium text-[var(--text)] bg-transparent border border-[var(--border)] rounded-[var(--r)] px-3 py-1.5 cursor-pointer hover:border-[var(--border2)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging Out..." : "Log Out"}
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BillingIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="2" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
      <path d="M1.5 7h13" stroke={active ? "var(--dark)" : "currentColor"} strokeWidth="1.3" />
    </svg>
  );
}
