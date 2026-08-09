import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { CandidateProfile } from "@/lib/api/candidate";
import { sendEmailVerificationOtp, confirmEmailVerificationOtp } from "@/lib/api/candidate";
import { ApiError } from "@/lib/api/client";
import VerifiedBadge from "@/components/profile/VerifiedBadge";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import CompletionRing from "@/components/ui/CompletionRing";
import { ShieldCheckIcon, PhoneIcon, MailIcon, PinIcon } from "@/components/ui/icons";

type ProfileTopBarProps = {
  profile: CandidateProfile;
  completionPercent?: number;
  onImageChange?: (imageUrl: string | null) => void;
};

type VerifyStage = "idle" | "sending" | "otp" | "confirming";

export default function ProfileTopBar({ profile, completionPercent, onImageChange }: ProfileTopBarProps) {
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState(profile.profile_image_url);
  const [emailVerified, setEmailVerified] = useState(profile.is_email_verified);
  const [verifyStage, setVerifyStage] = useState<VerifyStage>("idle");
  const [otp, setOtp] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyNotice, setVerifyNotice] = useState("");

  const locationLine = [profile.city?.name, profile.current_country?.name].filter(Boolean).join(", ");
  const ageGenderLine = [
    profile.age !== null ? `${profile.age} Years` : null,
    profile.gender ? profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase() : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const percent = completionPercent ?? 0;
  const message =
    percent >= 80
      ? "Great! Complete the remaining steps to increase your chances of getting hired."
      : percent >= 40
        ? "Good progress — keep going to stand out to employers."
        : "Let's get your profile started so employers can find you.";

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
    <div className="hero">
      <div className="hero-row">
        <ProfileImageUploader
          fullName={profile.full_name}
          gender={profile.gender}
          imageUrl={imageUrl}
          onChange={(next) => {
            setImageUrl(next);
            onImageChange?.(next);
          }}
        />

        <div className="hero-id">
          <div className="row1">
            <h2>{profile.full_name}</h2>
            {profile.kyc_status === "VERIFIED" && (
              <span className="verified-pill">
                <ShieldCheckIcon className="icon" />
                Verified
              </span>
            )}
          </div>
          <div className="wid">Candidate ID: {profile.workforce_id ?? `JZ-${profile.id}`}</div>
          <div className="contact-line">
            {profile.mobile_number && (
              <span>
                <PhoneIcon className="icon" />
                {profile.mobile_number}
                <VerifiedBadge
                  verified={profile.is_mobile_verified}
                  label={profile.is_mobile_verified ? t("profile.personalDetails.verifiedLabel") : t("profile.personalDetails.notVerifiedLabel")}
                />
              </span>
            )}
            {profile.email && (
              <span>
                <MailIcon className="icon" />
                {profile.email}
                <VerifiedBadge
                  verified={emailVerified}
                  label={emailVerified ? t("profile.personalDetails.verifiedLabel") : t("profile.personalDetails.notVerifiedLabel")}
                />
                {!emailVerified && verifyStage === "idle" && (
                  <button type="button" onClick={handleSendOtp} className="text-xs font-medium underline underline-offset-2 hover:opacity-80">
                    Send verification email
                  </button>
                )}
                {!emailVerified && verifyStage === "sending" && <span className="text-xs opacity-70">Sending…</span>}
              </span>
            )}
          </div>
          {!emailVerified && (verifyStage === "otp" || verifyStage === "confirming") && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
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
                className="btn-white"
                style={{ opacity: otp.length !== 6 || verifyStage === "confirming" ? 0.6 : 1 }}
              >
                {verifyStage === "confirming" ? "Verifying…" : "Confirm"}
              </button>
              <button type="button" onClick={handleSendOtp} className="text-xs font-medium underline underline-offset-2 opacity-80 hover:opacity-100">
                Resend
              </button>
            </div>
          )}
          {verifyNotice && <p className="mt-1 text-xs opacity-80">{verifyNotice}</p>}
          {verifyError && <p className="mt-1 text-xs text-red-200">{verifyError}</p>}

          <div className="contact-line" style={{ marginBottom: 0 }}>
            {locationLine && (
              <span>
                <PinIcon className="icon" />
                {locationLine}
              </span>
            )}
            {ageGenderLine && <span>{ageGenderLine}</span>}
          </div>
        </div>

        <div className="hero-side">
          <div className="relative" style={{ width: 76, height: 76 }}>
            <CompletionRing percent={percent} size={76} strokeWidth={8} trackColor="rgba(255,255,255,.25)" ringColor="#fff" />
            <span
              className="absolute inset-0 flex items-center justify-center font-serif text-lg font-bold"
              style={{ color: "#fff" }}
            >
              {percent}%
            </span>
          </div>
          <div>
            <div className="msg">{message}</div>
            <Link href="/profile" className="btn-white">
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
