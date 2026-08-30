"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, IdCardIcon } from "@/components/ui/icons";
import { ROUTES } from "@/lib/routes";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import JobApplicationsSummary from "@/components/dashboard/JobApplicationsSummary";
import VerifiedStrip from "@/components/dashboard/VerifiedStrip";
import TrustStrip from "@/components/dashboard/TrustStrip";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import {
  getProfile,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getSkills,
  getDocuments,
  type CandidateProfile,
  type EmploymentRecord,
  type EducationRecord,
  type CandidateLanguageRecord,
  type CandidateSkillRecord,
  type DocumentRecord,
} from "@/lib/api/candidate";
import { getProfileCompletion } from "@/lib/profileCompletion";

// This page ("My Journey") and /profile ("My Profile") used to
// render the same nine edit-cards — that was the actual bug behind "profile
// aur journey same lagta hai". My Profile owns every editable field now.
// This page answers one question instead: where do things stand, and
// what's next — pipeline, recruiter, readiness, activity, verification.
// No edit forms here; still fetches employment/education/languages/
// documents counts because ReadinessScoreCard and the completion ring need
// them, even though their raw contents aren't rendered on this page.
export default function DashboardJourneyPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [employment, setEmployment] = useState<EmploymentRecord[]>([]);
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [languages, setLanguages] = useState<CandidateLanguageRecord[]>([]);
  const [skills, setSkills] = useState<CandidateSkillRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employmentData, educationData, languagesData, skillsData, documentsData] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getSkills(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setEmployment(employmentData);
      setEducation(educationData);
      setLanguages(languagesData);
      setSkills(skillsData);
      setDocuments(documentsData);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch-on-mount — load()'s setState calls happen inside its own async
    // continuation, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const counts = useMemo(
    () => ({
      employmentCount: employment.length,
      educationCount: education.length,
      languagesCount: languages.length,
      skillsCount: skills.length,
      documentsCount: documents.length,
    }),
    [employment, education, languages, skills, documents]
  );

  const completion = useMemo(() => (profile ? getProfileCompletion({ profile, ...counts }) : null), [profile, counts]);
  const isVerified = profile?.kyc_status === "VERIFIED";

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (loadError || !profile) {
    return (
      <div>
        <h1 style={{ fontSize: 24 }}>My Journey</h1>
        <div className="card" style={{ marginTop: 24, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--ink)" }}>We couldn&apos;t load your dashboard. Please try again.</p>
          <button type="button" onClick={load} className="btn-outline" style={{ marginTop: 12 }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileTopBar profile={profile} completionPercent={completion?.percent} />

      {/* Unverified is the one state where this banner is actually
          actionable/urgent, so it goes right under the hero — above the
          sample application cards, not after them. Once verified, it's just
          a confirmation strip and stays down by TrustStrip where it was. */}
      {!isVerified && <VerifiedStrip kycStatus={profile.kyc_status} />}

      <JobApplicationsSummary />

      <div className="card">
        <div className="card-body">
          <div className="card-head">
            <div className="card-title">
              <span className="ic">
                <IdCardIcon className="icon" />
              </span>
              <h3>Need to update something?</h3>
            </div>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
            Personal info, career, documents and more — manage all of it from <strong>My Profile</strong>.
          </p>
          <Link
            href={ROUTES.profile}
            className="btn-solid"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 12 }}
          >
            Go to My Profile
            <ChevronRightIcon className="size-3" />
          </Link>
        </div>
      </div>

      {isVerified && <VerifiedStrip kycStatus={profile.kyc_status} />}
      <TrustStrip />
    </>
  );
}
