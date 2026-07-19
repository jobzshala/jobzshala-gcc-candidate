"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { clearSession as clearRawSession } from "@/lib/auth/session";
import { clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/api/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // By the time this mounts, StoreProvider's PersistGate (app/layout.tsx)
  // has already rehydrated the auth state from storage — no per-page
  // "checking" step needed here, unlike the old localStorage-in-an-effect
  // version of this component.
  const session = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!session.accessToken) {
      window.location.href = "/login";
    }
  }, [session.accessToken]);

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

  if (!session.accessToken || !session.candidate) {
    // Genuinely logged out — the redirect effect above is already firing.
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <header className="sticky top-0 z-40 border-b-2 border-jz-yellow-400 bg-jz-blue-900">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/dashboard/profile"
              aria-label={t("dashboard.nav.profile")}
              className="flex items-center gap-2 rounded-full border border-jz-yellow-400/40 bg-jz-yellow-400/10 py-1 pr-3.5 pl-1 text-sm text-jz-white-100 transition-colors hover:bg-jz-yellow-400/20"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-jz-yellow-400 text-xs font-semibold text-jz-ink-on-accent">
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
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
