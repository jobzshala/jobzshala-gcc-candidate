"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown, { type NavDropdownItem } from "./NavDropdown";
// import ThemeToggle from "./ThemeToggle";
import Logo from "./ui/Logo";
import UserMenu from "./UserMenu";
import {
  clearSession,
  readStoredSession,
  subscribeToSession,
  type CandidateSession,
} from "@/lib/auth/session";
import { logout } from "@/lib/api/auth";
import { ROUTES } from "@/lib/routes";
import {
  BriefcaseIcon,
  CloseIcon,
  DocumentIcon,
  GlobeIcon,
  MailIcon,
  MenuIcon,
  QuestionIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TargetIcon,
  UserIcon,
} from "./ui/icons";

// Both of these are acquisition-funnel dropdowns — "become an employer" /
// "become a candidate" — aimed at a visitor who isn't one yet. Neither has a
// job left once `session` is set (see below), so both disappear entirely
// rather than getting their contents swapped for account links; that's what
// UserMenu is for. Employer-portal links point at the separate Next.js app
// served under /hire (see sitemap/page.tsx) — plain hrefs, not next/link.
const EMPLOYER_ITEMS: NavDropdownItem[] = [
  { label: "Employer portal", href: "/hire", icon: BriefcaseIcon, external: true },
  { label: "Register as an employer", href: "/hire/register", icon: DocumentIcon, external: true },
  { label: "Employer login", href: ROUTES.employerLogin, icon: UserIcon, external: true },
  { label: "Pricing", href: "/pricing", icon: TargetIcon },
];

const CANDIDATE_ITEMS: NavDropdownItem[] = [
  { label: "Create a GCC Workforce Profile", href: "/register?role=candidate", icon: UserIcon },
  { label: "Candidate login", href: ROUTES.login, icon: ShieldCheckIcon },
  { label: "Success stories", href: "/success-stories", icon: SparkleIcon },
  { label: "Blog", href: "/blog", icon: DocumentIcon },
];

const SOLUTIONS_ITEMS: NavDropdownItem[] = [
  {
    label: "Recruitment Solutions",
    href: "/solutions/recruitment-solutions",
    description: "AI-assisted sourcing and end-to-end hiring",
    icon: BriefcaseIcon,
  },
  {
    label: "Workforce Infrastructure",
    href: "/solutions/workforce-infrastructure",
    description: "Structured India → GCC workforce mobility",
    icon: GlobeIcon,
  },
  {
    label: "AI Matching",
    href: "/solutions/ai-matching",
    description: "AI-powered candidate-to-job matching",
    icon: SparkleIcon,
  },
  {
    label: "Candidate Verification",
    href: "/solutions/candidate-verification",
    description: "Recruiter-verified, document-checked profiles",
    icon: ShieldCheckIcon,
  },
  {
    label: "Visa Assistance",
    href: "/solutions/visa-assistance",
    description: "Visa, medical, travel and joining support",
    icon: DocumentIcon,
  },
];

