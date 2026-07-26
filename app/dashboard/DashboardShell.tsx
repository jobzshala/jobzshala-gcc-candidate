"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { GridIcon, UserIcon, LockIcon, LogoutIcon, ChevronDownIcon } from "@/components/ui/icons";
import { clearSession as clearRawSession } from "@/lib/auth/session";
import { clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/api/auth";

// Overview/Profile used to live as header tabs; they, plus Change Password
// and Logout, now live in this one avatar menu instead — same
// click-outside/Escape pattern as NavDropdown.tsx, but with a custom
// avatar+name trigger NavDropdown's label-button doesn't support.
function UserMenu({ name, onLogout }: { name: string; onLogout: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
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

  const menuItems = [
    { label: t("dashboard.nav.overview"), href: "/dashboard", icon: GridIcon },
    { label: t("dashboard.nav.profile"), href: "/dashboard/profile", icon: UserIcon },
    { label: t("dashboard.nav.changePassword"), href: "/change-password", icon: LockIcon },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/10 py-1 pr-3 pl-1 text-sm text-jz-white-100 transition-colors hover:bg-[#4ADE80]/20"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate sm:inline">{name}</span>
        <ChevronDownIcon className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        role="menu"
        className={`absolute right-0 z-30 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-jz-border bg-jz-blue-900 p-2 shadow-2xl shadow-black/50 transition-all duration-150 ease-out rtl:left-0 rtl:right-auto rtl:origin-top-left ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 px-2.5 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-sm font-semibold text-white">
            {initial}
          </span>
          <span className="truncate text-sm font-medium text-jz-white-50">{name}</span>
        </div>
        <div className="my-1 h-px bg-jz-border" />
        {menuItems.map((item) => (
          <Link
            key={item.href}
            role="menuitem"
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-jz-white-200 transition-colors hover:bg-[#4ADE80]/10 hover:text-jz-white-50"
          >
            <item.icon className="size-4.5 text-[#8FD13F]" />
            {item.label}
          </Link>
        ))}
        <div className="my-1 h-px bg-jz-border" />
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onLogout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogoutIcon className="size-4.5" />
          {t("dashboard.nav.logout")}
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // The SessionGate in app/dashboard/layout.tsx has already rehydrated the auth
  // state from storage by the time this mounts, so the session can be read
  // synchronously here with no per-page "checking" step.
  const session = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!session.accessToken) {
      window.location.href = "/login";
    } else if (session.candidate?.must_change_password) {
      // Still on the emailed temporary password — nothing in the dashboard
      // is reachable until they set their own.
      window.location.href = "/change-password";
    }
  }, [session.accessToken, session.candidate?.must_change_password]);

  const handleLogout = async () => {
    if (session.refreshToken) {
      try {
        await logout(session.refreshToken);
      } catch {
        // Best-effort — the session is being cleared locally either way.
      }
    }
    clearRawSession();
    dispatch(clearReduxSession());
    window.location.href = "/login";
  };

  if (!session.accessToken || !session.candidate || session.candidate.must_change_password) {
    // Logged out or still on the temporary password — the redirect effect
    // above is already firing.
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <header className="sticky top-0 z-40 border-b-2 border-[#16A34A] bg-jz-blue-900">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-1">
            <Logo />
            <p className="hidden text-[10px] text-jz-white-100 sm:block">{t("nav.tagline")}</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <UserMenu name={session.candidate.full_name} onLogout={handleLogout} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
