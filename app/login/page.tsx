"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import FormInput from "@/components/ui/FormInput";
import Checkbox from "@/components/ui/Checkbox";
import RoleToggle from "@/components/ui/RoleToggle";
import { GoogleIcon, ShieldCheckIcon, WhatsAppIcon } from "@/components/ui/icons";
import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";
import { setPersistMode } from "@/lib/store/dualStorage";
import { setSession } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ApiError } from "@/lib/api/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9]{10}$/;

export default function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialNotice, setSocialNotice] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!EMAIL_PATTERN.test(identifier) && !MOBILE_PATTERN.test(identifier)) {
      errors.identifier = t("login.errors.identifier");
    }
    if (!password) {
      errors.password = t("login.errors.password");
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await login({ identifier, password });
      // Raw storage write for the pre-hydration blocking redirect script on
      // the landing page (see components/RedirectIfAuthenticated.tsx), and
      // the Redux dispatch for everything rendered in-app (see
      // app/dashboard/layout.tsx) — kept in sync at every session mutation.
      saveSession(result, keepSignedIn);
      setPersistMode(keepSignedIn);
      dispatch(setSession(result));
      // First login on the emailed temporary password: force a password
      // change before anything else (dashboard/layout.tsx enforces it too).
      window.location.href = result.candidate.must_change_password
        ? "/change-password"
        : "/dashboard/profile";
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors ?? {});
        setError(err.message);
      } else {
        setError(t("login.errors.generic"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setSocialNotice(t("login.socialComingSoon", { provider }));
  };

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/">
          <Logo priority />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-10 lg:px-10 lg:py-20">
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-jz-border bg-gradient-to-br from-jz-blue-900 to-jz-blue-950 p-8 lg:p-12">
            <p className="text-xs font-semibold tracking-widest text-jz-yellow-400 uppercase">Jobzshala</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-jz-white-50 lg:text-4xl">
              {t("login.brandHeading")}
            </h1>
            <p className="mt-4 text-jz-white-200">{t("login.brandSubheading")}</p>
            <p className="mt-2 text-sm text-jz-white-400">{t("login.brandSupportLine")}</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-jz-white-400">
              <ShieldCheckIcon className="size-6" />
              {t("login.securityNote")}
            </div>
          </div>

          <div className="w-full rounded-2xl border border-jz-border bg-jz-blue-900/40 p-8">
            <RoleToggle
              candidateLabel={t("login.roleCandidate")}
              employerLabel={t("login.roleEmployer")}
              employerHref="/hire/login"
            />

            <h2 className="mt-6 font-serif text-2xl font-semibold text-jz-white-50">{t("login.title")}</h2>
            <p className="mt-2 text-sm text-jz-white-400">{t("login.subtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                  {error}
                </div>
              )}

              <FormInput
                label={t("login.identifierLabel")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t("login.identifierPlaceholder")}
                error={fieldErrors.identifier}
              />

              <FormInput
                label={t("login.passwordLabel")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                error={fieldErrors.password}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label={t("login.keepSignedIn")}
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <Link href="/forgot-password" className="text-sm text-jz-yellow-400 hover:underline">
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? t("login.submitting") : t("login.submit")}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-jz-border" />
              <span className="text-xs text-jz-white-600">{t("login.divider")}</span>
              <div className="h-px flex-1 bg-jz-border" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 transition-opacity hover:opacity-90"
              >
                <GoogleIcon className="size-4.5" />
                {t("login.continueWithGoogle")}
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("WhatsApp")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="size-4.5" />
                {t("login.continueWithWhatsApp")}
              </button>
            </div>
            {socialNotice && <p className="mt-3 text-center text-xs text-jz-white-600">{socialNotice}</p>}

            <p className="mt-6 text-center text-sm text-jz-white-400">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-jz-yellow-400 hover:underline">
                {t("login.registerLink")}
              </Link>
            </p>
          </div>
        </div>

        <div className="border-t border-jz-border">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-4 py-6 text-center sm:px-6 lg:px-10">
            <p className="text-sm text-jz-white-400">{t("login.footerTagline")}</p>
            <p className="text-xs text-jz-white-600">{t("login.footerBadges")}</p>
            <p className="text-xs text-jz-white-600">
              {t("login.needHelp")}{" "}
              <a href="#" className="text-jz-yellow-400 hover:underline">
                {t("login.contactSupport")}
              </a>{" "}
              ·{" "}
              <a href="#" className="text-jz-yellow-400 hover:underline">
                {t("login.talkToRecruiter")}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
