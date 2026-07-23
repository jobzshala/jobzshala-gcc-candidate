"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import FormInput from "@/components/ui/FormInput";
import { changePassword, logout } from "@/lib/api/auth";
import { saveSession, isSessionPersisted, clearSession as clearRawSession } from "@/lib/auth/session";
import { setSession, clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ApiError } from "@/lib/api/client";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session.accessToken) {
      window.location.href = "/login";
    }
  }, [session.accessToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!oldPassword) {
      errors.oldPassword = t("changePassword.errors.oldPassword");
    }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      errors.newPassword = t("changePassword.errors.newPassword");
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = t("changePassword.errors.confirmPassword");
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await changePassword({ oldPassword, newPassword, confirmPassword });
      // The backend revoked every old session and issued a fresh token pair —
      // swap it in (raw storage + Redux, see app/login/page.tsx) and move on
      // to the profile the first-login flow was gating.
      saveSession(result, isSessionPersisted());
      dispatch(setSession(result));
      window.location.href = "/dashboard/profile";
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors ?? {});
        setError(err.message);
      } else {
        setError(t("changePassword.errors.generic"));
      }
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (session.refreshToken) {
      try {
        await logout(session.refreshToken);
      } catch {
        // Best-effort — the session is being cleared locally either way.
      }
    }
    clearRawSession();
    dispatch(clearReduxSession());
    window.location.href = "/login";
  };

  if (!session.accessToken || !session.candidate) {
    // Genuinely logged out — the redirect effect above is already firing.
    return null;
  }

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
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50">{t("changePassword.title")}</h1>
          <p className="mt-2 text-sm text-jz-white-400">
            {t("changePassword.subtitle", { email: session.candidate.email })}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                {error}
              </div>
            )}

            <FormInput
              label={t("changePassword.oldPasswordLabel")}
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              hint={t("changePassword.oldPasswordHint")}
              error={fieldErrors.oldPassword}
            />

            <FormInput
              label={t("changePassword.newPasswordLabel")}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              hint={t("changePassword.newPasswordHint")}
              error={fieldErrors.newPassword}
            />

            <FormInput
              label={t("changePassword.confirmPasswordLabel")}
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
              {submitting ? t("changePassword.submitting") : t("changePassword.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-jz-white-400">
            <button type="button" onClick={handleLogout} className="text-jz-yellow-400 hover:underline">
              {t("changePassword.logout")}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
