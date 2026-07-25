"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown, { type NavDropdownItem } from "./NavDropdown";
import ThemeToggle from "./ThemeToggle";
import Logo from "./ui/Logo";
import {
  BriefcaseIcon,
  CloseIcon,
  DocumentIcon,
  GlobeIcon,
  MailIcon,
  MenuIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TargetIcon,
  UserIcon,
} from "./ui/icons";

// Employer-portal links point at the separate Next.js app served under
// /hire (see sitemap/page.tsx) — plain hrefs, not next/link.
const EMPLOYER_ITEMS: NavDropdownItem[] = [
  { label: "Employer portal", href: "/hire", icon: BriefcaseIcon, external: true },
  { label: "Register as an employer", href: "/hire/register", icon: DocumentIcon, external: true },
  { label: "Employer login", href: "/hire/login", icon: UserIcon, external: true },
  { label: "Pricing", href: "/pricing", icon: TargetIcon },
];

const CANDIDATE_ITEMS: NavDropdownItem[] = [
  { label: "Create a GCC Workforce Profile", href: "/register?role=candidate", icon: UserIcon },
  { label: "Candidate login", href: "/login", icon: ShieldCheckIcon },
  { label: "Success stories", href: "/success-stories", icon: SparkleIcon },
  { label: "Blog", href: "/blog", icon: DocumentIcon },
];

// Anchors point at homepage sections (ids added on WhyChooseUs, HowItWorks,
// TrustVerification, WorkforceCorridor) — no dedicated solution pages exist
// yet, so this links straight to the part of the homepage that covers each.
const SOLUTIONS_ITEMS: NavDropdownItem[] = [
  {
    label: "Recruitment Solutions",
    href: "/#recruitment-solutions",
    description: "AI-assisted sourcing and end-to-end hiring",
    icon: BriefcaseIcon,
  },
  {
    label: "Workforce Infrastructure",
    href: "/#workforce-infrastructure",
    description: "Structured India → GCC workforce mobility",
    icon: GlobeIcon,
  },
  {
    label: "AI Matching",
    href: "/#ai-matching",
    description: "AI-powered candidate-to-job matching",
    icon: SparkleIcon,
  },
  {
    label: "Candidate Verification",
    href: "/#candidate-verification",
    description: "Recruiter-verified, document-checked profiles",
    icon: ShieldCheckIcon,
  },
  {
    label: "Visa Assistance",
    href: "/blog/uae-work-visas-explained-a-simple-guide-for-first-time-job-seekers",
    description: "Guides on GCC work visas and relocation",
    icon: DocumentIcon,
  },
];

const RESOURCES_ITEMS: NavDropdownItem[] = [
  { label: "Blog", href: "/blog", description: "Career advice and hiring playbooks", icon: DocumentIcon },
  { label: "Success Stories", href: "/success-stories", description: "Real placements across the GCC", icon: SparkleIcon },
  { label: "Pricing", href: "/pricing", description: "Plans for candidates and employers", icon: TargetIcon },
  { label: "Sitemap", href: "/sitemap", description: "Every public page in one index", icon: GlobeIcon },
  { label: "Contact Us", href: "/contact-us", description: "Get in touch with our team", icon: MailIcon },
];

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-jz-yellow-400 bg-jz-blue-900">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="flex flex-col gap-1">
          <Logo />
          <p className="hidden text-[10px] text-jz-white-100 sm:block">{t("nav.tagline")}</p>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          <NavDropdown label={t("nav.forEmployers")} items={EMPLOYER_ITEMS} />
          <NavDropdown label={t("nav.forCandidates")} items={CANDIDATE_ITEMS} />
          <NavDropdown label={t("nav.solutions")} items={SOLUTIONS_ITEMS} />
          <Link href="/about-us" className="rounded px-4 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
            {t("nav.aboutUs")}
          </Link>
          <NavDropdown label={t("nav.resources")} items={RESOURCES_ITEMS} />
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
            {t("nav.login")}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
          >
            {t("nav.register")}
          </Link>
        </div>

        <button
          type="button"
          className="text-jz-white-100 xl:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-jz-border bg-jz-blue-900 px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-4">
            {[
              { title: t("nav.forEmployers"), items: EMPLOYER_ITEMS },
              { title: t("nav.forCandidates"), items: CANDIDATE_ITEMS },
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
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-center text-sm text-jz-white-100 hover:opacity-90"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-center text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
