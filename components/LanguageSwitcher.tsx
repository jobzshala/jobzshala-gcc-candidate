"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "@/lib/i18n/languages";
import { ChevronDownIcon } from "./ui/icons";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === i18n.language) ?? languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-xl border border-jz-border px-4 py-2 text-sm text-jz-white-200"
      >
        <span>{current.short}</span>
        <ChevronDownIcon className="size-5" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 rtl:right-auto rtl:left-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-jz-border bg-jz-blue-900 py-1 shadow-xl"
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
                className={`flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-jz-blue-800 ${
                  lang.code === current.code ? "text-jz-yellow-400" : "text-jz-white-200"
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-xs text-jz-white-600">{lang.short}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
