"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { CompassIcon, LogoutIcon, TargetIcon, UserIcon, ChevronDownIcon, CreditCardIcon } from "./ui/icons";
import type { CandidateSession } from "@/lib/auth/session";

type IconComponent = ComponentType<{ className?: string }>;

const MENU_ITEMS: { label: string; href: string; icon: IconComponent }[] = [
  { label: "My Journey", href: "/journey", icon: CompassIcon },
  { label: "My Profile", href: "/profile", icon: UserIcon },
  { label: "Job Matches", href: "/matches", icon: TargetIcon },
  { label: "Subscription", href: "/subscription", icon: CreditCardIcon },
];

// The public header's counterpart to (app)/DashboardShell.tsx's UserChipMenu
// — same avatar+name-chip-opens-a-menu shape, rebuilt against this header's
// dark jz-blue/jz-yellow palette rather than the dashboard's light
// .dashboard-artifact tokens, since the two don't share a CSS system.
export default function UserMenu({ session, onLogout }: { session: CandidateSession; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = session.candidate.full_name.charAt(0).toUpperCase();
  const firstName = session.candidate.full_name.split(" ")[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/10"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-yellow-300 to-jz-yellow-500 text-xs font-extrabold text-jz-ink-on-accent">
          {initial}
        </span>
        <span className="text-sm font-semibold text-jz-white-50">{firstName}</span>
        <ChevronDownIcon className={`size-3.5 text-jz-white-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        role="menu"
        className={`absolute right-0 z-30 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-jz-border bg-jz-blue-950 shadow-2xl shadow-black/50 transition-all duration-150 ease-out rtl:right-auto rtl:left-0 rtl:origin-top-left ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-jz-border px-4 py-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-yellow-300 to-jz-yellow-500 text-sm font-extrabold text-jz-ink-on-accent">
            {initial}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-jz-white-50">{session.candidate.full_name}</div>
            <div className="truncate text-xs text-jz-white-600">{session.candidate.email}</div>
          </div>
        </div>

        <div className="p-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              role="menuitem"
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-jz-white-200 transition-colors hover:bg-jz-blue-800"
            >
              <item.icon className="size-4 text-jz-yellow-400" />
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-jz-border px-3 pt-3.5 pb-2.5 text-left text-sm text-red-400 transition-colors hover:bg-jz-blue-800"
          >
            <LogoutIcon className="size-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
