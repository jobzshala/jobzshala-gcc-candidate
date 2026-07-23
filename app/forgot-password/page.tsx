"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import FormInput from "@/components/ui/FormInput";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    if (!EMAIL_PATTERN.test(email)) {
      setFieldError(t("forgotPassword.errors.email"));
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("forgotPassword.errors.generic"));
    } finally {
      setSubmitting(false);
    }
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
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-jz-border bg-jz-blue-900/40 p-8">
          {sent ? (
            <div className="text-center">
              <h1 className="font-serif text-2xl font-semibold text-jz-white-50">{t("forgotPassword.sentTitle")}</h1>
              <p className="mt-3 text-sm text-jz-white-400">{t("forgotPassword.sentBody")}</p>
              <Link href="/login" className="mt-6 inline-block text-sm text-jz-yellow-400 hover:underline">
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl font-semibold text-jz-white-50">{t("forgotPassword.title")}</h1>
              <p className="mt-2 text-sm text-jz-white-400">{t("forgotPassword.subtitle")}</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                    {error}
                  </div>
                )}

                <FormInput
                  label={t("forgotPassword.emailLabel")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={fieldError}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-jz-white-400">
                <Link href="/login" className="text-jz-yellow-400 hover:underline">
                  {t("forgotPassword.backToLogin")}
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
