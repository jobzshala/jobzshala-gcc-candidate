"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Checkbox from "@/components/ui/Checkbox";
import { GoogleIcon, ShieldCheckIcon, WhatsAppIcon } from "@/components/ui/icons";
import { registerCandidate, sendRegistrationOtp, verifyRegistrationOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const MOBILE_PATTERN = /^[0-9]{10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type Step = "select" | "form" | "otp" | "done";

export default function RegisterPage() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("select");
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    mobile_number: "",
    email: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialNotice, setSocialNotice] = useState("");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");

  const genderOptions = [
    { value: "MALE", label: t("register.genderOptions.male") },
    { value: "FEMALE", label: t("register.genderOptions.female") },
    { value: "OTHER", label: t("register.genderOptions.other") },
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFieldErrors((prev) => ({ ...prev, resume: "" }));

    if (!file) {
      setResumeName("");
      return;
    }
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, resume: t("register.errors.resumeUnsupported") }));
      e.target.value = "";
      setResumeName("");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setFieldErrors((prev) => ({ ...prev, resume: t("register.errors.resumeTooLarge") }));
      e.target.value = "";
      setResumeName("");
      return;
    }
    setResumeName(file.name);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      errors.full_name = t("register.errors.fullName");
    }
    const ageNum = Number(form.age);
    if (!form.age || ageNum < 18 || ageNum > 60) {
      errors.age = t("register.errors.age");
    }
    if (!form.gender) {
      errors.gender = t("register.errors.gender");
    }
    if (!MOBILE_PATTERN.test(form.mobile_number)) {
      errors.mobile_number = t("register.errors.mobile");
    }
    if (!EMAIL_PATTERN.test(form.email)) {
      errors.email = t("register.errors.email");
    }
    if (!acceptedTerms) {
      errors.acceptedTerms = t("register.errors.acceptTerms");
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await sendRegistrationOtp({
        full_name: form.full_name.trim(),
        age: ageNum,
        gender: form.gender as "MALE" | "FEMALE" | "OTHER",
        mobile_number: form.mobile_number,
        email: form.email.trim(),
      });
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("register.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const completeRegistration = async (verifyToken: string) => {
    const formData = new FormData();
    formData.set("full_name", form.full_name.trim());
    formData.set("age", form.age);
    formData.set("gender", form.gender);
    formData.set("mobile_number", form.mobile_number);
    formData.set("email", form.email.trim());
    formData.set("source", "WEBSITE");
    formData.set("otp_token", verifyToken);
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.set("resume", file);
    }

    await registerCandidate(formData);
    setStep("done");
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpNotice("");

    if (!/^[0-9]{6}$/.test(otp)) {
      setOtpError(t("register.errors.invalidOtp"));
      return;
    }

    setOtpSubmitting(true);
    try {
      const { verifyToken } = await verifyRegistrationOtp(form.email.trim(), otp);
      await completeRegistration(verifyToken);
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : t("register.errors.generic"));
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtpNotice("");
    try {
      await sendRegistrationOtp({
        full_name: form.full_name.trim(),
        age: Number(form.age),
        gender: form.gender as "MALE" | "FEMALE" | "OTHER",
        mobile_number: form.mobile_number,
        email: form.email.trim(),
      });
      setOtpNotice(t("register.otpResendSent"));
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : t("register.errors.generic"));
    }
  };

  const handleSocialClick = (provider: string) => {
    setSocialNotice(t("register.socialComingSoon", { provider }));
  };

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex-1">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-10 lg:px-10 lg:py-20">
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-jz-border bg-gradient-to-br from-jz-blue-900 to-jz-blue-950 p-8 lg:p-12">
            <p className="text-xs font-semibold tracking-widest text-jz-yellow-400 uppercase">Jobzshala</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-jz-white-50 lg:text-4xl">
              {t("register.brandHeading")}
            </h1>
            <p className="mt-4 text-jz-white-200">{t("register.brandSubheading")}</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-jz-white-400">
              <ShieldCheckIcon className="size-6" />
              {t("register.brandTrustBadges")}
            </div>
          </div>

          <div className="w-full rounded-2xl border border-jz-border bg-jz-blue-900/40 p-8">
            {step === "select" && (
              <div className="flex flex-col items-center py-6 text-center">
                <h2 className="font-serif text-2xl font-semibold text-jz-white-50">{t("register.roleSelectHeading")}</h2>
                <div className="mt-8 w-full max-w-sm rounded-2xl border border-jz-border bg-jz-blue-900/60 p-6">
                  <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("register.roleCardTitle")}</h3>
                  <p className="mt-2 text-sm text-jz-white-400">{t("register.roleCardSubtitle")}</p>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-blue-800 transition-opacity hover:opacity-90"
                  >
                    {t("register.roleCardButton")}
                  </button>
                </div>
                <a href="/employer/register" className="mt-6 text-sm text-jz-yellow-400 hover:underline">
                  {t("register.roleEmployerHref")}
                </a>
              </div>
            )}

            {step === "form" && (
              <>
                <h2 className="font-serif text-2xl font-semibold text-jz-white-50">{t("register.title")}</h2>
                <p className="mt-2 text-sm text-jz-white-400">{t("register.subtitle")}</p>

                <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                      {error}
                    </div>
                  )}

                  <FormInput
                    label={t("register.fullNameLabel")}
                    value={form.full_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder={t("register.fullNamePlaceholder")}
                    error={fieldErrors.full_name}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label={t("register.ageLabel")}
                      value={form.age}
                      onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                      placeholder={t("register.agePlaceholder")}
                      inputMode="numeric"
                      error={fieldErrors.age}
                    />
                    <FormSelect
                      label={t("register.genderLabel")}
                      value={form.gender}
                      onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                      placeholder={t("register.genderPlaceholder")}
                      options={genderOptions}
                      error={fieldErrors.gender}
                    />
                  </div>

                  <FormInput
                    label={t("register.mobileLabel")}
                    value={form.mobile_number}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, mobile_number: e.target.value.replace(/\D/g, "").slice(0, 10) }))
                    }
                    placeholder={t("register.mobilePlaceholder")}
                    inputMode="numeric"
                    error={fieldErrors.mobile_number}
                  />

                  <FormInput
                    label={t("register.emailLabel")}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder={t("register.emailPlaceholder")}
                    hint={t("register.emailHint")}
                    error={fieldErrors.email}
                  />

                  <div>
                    <label className="mb-1.5 block text-sm text-jz-white-200">{t("register.resumeLabel")}</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-jz-white-400 file:mr-3 file:rounded-lg file:border-0 file:bg-jz-blue-800 file:px-3.5 file:py-2 file:text-sm file:text-jz-white-100"
                    />
                    {fieldErrors.resume ? (
                      <p className="mt-1 text-xs text-jz-red-600">{fieldErrors.resume}</p>
                    ) : (
                      <p className="mt-1 text-xs text-jz-white-600">{resumeName || t("register.resumeHint")}</p>
                    )}
                  </div>

                  <div>
                    <Checkbox
                      label={t("register.acceptTerms")}
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    {fieldErrors.acceptedTerms && <p className="mt-1 text-xs text-jz-red-600">{fieldErrors.acceptedTerms}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-blue-800 transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? t("register.submitting") : t("register.submit")}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-jz-border" />
                  <span className="text-xs text-jz-white-600">{t("register.divider")}</span>
                  <div className="h-px flex-1 bg-jz-border" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleSocialClick("Google")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 transition-opacity hover:opacity-90"
                  >
                    <GoogleIcon className="size-4.5" />
                    {t("register.continueWithGoogle")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialClick("WhatsApp")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 transition-opacity hover:opacity-90"
                  >
                    <WhatsAppIcon className="size-4.5" />
                    {t("register.continueWithWhatsApp")}
                  </button>
                </div>
                {socialNotice && <p className="mt-3 text-center text-xs text-jz-white-600">{socialNotice}</p>}

                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-sm text-jz-white-400">{t("register.haveAccount")}</p>
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm font-semibold text-jz-white-100 transition-opacity hover:opacity-90"
                  >
                    {t("register.loginLink")}
                  </Link>
                </div>
              </>
            )}

            {step === "otp" && (
              <div className="text-center">
                <h2 className="font-serif text-2xl font-semibold text-jz-white-50">{t("register.otpTitle")}</h2>
                <p className="mt-2 text-sm text-jz-white-400">
                  {t("register.otpSubtitle", { email: form.email.trim() })}
                </p>

                <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4 text-left">
                  {otpError && (
                    <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                      {otpError}
                    </div>
                  )}
                  {otpNotice && (
                    <div className="rounded-lg border border-jz-green-500/40 bg-jz-green-500/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                      {otpNotice}
                    </div>
                  )}

                  <FormInput
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder={t("register.otpPlaceholder")}
                    inputMode="numeric"
                    className="text-center tracking-[0.5em]"
                  />

                  <button
                    type="submit"
                    disabled={otpSubmitting}
                    className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-blue-800 transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {otpSubmitting ? t("register.otpSubmitting") : t("register.otpSubmit")}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="mt-4 text-sm text-jz-yellow-400 hover:underline"
                >
                  {t("register.otpResend")}
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="py-6 text-center">
                <div className="mb-4 rounded-lg border border-jz-green-500/40 bg-jz-green-500/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                  {t("register.successToast")}
                </div>
                <h2 className="font-serif text-2xl font-semibold text-jz-white-50">{t("register.doneTitle")}</h2>
                <p className="mt-3 text-sm text-jz-white-400">{t("register.doneBody", { email: form.email.trim() })}</p>
                <p className="mt-2 text-xs text-jz-white-600">{t("register.doneNote")}</p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-5 py-2.5 text-sm font-semibold text-jz-blue-800"
                >
                  {t("register.goToLogin")}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-jz-border">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-4 py-6 text-center sm:px-6 lg:px-10">
            <p className="text-sm text-jz-white-400">{t("register.footerTagline")}</p>
            <p className="text-xs text-jz-white-600">{t("register.footerBadges")}</p>
            <p className="text-xs text-jz-white-600">
              {t("register.needHelp")}{" "}
              <a href="#" className="text-jz-yellow-400 hover:underline">
                {t("register.contactSupport")}
              </a>{" "}
              ·{" "}
              <a href="#" className="text-jz-yellow-400 hover:underline">
                {t("register.talkToRecruiter")}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
