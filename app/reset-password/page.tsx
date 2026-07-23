"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import FormInput from "@/components/ui/FormInput";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!PASSWORD_PATTERN.test(password)) {
      errors.password = t("resetPassword.errors.password");
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = t("resetPassword.errors.confirmPassword");
    }
    if (!token) {
      setError(t("resetPassword.errors.missingToken"));
      return;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, password, confirmPassword });
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors ?? {});
        setError(err.message);
      } else {
        setError(t("resetPassword.errors.generic"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-jz-border bg-jz-blue-900/40 p-8">
      {done ? (
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50">{t("resetPassword.doneTitle")}</h1>
          <p className="mt-3 text-sm text-jz-white-400">{t("resetPassword.doneBody")}</p>
        </div>
      ) : (
        <>
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50">{t("resetPassword.title")}</h1>
          <p className="mt-2 text-sm text-jz-white-400">{t("resetPassword.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                {error}
              </div>
            )}

            <FormInput
              label={t("resetPassword.passwordLabel")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              hint={t("resetPassword.passwordHint")}
              error={fieldErrors.password}
            />

            <FormInput
              label={t("resetPassword.confirmPasswordLabel")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={fieldErrors.confirmPassword}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? t("resetPassword.submitting") : t("resetPassword.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-jz-white-400">
            <Link href="/login" className="text-jz-yellow-400 hover:underline">
              {t("resetPassword.backToLogin")}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
