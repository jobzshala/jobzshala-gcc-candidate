"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import {
  UserIcon,
  CompassIcon,
  TargetIcon,
  ClipboardIcon,
  MailIcon,
  FolderIcon,
  CreditCardIcon,
  QuestionIcon,
  CloseIcon,
  ChatIcon,
} from "@/components/ui/icons";

type NavItem = {
  key: string;
  label: string;
  href: string | null;
  icon: ComponentType<{ className?: string }>;
};

type SidebarProps = {
  onClose: () => void;
  whatsappNumber: string | null;
  whatsappMessage: string | null;
};

// The artifact's sidebar has no separate tablet/mobile JSX variants — one
// nav structure, and the icon-only rail (tablet) / off-canvas drawer
// (mobile) are pure CSS from dashboard-artifact.css keyed off viewport
// width and the parent .shell's "nav-open" class.
export default function Sidebar({ onClose, whatsappNumber, whatsappMessage }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const items: NavItem[] = [
    { key: "profile", label: t("dashboard.nav.profile"), href: "/profile", icon: UserIcon },
    { key: "overview", label: t("dashboard.nav.myJourney"), href: "/journey", icon: CompassIcon },
    { key: "matches", label: t("dashboard.nav.matches"), href: "/matches", icon: TargetIcon },
    // TODO(backend): no Applications/Messages concept exists in the API yet
    // (confirmed — there's no applications list or messaging endpoint
    // anywhere in lib/api). These render as disabled placeholders rather
    // than dead links or invented routes.
    { key: "applications", label: t("dashboard.nav.applications"), href: null, icon: ClipboardIcon },
    { key: "messages", label: t("dashboard.nav.messages"), href: null, icon: MailIcon },
    { key: "documents", label: t("dashboard.nav.documents"), href: "/documents", icon: FolderIcon },
    { key: "subscription", label: t("dashboard.nav.subscription"), href: "/subscription", icon: CreditCardIcon },
    { key: "support", label: t("dashboard.nav.support"), href: "/contact-us", icon: QuestionIcon },
  ];

  const isActive = (href: string | null) => {
    if (!href) return false;
    const base = href.split("#")[0];
    return base === "/journey" ? pathname === "/journey" : pathname.startsWith(base);
  };

  return (
    <nav className="sidebar">
      <div className="brand">
        <Logo />
        <div className="tagwrap">
          <div className="tag">{t("nav.tagline")}</div>
        </div>
        <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
          <CloseIcon className="icon" />
        </button>
      </div>

      <div className="nav">
        {items.map((item) => {
          const active = isActive(item.href);
          const content = (
            <>
              <span className="ic">
                <item.icon className="icon" />
              </span>
              <span>{item.label}</span>
              {!item.href && <span className="badge">{t("dashboard.nav.comingSoon")}</span>}
            </>
          );
          return item.href ? (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`nav-item${active ? " active" : ""}`}
            >
              {content}
            </Link>
          ) : (
            <span key={item.key} className="nav-item disabled" aria-disabled="true" title={t("dashboard.nav.comingSoon")}>
              {content}
            </span>
          );
        })}
      </div>

      <div className="help-card">
        <h4>Need Help?</h4>
        <p>Talk to your recruiter — we are here to help you 24/7</p>
        {whatsappNumber ? (
          <a
            href={`https://wa.me/${whatsappNumber}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""}`}
            target="_blank"
            rel="noreferrer"
            className="wa-btn"
          >
            <ChatIcon className="icon" />
            Chat on WhatsApp
          </a>
        ) : (
          <button type="button" className="wa-btn" disabled title="Not configured yet">
            <ChatIcon className="icon" />
            Chat on WhatsApp
          </button>
        )}
        <svg className="skyline" viewBox="0 0 200 70" width="100%" height="60" fill="none">
          <path
            d="M0 70 L0 40 L14 40 L14 22 L22 22 L22 40 L34 40 L34 15 L44 15 L44 40 L58 40 L58 30 L66 30 L66 40 L80 40 L80 8 L88 8 L88 40 L104 40 L104 25 L112 25 L112 40 L128 40 L128 18 L136 18 L136 40 L150 40 L150 32 L158 32 L158 40 L172 40 L172 12 L180 12 L180 40 L200 40 L200 70 Z"
            fill="var(--green-500)"
            opacity="0.5"
          />
        </svg>
      </div>
    </nav>
  );
}
