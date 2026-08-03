"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import WizardProgressDots from "@/components/ui/WizardProgressDots";
import { RewardBanner } from "@/components/profile/RewardPanel";
import PersonalDetailsStep from "@/components/profile/steps/PersonalDetailsStep";
import ProfileSummaryStep from "@/components/profile/steps/ProfileSummaryStep";
import CareerPreferenceStep from "@/components/profile/steps/CareerPreferenceStep";
import EmploymentSection from "@/components/profile/EmploymentSection";
import EducationSection from "@/components/profile/EducationSection";
import LanguagesSection from "@/components/profile/LanguagesSection";
import ResumeSection from "@/components/profile/ResumeSection";
import VideoSection from "@/components/profile/VideoSection";
import DocumentsSection from "@/components/profile/DocumentsSection";
import { getProfileCompletion, isStepDone } from "@/lib/profileCompletion";
import type { CandidateProfile } from "@/lib/api/candidate";
import type { CompletionCounts } from "@/lib/hooks/useCandidateProfileData";

type StepKey =
  | "personal"
  | "summary"
  | "career"
  | "employment"
  | "education"
  | "languages"
  | "resume"
  | "video"
  | "documents";

// hashId matches the `id="..."` every section already uses (shared with the
// tabs shell and with isStepDone's #hash grouping) — one source of truth for
// "which section is this" across all three shells.
const STEPS: { key: StepKey; hashId: string; titleKey: string; subtitleKey: string; formSubmitIsContinue: boolean }[] = [
  { key: "personal", hashId: "personal-details", titleKey: "profile.wizard.steps.personal.title", subtitleKey: "profile.wizard.steps.personal.subtitle", formSubmitIsContinue: true },
  { key: "career", hashId: "career-preference", titleKey: "profile.wizard.steps.career.title", subtitleKey: "profile.wizard.steps.career.subtitle", formSubmitIsContinue: true },
  { key: "summary", hashId: "profile-summary", titleKey: "profile.wizard.steps.summary.title", subtitleKey: "profile.wizard.steps.summary.subtitle", formSubmitIsContinue: true },
  { key: "employment", hashId: "employment", titleKey: "profile.wizard.steps.employment.title", subtitleKey: "profile.wizard.steps.employment.subtitle", formSubmitIsContinue: false },
  { key: "education", hashId: "education", titleKey: "profile.wizard.steps.education.title", subtitleKey: "profile.wizard.steps.education.subtitle", formSubmitIsContinue: false },
  { key: "languages", hashId: "languages", titleKey: "profile.wizard.steps.languages.title", subtitleKey: "profile.wizard.steps.languages.subtitle", formSubmitIsContinue: false },
  { key: "resume", hashId: "resume", titleKey: "profile.wizard.steps.resume.title", subtitleKey: "profile.wizard.steps.resume.subtitle", formSubmitIsContinue: false },
  { key: "video", hashId: "video", titleKey: "profile.wizard.steps.video.title", subtitleKey: "profile.wizard.steps.video.subtitle", formSubmitIsContinue: false },
  { key: "documents", hashId: "documents", titleKey: "profile.wizard.steps.documents.title", subtitleKey: "profile.wizard.steps.documents.subtitle", formSubmitIsContinue: false },
];

interface ProfileWizardProps {
  profile: CandidateProfile;
  completionCounts: CompletionCounts;
  refreshProfile: () => Promise<void>;
  onEmploymentCountChange: (count: number) => void;
  onEducationCountChange: (count: number) => void;
  onLanguagesCountChange: (count: number) => void;
  onDocumentsCountChange: (count: number) => void;
}

export default function ProfileWizard({
  profile,
  completionCounts,
  refreshProfile,
  onEmploymentCountChange,
  onEducationCountChange,
  onLanguagesCountChange,
  onDocumentsCountChange,
}: ProfileWizardProps) {
  const { t } = useTranslation();
  // Same deep-link handling as the tabs shell — land on the step matching
  // window.location.hash instead of always starting at step 1.
  const [currentIndex, setCurrentIndex] = useState(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    const index = STEPS.findIndex((s) => s.hashId === hash);
    return index >= 0 ? index : 0;
  });

  const completion = useMemo(
    () => getProfileCompletion({ profile, ...completionCounts }),
    [profile, completionCounts]
  );

  const doneIndexes = useMemo(
    () => new Set(STEPS.map((s, i) => (isStepDone(completion.items, s.hashId) ? i : -1)).filter((i) => i >= 0)),
    [completion.items]
  );

  const step = STEPS[currentIndex];
  const isLast = currentIndex === STEPS.length - 1;

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const handleFormSaved = async () => {
    await refreshProfile();
    goNext();
  };

  return (
    <div className="mx-auto max-w-[480px] px-4 py-6">
      <WizardProgressDots total={STEPS.length} currentIndex={currentIndex} doneIndexes={doneIndexes} className="mb-4" />
      <p className="mb-1 text-xs font-medium text-jz-yellow-400">
        {t("profile.wizard.stepOf", { current: currentIndex + 1, total: STEPS.length })}
      </p>
      <h1 className="font-serif text-xl font-semibold text-jz-white-50">{t(step.titleKey)}</h1>
      <p className="mt-1 text-sm text-jz-white-400">{t(step.subtitleKey)}</p>

      <div className="mt-5">
        {step.key === "personal" && <PersonalDetailsStep profile={profile} onSaved={handleFormSaved} saveLabel={t("profile.wizard.continue")} compact />}
        {step.key === "career" && <CareerPreferenceStep profile={profile} onSaved={handleFormSaved} saveLabel={t("profile.wizard.continue")} compact />}
        {step.key === "summary" && <ProfileSummaryStep profile={profile} onSaved={handleFormSaved} saveLabel={t("profile.wizard.continue")} />}
        {step.key === "employment" && <EmploymentSection onCountChange={onEmploymentCountChange} />}
        {step.key === "education" && <EducationSection onCountChange={onEducationCountChange} />}
        {step.key === "languages" && <LanguagesSection onCountChange={onLanguagesCountChange} />}
        {step.key === "resume" && (
          <ResumeSection
            profile={profile}
            onProfileRefresh={refreshProfile}
            onEmploymentCountChange={onEmploymentCountChange}
            onEducationCountChange={onEducationCountChange}
            onLanguagesCountChange={onLanguagesCountChange}
            onDocumentsCountChange={onDocumentsCountChange}
          />
        )}
        {step.key === "video" && <VideoSection />}
        {step.key === "documents" && <DocumentsSection onCountChange={onDocumentsCountChange} />}
      </div>

      <div className="mt-5">
        <RewardBanner />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button type="button" onClick={goBack} className="text-sm text-jz-white-400 hover:text-jz-white-100">
              {t("profile.wizard.back")}
            </button>
          )}
          <button type="button" onClick={goNext} className="text-sm text-jz-white-400 hover:text-jz-white-100">
            {isLast ? t("profile.wizard.done") : t("profile.wizard.skip")}
          </button>
        </div>

        {/* List-based steps have no single "submit = continue" action (the
            candidate might add zero, one, or several entries), so they get
            an explicit Continue button here. The three single-form steps
            already advance via their own submit button (handleFormSaved). */}
        {!step.formSubmitIsContinue && !isLast && (
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-5 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
          >
            {t("profile.wizard.continue")}
          </button>
        )}
      </div>
    </div>
  );
}