const RESOURCES_ITEMS: NavDropdownItem[] = [
  { label: "Blog", href: "/blog", description: "Career advice and hiring playbooks", icon: DocumentIcon },
  { label: "Success Stories", href: "/success-stories", description: "Real placements across the GCC", icon: SparkleIcon },
  { label: "Pricing", href: "/pricing", description: "Plans for candidates and employers", icon: TargetIcon },
  { label: "Sitemap", href: "/sitemap", description: "Every public page in one index", icon: GlobeIcon },
  { label: "Contact Us", href: "/contact-us", description: "Get in touch with our team", icon: MailIcon },
  { label: "FAQs", href: "/faq", description: "Common questions about your account", icon: QuestionIcon },
];

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Public pages don't run PersistGate (see lib/store/SessionGate.tsx — it's
  // deliberately scoped to the authenticated (app) area only, so public
  // pages keep server-rendering real HTML for crawlers instead of an empty
  // shell). So this header can't read Redux for auth state; it reads the
  // same raw storage key directly instead, client-side only — the server
  // snapshot is null so SSR and hydration always render logged-out, then the
  // client snapshot takes over for a real visitor who's actually signed in.
  const rawSession = useSyncExternalStore(subscribeToSession, readStoredSession, () => null);
  const session = useMemo<CandidateSession | null>(() => {
    if (!rawSession) return null;
    try {
      return JSON.parse(rawSession) as CandidateSession;
    } catch {
      // Malformed storage — treat as logged out rather than throwing.
      return null;
    }
  }, [rawSession]);

  const handleLogout = async () => {
    if (session?.refreshToken) {
      try {
        await logout(session.refreshToken);
      } catch {
        // Best-effort — the session is being cleared locally either way.
      }
    }
    // clearSession() notifies the store subscription above, which drops
    // `session` to null on the next render.
    clearSession();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-jz-blue-400 bg-jz-blue-950 shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center gap-7 px-4 py-5 sm:px-6 lg:px-16 xl:justify-center">
        <Link href="/" className="flex flex-col gap-1">
          <Logo />
          <p className="hidden text-[10px] text-jz-white-100 sm:block">{t("nav.tagline")}</p>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {!session && <NavDropdown label={t("nav.forEmployers")} items={EMPLOYER_ITEMS} />}
          {!session && <NavDropdown label={t("nav.forCandidates")} items={CANDIDATE_ITEMS} />}
          <NavDropdown label={t("nav.solutions")} items={SOLUTIONS_ITEMS} />
          <Link href="/about-us" className="whitespace-nowrap rounded px-3 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
            {t("nav.aboutUs")}
          </Link>
          <NavDropdown label={t("nav.resources")} items={RESOURCES_ITEMS} />
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {/* <ThemeToggle /> */}
          <LanguageSwitcher />
          {session ? (
            <UserMenu session={session} onLogout={handleLogout} />
          ) : (
            <>
              <Link href={ROUTES.login} className="rounded-xl px-4 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
                {t("nav.login")}
              </Link>
              <Link
                href={ROUTES.register}
                className="rounded-xl bg-[#FECC00] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-opacity hover:opacity-90"
              >
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto text-jz-white-100 xl:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-jz-border bg-jz-blue-950 px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-4">
            {[
              ...(!session
                ? [
                    { title: t("nav.forEmployers"), items: EMPLOYER_ITEMS },
                    { title: t("nav.forCandidates"), items: CANDIDATE_ITEMS },
                  ]
                : []),
              { title: t("nav.solutions"), items: SOLUTIONS_ITEMS },
              { title: t("nav.resources"), items: RESOURCES_ITEMS },
            ].map((group) => (
              <div key={group.title}>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-jz-white-600">{group.title}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {group.items.map((item) =>
                    item.external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        className="rounded px-3 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded px-3 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1 border-t border-jz-border pt-3">
              <Link href="/about-us" className="rounded px-3 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
                {t("nav.aboutUs")}
              </Link>
            </div>
          </nav>
          <div className="mt-4 flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <LanguageSwitcher />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {session ? (
              <>
                <div className="mb-1 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-yellow-300 to-jz-yellow-500 text-xs font-extrabold text-jz-ink-on-accent">
                    {session.candidate.full_name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-jz-white-50">{session.candidate.full_name}</div>
                    <div className="truncate text-xs text-jz-white-600">{session.candidate.email}</div>
                  </div>
                </div>
                {[
                  { label: "My Journey", href: ROUTES.journey },
                  { label: "My Profile", href: ROUTES.profile },
                  { label: "Job Matches", href: ROUTES.matches },
                  { label: "Subscription", href: ROUTES.subscription },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-center text-sm text-jz-white-100 hover:opacity-90"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-2.5 text-center text-sm text-red-400 hover:opacity-90"
                >
                  {t("dashboard.nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-center text-sm text-jz-white-100 hover:opacity-90"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href={ROUTES.register}
                  className="rounded-xl bg-[#FECC00] px-4 py-2.5 text-center text-sm font-semibold text-[#1A1A1A] transition-opacity hover:opacity-90"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
