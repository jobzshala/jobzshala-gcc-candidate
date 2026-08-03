"use client";

import { useTranslation } from "react-i18next";
import ProfileWizard from "@/components/profile/wizard/ProfileWizard";
import ProfileTabbedForm from "@/components/profile/tabs/ProfileTabbedForm";
import SmartUploadLanding from "@/components/profile/SmartUploadLanding";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { useCandidateProfileData } from "@/lib/hooks/useCandidateProfileData";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useEffect, useState } from "react";

// Below this completion percentage the profile is "mostly empty" — a fresh
// candidate straight out of registration sits at 0% (full_name/mobile_number
// aren't completion items), so this comfortably covers "just registered"
// while still retiring itself once a candidate has meaningfully started
// filling things in by hand.
const SMART_UPLOAD_THRESHOLD_PERCENT = 25;

const smartUploadDismissedKey = (candidateId: number) => `jobzshala-smart-upload-dismissed:${candidateId}`;

export default function ProfilePage() {
  const { t } = useTranslation();
  const deviceTier = useDeviceTier();
  // Defaults to "dismissed" so returning candidates never see a flash of the
  // landing screen before localStorage is checked — mirrors useDeviceTier's
  // own "unknown until measured" caution above.
  const [smartUploadDismissed, setSmartUploadDismissed] = useState(true);

  const {
    profile,
    setProfile,
    loading,
    loadError,
    completionCounts,
    loadProfile,
    refreshProfile,
    onEmploymentCountChange,
    onEducationCountChange,
    onLanguagesCountChange,
    onDocumentsCountChange,
  } = useCandidateProfileData();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reads the per-candidate dismissal flag once the profile (and so its id)
  // is known — a fresh candidate who's never dismissed it gets smartUploadDismissed
  // flipped to false here, which is what actually lets the landing screen show.
  useEffect(() => {
    if (!profile) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSmartUploadDismissed(window.localStorage.getItem(smartUploadDismissedKey(profile.id)) === "1");
    } catch {
      // Storage unavailable (private browsing, etc.) — fall back to always
      // dismissed rather than risk showing the landing on every visit.
    }
  }, [profile?.id]);

  const dismissSmartUpload = () => {
    if (profile) {
      try {
        window.localStorage.setItem(smartUploadDismissedKey(profile.id), "1");
      } catch {
        // Non-fatal — worst case the landing reappears next visit.
      }
    }
    setSmartUploadDismissed(true);
  };

  const handleImageChange = (profile_image_url: string | null) =>
    setProfile((current) => (current ? { ...current, profile_image_url } : current));

  // Skeleton until both the data and the device tier are known — avoids
  // mounting the wrong shell for a beat (deviceTier is null until
  // matchMedia can run client-side) and matches the old page's loading copy.
  if (loading || deviceTier === null) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.title")}</h1>
        <p className="mt-2 text-sm text-jz-white-400">{t("profile.subtitle")}</p>
        <p className="mt-10 text-sm text-jz-white-400">{t("profile.loading")}</p>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.title")}</h1>
        <p className="mt-2 text-sm text-jz-white-400">{t("profile.subtitle")}</p>
        <div className="mt-10 rounded-2xl border border-jz-red-600/40 bg-jz-red-600/10 p-6 text-center">
          <p className="text-sm text-jz-white-100">{t("profile.loadError")}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="mt-3 rounded-xl border border-jz-white-600 px-4 py-2 text-sm text-jz-white-100 hover:opacity-90"
          >
            {t("profile.retry")}
          </button>
        </div>
      </div>
    );
  }

  const completion = getProfileCompletion({ profile, ...completionCounts });

  // The new Smart Upload first screen — one shared build across every device
  // tier (see SmartUploadLanding.tsx), shown ahead of both the mobile wizard
  // and tablet/desktop tabs shells below, and only while the profile still
  // has next to nothing in it. Skipping or finishing the review both dismiss
  // it for this candidate (persisted so it doesn't reappear on refresh).
  if (!smartUploadDismissed && completion.percent < SMART_UPLOAD_THRESHOLD_PERCENT) {
    return (
      <SmartUploadLanding
        profile={profile}
        refreshProfile={refreshProfile}
        onEmploymentCountChange={onEmploymentCountChange}
        onEducationCountChange={onEducationCountChange}
        onLanguagesCountChange={onLanguagesCountChange}
        onDocumentsCountChange={onDocumentsCountChange}
        onSkip={dismissSmartUpload}
        onDone={dismissSmartUpload}
      />
    );
  }

  if (deviceTier === "mobile") {
    return (
      <ProfileWizard
        profile={profile}
        completionCounts={completionCounts}
        refreshProfile={refreshProfile}
        onEmploymentCountChange={onEmploymentCountChange}
        onEducationCountChange={onEducationCountChange}
        onLanguagesCountChange={onLanguagesCountChange}
        onDocumentsCountChange={onDocumentsCountChange}
      />
    );
  }

  return (
    <ProfileTabbedForm
      profile={profile}
      completionCounts={completionCounts}
      completionPercent={completion.percent}
      refreshProfile={refreshProfile}
      onImageChange={handleImageChange}
      onEmploymentCountChange={onEmploymentCountChange}
      onEducationCountChange={onEducationCountChange}
      onLanguagesCountChange={onLanguagesCountChange}
      onDocumentsCountChange={onDocumentsCountChange}
    />
  );
}
