"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderCta from "./ui/HeaderCta";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import Logo from "./ui/Logo";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "./ui/icons";

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.forCandidates"), href: "#" },
    { label: t("nav.solutions"), href: "#" },
    { label: t("nav.aboutUs"), href: "#" },
    { label: t("nav.resources"), href: "#" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-jz-yellow-400 bg-jz-blue-900">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-1">
          <Logo />
          <p className="hidden text-[10px] text-jz-white-100 sm:block">{t("nav.tagline")}</p>
        </div>

        <nav className="hidden items-center gap-1 xl:flex">
          <button type="button" className="flex items-center gap-1 rounded-xl bg-jz-blue-900 px-4 py-2 text-sm text-jz-white-200">
            {t("nav.forEmployers")}
            <ChevronDownIcon className="size-5" />
          </button>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded px-4 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <HeaderCta />
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
        <div className="border-t border-jz-border bg-jz-blue-900 px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            <span className="rounded px-3 py-2 text-sm text-jz-white-200">{t("nav.forEmployers")}</span>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="rounded px-3 py-2 text-sm text-jz-white-200 hover:text-jz-yellow-400">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <HeaderCta stacked className="mt-3" />
        </div>
      ) : null}
    </header>
  );
}
