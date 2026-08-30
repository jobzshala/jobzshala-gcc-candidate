"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  UploadIcon,
  PlayIcon,
  FolderIcon,
  CheckIcon,
  ChevronRightIcon,
  VideoIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  GlobeIcon,
  AwardIcon,
} from "@/components/ui/icons";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import JourneyStepper from "@/components/dashboard/JourneyStepper";
import DetailCard from "@/components/dashboard/DetailCard";
import PersonalInfoCard from "@/components/dashboard/PersonalInfoCard";
import CareerProfileCard from "@/components/dashboard/CareerProfileCard";
import ProfileSummaryCard from "@/components/dashboard/ProfileSummaryCard";
import RecruiterCard from "@/components/dashboard/RecruiterCard";
import MyInterviewsCard from "@/components/dashboard/MyInterviewsCard";
import ReadinessScoreCard from "@/components/dashboard/ReadinessScoreCard";
import ActivityCard from "@/components/dashboard/ActivityCard";
import SkillsSection from "@/components/profile/SkillsSection";
import VerifiedStrip from "@/components/dashboard/VerifiedStrip";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { getDocumentIcon } from "@/lib/documentIcon";
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
import { getMatches } from "@/lib/api/matches";
import { getMyInterviews } from "@/lib/api/interviews";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { ROUTES } from "@/lib/routes";

