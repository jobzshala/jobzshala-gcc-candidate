"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TabsNav, { type TabItem } from "@/components/ui/TabsNav";
import { RewardSidePanel } from "@/components/profile/RewardPanel";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import ProfileViewSummary from "@/components/profile/ProfileViewSummary";
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

type TabKey =
  | "personal"
  | "career"
  | "summary"
  | "employment"
  | "education"
  | "languages"
  | "resume"
  | "video"
  | "documents";

const TAB_HASH_IDS: Record<TabKey, string> = {
  personal: "personal-details",
  career: "career-preference",
  summary: "profile-summary",
  employment: "employment",
  education: "education",
  languages: "languages",
  resume: "resume",
  video: "video",
  documents: "documents",
};

interface ProfileTabbedFormProps {
  profile: CandidateProfile;
  completionCounts: CompletionCounts;
  completionPercent: number;
  refreshProfile: () => Promise<void>;
  onImageChange: (profileImageUrl: string | null) => void;
  onEmploymentCountChange: (count: number) => void;
  onEducationCountChange: (count: number) => void;
  onLanguagesCountChange: (count: number) => void;
  onDocumentsCountChange: (count: number) => void;
}

export default function ProfileTabbedForm({
  profile,
  completionCounts,
  completionPercent,
  refreshProfile,
  onImageChange,
  onEmploymentCountChange,
  onEducationCountChange,
  onLanguagesCountChange,
  onDocumentsCountChange,
}: ProfileTabbedFormProps) {
  const { t } = useTranslation();
  // Deep links from elsewhere (e.g. the dashboard overview's quick links)
  // point at a #hash matching one of TAB_HASH_IDS — land directly in edit
  // mode on that tab instead of the view summary below. Only ever mounts
  // client-side (the parent page gates on the device-tier hook resolving
  // first), so reading window.location.hash here can't cause an SSR/
  // hydration mismatch.
  const hashTab = (() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    return (Object.keys(TAB_HASH_IDS) as TabKey[]).find((key) => TAB_HASH_IDS[key] === hash);
  })();
  const [activeTab, setActiveTab] = useState<TabKey>(hashTab ?? "personal");
  // View mode shows real field values in read-only cards (matching the
  // /dashboard overview); edit mode is the pre-existing tabs form below.
  // A direct #hash deep link skips straight to edit mode on that tab.
  const [mode, setMode] = useState<"view" | "edit">(hashTab ? "edit" : "view");

  const goToTab = (tab: TabKey) => {
    setActiveTab(tab);
    setMode("edit");
  };

  const completion = useMemo(
    () => getProfileCompletion({ profile, ...completionCounts }),
    [profile, completionCounts]
  );

  const tabs: TabItem<TabKey>[] = (Object.keys(TAB_HASH_IDS) as TabKey[]).map((key) => ({
    key,
    label: t(`profile.tabs.labels.${key}`),
    done: isStepDone(completion.items, TAB_HASH_IDS[key]),
  }));

  return (
    <>
      <ProfileTopBar profile={profile} completionPercent={completionPercent} onImageChange={onImageChange} />

      {mode === "view" ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <ProfileViewSummary profile={profile} onSaved={refreshProfile} onEditTab={goToTab} />
          </div>
          <RewardSidePanel className="lg:sticky lg:top-24 lg:w-64" />
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMode("view")}
            className="mb-4 text-sm font-medium"
            style={{ color: "var(--ink-soft)" }}
          >
            ← Back to profile overview
          </button>

          <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="card min-w-0 flex-1" style={{ padding: "24px" }}>
              {activeTab === "personal" && <PersonalDetailsStep profile={profile} onSaved={refreshProfile} />}
              {activeTab === "career" && <CareerPreferenceStep profile={profile} onSaved={refreshProfile} />}
              {activeTab === "summary" && <ProfileSummaryStep profile={profile} onSaved={refreshProfile} />}
              {activeTab === "employment" && <EmploymentSection onCountChange={onEmploymentCountChange} />}
              {activeTab === "education" && <EducationSection onCountChange={onEducationCountChange} />}
              {activeTab === "languages" && <LanguagesSection onCountChange={onLanguagesCountChange} />}
              {activeTab === "resume" && (
                <ResumeSection
                  profile={profile}
                  onProfileRefresh={refreshProfile}
                  onEmploymentCountChange={onEmploymentCountChange}
                  onEducationCountChange={onEducationCountChange}
                  onLanguagesCountChange={onLanguagesCountChange}
                  onDocumentsCountChange={onDocumentsCountChange}
                />
              )}
              {activeTab === "video" && <VideoSection />}
              {activeTab === "documents" && <DocumentsSection onCountChange={onDocumentsCountChange} />}
            </div>

            <RewardSidePanel className="lg:sticky lg:top-24 lg:w-64" />
          </div>
        </>
      )}
    </>
  );
}
