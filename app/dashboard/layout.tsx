"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { clearSession as clearRawSession } from "@/lib/auth/session";
import { clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/api/auth";

const NAV_TABS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  // By the time this mounts, StoreProvider's PersistGate (app/layout.tsx)
  // has already rehydrated the auth state from storage — no per-page
  // "checking" step needed here, unlike the old localStorage-in-an-effect
  // version of this component.
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
        <div className="mx-auto grid max-w-[1200px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Logo />

          <nav className="hidden justify-self-center rounded-xl border border-jz-border bg-jz-blue-950/50 p-1 sm:flex">
            {NAV_TABS.map((tab) => {
              const active = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white shadow-sm"
                      : "text-jz-white-400 hover:bg-white/5 hover:text-jz-white-100"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/dashboard/profile"
              aria-label={t("dashboard.nav.profile")}
              className="flex items-center gap-2 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/10 py-1 pr-3.5 pl-1 text-sm text-jz-white-100 transition-colors hover:bg-[#4ADE80]/20"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-xs font-semibold text-white">
                {session.candidate.full_name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-[10rem] truncate sm:inline">{session.candidate.full_name}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-jz-white-600 px-3.5 py-2 text-sm text-jz-white-100 transition-opacity hover:opacity-90"
            >
              {t("dashboard.nav.logout")}
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 border-t border-white/10 px-4 py-2 sm:hidden">
          {NAV_TABS.map((tab) => {
            const active = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 rounded-lg py-1.5 text-center text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white shadow-sm"
                    : "text-jz-white-400 hover:bg-white/5 hover:text-jz-white-100"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
