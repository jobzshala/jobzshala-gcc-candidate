"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "./ui/icons";

type IconComponent = ComponentType<{ className?: string }>;

export interface NavDropdownItem {
  label: string;
  href: string;
  // Short line shown under the label for mega-menu-style items (Solutions,
  // Resources). Left off for plain action links (login, register, etc).
  description?: string;
  icon?: IconComponent;
  // Employer-portal links point at a separate Next.js app served under
  // /hire (see sitemap/page.tsx) — those need a plain <a>, not next/link.
  external?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  className?: string;
}

export default function NavDropdown({ label, items, className = "" }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors ${
          open ? "text-jz-yellow-400" : "text-jz-white-200 hover:text-jz-yellow-400"
        }`}
      >
        {label}
        <ChevronDownIcon className={`size-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <ul
        role="menu"
        className={`absolute left-0 z-30 mt-2 w-72 origin-top overflow-hidden rounded-2xl border border-jz-border bg-jz-blue-950 p-2 shadow-xl shadow-black/10 transition-all duration-150 ease-out rtl:left-auto rtl:right-0 rtl:origin-top ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              {Icon && (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-jz-blue-800 text-jz-yellow-400">
                  <Icon className="size-4.5" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-jz-white-50">{item.label}</span>
                {item.description && (
                  <span className="mt-0.5 block text-xs text-jz-white-400">{item.description}</span>
                )}
              </span>
            </>
          );
          const itemClassName = "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-jz-blue-800";

          return (
            <li key={item.href} role="none">
              {item.external ? (
                <a role="menuitem" href={item.href} onClick={() => setOpen(false)} className={itemClassName}>
                  {content}
                </a>
              ) : (
                <Link role="menuitem" href={item.href} onClick={() => setOpen(false)} className={itemClassName}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
