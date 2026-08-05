"use client";

import "./dashboard-artifact.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { languages } from "@/lib/i18n/languages";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  GridIcon,
  UserIcon,
  LockIcon,
  LogoutIcon,
  ChevronDownIcon,
  TargetIcon,
  CreditCardIcon,
  MenuIcon,
  BellIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
  ChatIcon,
} from "@/components/ui/icons";
import { clearSession as clearRawSession } from "@/lib/auth/session";
import { clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/api/auth";

const PAGE_TITLES: { match: (path: string) => boolean; titleKey: string; subKey: string }[] = [
  { match: (p) => p === "/dashboard", titleKey: "dashboard.nav.myJourney", subKey: "dashboard.topbar.journeySub" },
  { match: (p) => p.startsWith("/dashboard/profile"), titleKey: "dashboard.nav.profile", subKey: "dashboard.topbar.profileSub" },
  { match: (p) => p.startsWith("/dashboard/matches"), titleKey: "dashboard.nav.matches", subKey: "dashboard.topbar.matchesSub" },
  { match: (p) => p.startsWith("/dashboard/subscription"), titleKey: "dashboard.nav.subscription", subKey: "dashboard.topbar.subscriptionSub" },
  { match: (p) => p.startsWith("/dashboard/documents"), titleKey: "dashboard.nav.documents", subKey: "dashboard.topbar.documentsSub" },
];

function ThemeIconPill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-pill"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon className="icon" /> : <MoonIcon className="icon" />}
    </button>
  );
}

function LangChip() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button type="button" className="lang" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <GlobeIcon className="icon" />
        <span className="txt">{current.short}</span>
        <ChevronDownIcon className="size-2.5" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border py-1 shadow-xl rtl:right-auto rtl:left-0"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}
        >
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === current.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-sm hover:opacity-80"
                style={{ color: lang.code === current.code ? "var(--green-600)" : "var(--ink)" }}
              >
                <span>{lang.label}</span>
                <span style={{ color: "var(--ink-faint)", fontSize: 11 }}>{lang.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UserChipMenu({ name, onLogout }: { name: string; onLogout: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = name.charAt(0).toUpperCase();
  const firstName = name.split(" ")[0];

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

  const menuItems = [
    { label: t("dashboard.nav.myJourney"), href: "/dashboard", icon: GridIcon },
    { label: t("dashboard.nav.profile"), href: "/dashboard/profile", icon: UserIcon },
    { label: t("dashboard.nav.matches"), href: "/dashboard/matches", icon: TargetIcon },
    { label: t("dashboard.nav.subscription"), href: "/dashboard/subscription", icon: CreditCardIcon },
    { label: t("dashboard.nav.changePassword"), href: "/change-password", icon: LockIcon },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button type="button" className="user-chip" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <span className="av">{initial}</span>
        <span className="meta">
          <span className="hi">Hello,</span>
          <br />
          <span className="name">{firstName}</span>
        </span>
        <ChevronDownIcon className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-2xl border p-2 shadow-2xl rtl:left-0 rtl:right-auto"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3 px-2.5 py-2">
            <span className="av">{initial}</span>
            <span className="truncate text-sm font-medium" style={{ color: "var(--ink)" }}>
              {name}
            </span>
          </div>
          <div className="my-1 h-px" style={{ background: "var(--line)" }} />
          {menuItems.map((item) => (
            <Link
              key={item.href}
              role="menuitem"
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm hover:opacity-80"
              style={{ color: "var(--ink-soft)" }}
            >
              <span className="flex" style={{ color: "var(--green-600)" }}>
                <item.icon className="icon" />
              </span>
              {item.label}
            </Link>
          ))}
          <div className="my-1 h-px" style={{ background: "var(--line)" }} />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm hover:opacity-80"
            style={{ color: "var(--red)" }}
          >
            <LogoutIcon className="icon" />
            {t("dashboard.nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const page = PAGE_TITLES.find((p) => p.match(pathname));

  return (
    <div className="dashboard-artifact">
      <div className={`shell${mobileNavOpen ? " nav-open" : ""}`}>
        <div className="sidebar-veil" onClick={() => setMobileNavOpen(false)} />
        <Sidebar onClose={() => setMobileNavOpen(false)} />

        <main className="main">
          <div className="topbar">
            <button type="button" className="hamburger" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <MenuIcon className="icon" />
            </button>
            <div className="topbar-title">
              {page ? t(page.titleKey) : t("dashboard.nav.myJourney")}
              <span className="sub">{page ? t(page.subKey) : ""}</span>
            </div>
            <div className="topbar-spacer" />
            <div className="topbar-right">
              <ThemeIconPill />
              {/* TODO(backend): no notifications endpoint exists yet — the
                  bell is a stable nav affordance, deliberately shown without
                  a fabricated unread count. */}
              <button type="button" className="icon-pill" disabled title="Coming soon">
                <BellIcon className="icon" />
              </button>
              <LangChip />
              <UserChipMenu name={session.candidate.full_name} onLogout={handleLogout} />
            </div>
          </div>

          {children}
        </main>
      </div>

      {/* TODO(backend): no real support WhatsApp number is wired anywhere in
          this app yet — see the matching note in Sidebar.tsx's help-card. */}
      <button type="button" className="fab-wa" disabled title="Coming soon" aria-label="Chat on WhatsApp">
        <ChatIcon className="icon" />
      </button>
    </div>
  );
}
