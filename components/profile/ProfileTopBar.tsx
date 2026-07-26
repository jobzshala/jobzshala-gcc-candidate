import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CandidateProfile } from "@/lib/api/candidate";
import { sendEmailVerificationOtp, confirmEmailVerificationOtp } from "@/lib/api/candidate";
import { ApiError } from "@/lib/api/client";
import CompletionRing from "@/components/ui/CompletionRing";
import VerifiedBadge from "@/components/profile/VerifiedBadge";

type ProfileTopBarProps = {
  profile: CandidateProfile;
  completionPercent?: number;
};

type VerifyStage = "idle" | "sending" | "otp" | "confirming";

export default function ProfileTopBar({ profile, completionPercent }: ProfileTopBarProps) {
  const { t } = useTranslation();

  const [emailVerified, setEmailVerified] = useState(profile.is_email_verified);
  const [verifyStage, setVerifyStage] = useState<VerifyStage>("idle");
  const [otp, setOtp] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyNotice, setVerifyNotice] = useState("");

  const locationLine = [profile.city?.name, profile.current_country?.name].filter(Boolean).join(", ");

  const handleSendOtp = async () => {
    setVerifyError("");
    setVerifyNotice("");
    setVerifyStage("sending");
    try {
      await sendEmailVerificationOtp();
      setVerifyStage("otp");
      setVerifyNotice("Verification code sent to your email.");
    } catch (err) {
      setVerifyError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setVerifyStage("idle");
    }
  };

  const handleConfirmOtp = async () => {
    setVerifyError("");
    setVerifyStage("confirming");
    try {
      await confirmEmailVerificationOtp(otp);
      setEmailVerified(true);
      setVerifyStage("idle");
      setOtp("");
      setVerifyNotice("");
    } catch (err) {
      setVerifyError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setVerifyStage("otp");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#22C55E]/60 to-[#14532d]/85 shadow-lg shadow-black/30 backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[#8FD13F]/20 blur-3xl" />
      <div className="pointer-events-none absolute -inset-y-10 -left-1/4 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {completionPercent !== undefined ? (
            <div className="relative shrink-0">
              <CompletionRing percent={completionPercent} size={64} strokeWidth={5} />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-2xl font-semibold text-white">
              {profile.full_name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="font-serif text-xl font-semibold text-white sm:text-2xl">{profile.full_name}</h1>
            <div className="mt-1 flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
              {profile.mobile_number && (
                <span className="inline-flex items-center gap-1.5">
                  {profile.mobile_number}
                  <VerifiedBadge
                    verified={profile.is_mobile_verified}
                    label={profile.is_mobile_verified ? t("profile.personalDetails.verifiedLabel") : t("profile.personalDetails.notVerifiedLabel")}
                  />
                </span>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1.5">
                  {profile.email}
                  <VerifiedBadge
                    verified={emailVerified}
                    label={emailVerified ? t("profile.personalDetails.verifiedLabel") : t("profile.personalDetails.notVerifiedLabel")}
                  />
                  {!emailVerified && verifyStage === "idle" && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-medium text-white underline underline-offset-2 hover:opacity-80"
                    >
                      Send verification email
                    </button>
                  )}
                  {!emailVerified && verifyStage === "sending" && (
                    <span className="text-xs text-white/60">Sending…</span>
                  )}
                </span>
              )}
            </div>

            {!emailVerified && (verifyStage === "otp" || verifyStage === "confirming") && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  className="w-28 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  disabled={otp.length !== 6 || verifyStage === "confirming"}
                  className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#166534] disabled:opacity-50"
                >
                  {verifyStage === "confirming" ? "Verifying…" : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs font-medium text-white/70 underline underline-offset-2 hover:opacity-80"
                >
                  Resend
                </button>
              </div>
            )}
            {verifyNotice && <p className="mt-1 text-xs text-white/70">{verifyNotice}</p>}
            {verifyError && <p className="mt-1 text-xs text-red-200">{verifyError}</p>}

            {locationLine && <p className="mt-0.5 text-xs text-white/50">{locationLine}</p>}
            {completionPercent !== undefined && (
              <p className="mt-1 text-xs font-semibold text-white">{completionPercent}% profile complete</p>
            )}
          </div>
        </div>

        {profile.job_title?.name && (
          <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 sm:text-right">
            <p className="text-xs text-white/50">{t("profile.careerPreference.jobTitleLabel")}</p>
            <p className="mt-0.5 text-sm font-medium text-white">{profile.job_title.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