function formatDate(value: string | null): string {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function titleCase(value: string | null): string {
  if (!value) return "Not set";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

// This page owns every editable field. Pipeline/recruiter/readiness/activity
// status widgets live on /journey ("My Journey") instead — see that file
// for why the two used to be identical.
export default function DashboardProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [employment, setEmployment] = useState<EmploymentRecord[]>([]);
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [languages, setLanguages] = useState<CandidateLanguageRecord[]>([]);
  const [skills, setSkills] = useState<CandidateSkillRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [matchesTotal, setMatchesTotal] = useState<number | null>(null);
  const [interviewsTotal, setInterviewsTotal] = useState<number | null>(null);
  const [editingSkills, setEditingSkills] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employmentData, educationData, languagesData, skillsData, documentsData, matchesData, interviewsData] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getSkills(),
        getDocuments(),
        // limit: 1 — this card only needs pagination.total, not the rows.
        getMatches({ limit: 1 }).catch(() => null),
        getMyInterviews().catch(() => null),
      ]);
      setProfile(profileData);
      setEmployment(employmentData);
      setEducation(educationData);
      setLanguages(languagesData);
      setSkills(skillsData);
      setDocuments(documentsData);
      setMatchesTotal(matchesData?.pagination.total ?? null);
      setInterviewsTotal(interviewsData?.length ?? null);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Lighter than load() — re-fetches just the profile after an inline-edit
  // save, without flipping the whole page back to the loading skeleton.
  const refreshProfile = async () => {
    try {
      setProfile(await getProfile());
    } catch {
      // Keep showing the last known-good profile — the save itself already
      // succeeded, this is just the follow-up read.
    }
  };

  // Same idea for skills — SkillsSection manages its own add/remove calls
  // and reports the new count, but this page keeps its own read-only copy
  // for the collapsed (non-editing) pill display, which needs a refetch too.
  const refreshSkills = async () => {
    try {
      setSkills(await getSkills());
    } catch {
      // Keep showing the last known-good list.
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (loadError || !profile) {
    return (
      <div>
        <h1 style={{ fontSize: 24 }}>My Profile</h1>
        <div className="card" style={{ marginTop: 24, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--ink)" }}>We couldn&apos;t load your profile. Please try again.</p>
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

      <VerifiedStrip kycStatus={profile.kyc_status} />

      <JourneyStepper status={profile.status} />

      <div className="grid">
        <div className="col">
          <PersonalInfoCard profile={profile} onSaved={refreshProfile} />
          <CareerProfileCard profile={profile} onSaved={refreshProfile} />
          <ProfileSummaryCard profile={profile} onSaved={refreshProfile} />

          {/* EMPLOYMENT HISTORY */}
          <DetailCard
            id="employment"
            icon={BriefcaseIcon}
            title="Employment History"
            editHref={ROUTES.profileEmployment}
            editLabel="Manage"
            complete={employment.length > 0}
            footerLabel={`${employment.length} added`}
          >
            {employment.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {employment.map((job) => (
                  <div key={job.id} style={{ borderRadius: 10, border: "1px solid var(--line)", padding: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{job.designation}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                      {job.company_name} · {formatDate(job.start_date)} – {job.is_current ? "Present" : formatDate(job.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No employment history added yet.</p>
            )}
          </DetailCard>

          {/* EDUCATION */}
          <DetailCard
            id="education"
            icon={GraduationCapIcon}
            title="Education"
            editHref={ROUTES.profileEducation}
            editLabel="Manage"
            complete={education.length > 0}
            footerLabel={`${education.length} added`}
          >
            {education.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ borderRadius: 10, border: "1px solid var(--line)", padding: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{edu.education_qualification.name}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                      {edu.institution_name}
                      {edu.specialization ? ` · ${edu.specialization}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No education details added yet.</p>
            )}
          </DetailCard>

          {/* LANGUAGES */}
          <DetailCard
            id="languages"
            icon={GlobeIcon}
            title="Languages"
            editHref={ROUTES.profileLanguages}
            editLabel="Manage"
            complete={languages.length > 0}
            footerLabel={`${languages.length} added`}
          >
            {languages.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {languages.map((lang) => (
                  <span key={lang.id} className="status-pill" style={{ background: "var(--paper-soft)", color: "var(--ink)" }}>
                    {lang.language.name} · {titleCase(lang.proficiency)}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No languages added yet.</p>
            )}
          </DetailCard>

          {/* SKILLS */}
          <DetailCard
            id="skills"
            icon={AwardIcon}
            title="Skills"
            onEdit={() => setEditingSkills((e) => !e)}
            editLabel={editingSkills ? "Cancel" : "Manage"}
            complete={skills.length > 0}
            footerLabel={`${skills.length} added`}
          >
            {editingSkills ? (
              <SkillsSection onCountChange={() => refreshSkills()} />
            ) : skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map((s) => (
                  <span key={s.id} className="status-pill" style={{ background: "var(--paper-soft)", color: "var(--ink)" }}>
                    {s.skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No skills added yet.</p>
            )}
          </DetailCard>

          {/* RESUME */}
          <DetailCard id="resume" icon={UploadIcon} title="Resume" complete={!!profile.resume_url}>
            {profile.resume_url ? (
              <div className="resume-row">
                <span className="file-ic">
                  <UploadIcon className="icon" />
                </span>
                <div className="resume-meta">
                  <div className="name">Your resume is on file.</div>
                </div>
                <div className="resume-actions">
                  <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-outline">
                    View Resume
                  </a>
                  <Link href={ROUTES.profileResume} className="btn-solid">
                    Replace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="resume-row">
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No resume uploaded yet.</p>
                <Link href={ROUTES.profileResume} className="btn-solid">
                  Upload Resume
                </Link>
              </div>
            )}
          </DetailCard>

          {/* VIDEO PROFILE */}
          <DetailCard id="video" icon={PlayIcon} title="Video Profile" complete={!!profile.video_url}>
            {profile.video_url ? (
              <div className="video-row">
                <div className="video-thumb">
                  <VideoIcon className="icon" />
                </div>
                <div className="video-desc">Your video profile is on file.</div>
                <div className="video-actions">
                  <a href={profile.video_url} target="_blank" rel="noreferrer" className="btn-outline">
                    Preview
                  </a>
                  <Link href={ROUTES.profileVideo} className="btn-solid">
                    Replace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="video-row">
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                  A short video helps you stand out to employers — not uploaded yet.
                </p>
                <Link href={ROUTES.profileVideo} className="btn-solid">
                  Upload Video
                </Link>
              </div>
            )}
          </DetailCard>

          {/* DOCUMENTS */}
          <DetailCard
            id="documents"
            icon={FolderIcon}
            title="Documents"
            editHref={ROUTES.documents}
            editLabel="View All"
            complete={documents.length > 0}
            footerLabel={`${documents.length} uploaded`}
          >
            {documents.length > 0 ? (
              <div className="doc-grid">
                {documents.map((doc) => {
                  const DocIcon = getDocumentIcon(doc.document_type.name);
                  return (
                    <div key={doc.id} className="doc-chip">
                      <div className="dic">
                        <DocIcon className="icon" />
                      </div>
                      <div className="dname">{doc.document_type.name}</div>
                      <div className="dstat ok">
                        <CheckIcon className="icon" />
                        Uploaded
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No documents uploaded yet.</p>
            )}
          </DetailCard>
        </div>

        {completion && (
          <div className="col">
            <RecruiterCard recruiter={profile.assigned_recruiter} />

            <MyInterviewsCard />

            <ReadinessScoreCard
              profile={profile}
              videoUploaded={!!profile.video_url}
              educationCount={counts.educationCount}
              languagesCount={counts.languagesCount}
            />

            <ActivityCard matchesTotal={matchesTotal} interviewsTotal={interviewsTotal} />

            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: 14.5 }}>Complete your profile</h3>
                <p style={{ marginTop: 4, fontSize: 11.5, color: "var(--ink-faint)" }}>
                  {completion.doneCount} of {completion.total} steps done
                </p>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                  {completion.items.map((item) =>
                    item.done ? (
                      <div key={item.key} className="improve-row ok">
                        <CheckIcon className="icon" />
                        <span style={{ textDecoration: "line-through", opacity: 0.7 }}>{item.label}</span>
                      </div>
                    ) : (
                      <Link key={item.key} href={item.href} className="improve-row" style={{ color: "var(--ink-soft)" }}>
                        <span
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: "50%",
                            border: "1.5px solid var(--ink-faint)",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <span style={{ color: "var(--ink-faint)" }}>
                          <ChevronRightIcon className="size-3" />
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
}
