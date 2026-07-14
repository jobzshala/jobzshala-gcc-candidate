"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "./config";
import { defaultLocale, getLanguageMeta, languages, type LocaleCode } from "./languages";

const STORAGE_KEY = "jobzshala-locale";

function applyDocumentLocale(locale: LocaleCode) {
  const meta = getLanguageMeta(locale);
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial = languages.some((l) => l.code === stored) ? (stored as LocaleCode) : defaultLocale;
    i18n.changeLanguage(initial);
    applyDocumentLocale(initial);

    const handleChange = (lng: string) => {
      window.localStorage.setItem(STORAGE_KEY, lng);
      applyDocumentLocale(lng as LocaleCode);
    };
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
