"use client";

import { useState } from "react";
import {
  getProfile,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getSkills,
  getDocuments,
  type CandidateProfile,
} from "@/lib/api/candidate";

export interface CompletionCounts {
  employmentCount: number;
  educationCount: number;
  languagesCount: number;
  skillsCount: number;
  documentsCount: number;
}

// Extracted from the old single-shell page.tsx's load() so both the mobile
// wizard and the tablet/desktop tabs shell share one fetch instead of each
// running its own copy of the same five requests.
export function useCandidateProfileData() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [completionCounts, setCompletionCounts] = useState<CompletionCounts>({
    employmentCount: 0,
    educationCount: 0,
    languagesCount: 0,
    skillsCount: 0,
    documentsCount: 0,
  });

  const loadProfile = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employment, education, languages, skills, documents] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getSkills(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setCompletionCounts({
        employmentCount: employment.length,
        educationCount: education.length,
        languagesCount: languages.length,
        skillsCount: skills.length,
        documentsCount: documents.length,
      });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setProfile(await getProfile());
    } catch {
      // Keep showing the last known-good profile — the save itself already
      // succeeded, this is just the follow-up read.
    }
  };

  // Wired into EmploymentSection/EducationSection/LanguagesSection/
  // DocumentsSection's onCountChange — each reports its own count live
  // (on load and after every add/edit/delete) instead of the top-level
  // count only ever refreshing on a full page reload.
  const setCount = (key: keyof CompletionCounts) => (count: number) =>
    setCompletionCounts((prev) => (prev[key] === count ? prev : { ...prev, [key]: count }));

  return {
    profile,
    setProfile,
    loading,
    loadError,
    completionCounts,
    loadProfile,
    refreshProfile,
    onEmploymentCountChange: setCount("employmentCount"),
    onEducationCountChange: setCount("educationCount"),
    onLanguagesCountChange: setCount("languagesCount"),
    onSkillsCountChange: setCount("skillsCount"),
    onDocumentsCountChange: setCount("documentsCount"),
  };
}
