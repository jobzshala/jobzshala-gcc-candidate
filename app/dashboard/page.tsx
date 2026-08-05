"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UploadIcon, PlayIcon, FolderIcon, CheckIcon, ChevronRightIcon, SearchIcon, VideoIcon } from "@/components/ui/icons";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import JourneyStepper from "@/components/dashboard/JourneyStepper";
import RecruiterCard from "@/components/dashboard/RecruiterCard";
import ReadinessScoreCard from "@/components/dashboard/ReadinessScoreCard";
import ActivityCard from "@/components/dashboard/ActivityCard";
import VerifiedStrip from "@/components/dashboard/VerifiedStrip";
import TrustStrip from "@/components/dashboard/TrustStrip";
import DetailCard from "@/components/dashboard/DetailCard";
import PersonalInfoCard from "@/components/dashboard/PersonalInfoCard";
import CareerProfileCard from "@/components/dashboard/CareerProfileCard";
import { getDocumentIcon } from "@/lib/documentIcon";
import {
  getProfile,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getDocuments,
  type CandidateProfile,
  type EmploymentRecord,
  type EducationRecord,
  type CandidateLanguageRecord,
  type DocumentRecord,
} from "@/lib/api/candidate";
import { getProfileCompletion } from "@/lib/profileCompletion";

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [employment, setEmployment] = useState<EmploymentRecord[]>([]);
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [languages, setLanguages] = useState<CandidateLanguageRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employmentData, educationData, languagesData, documentsData] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setEmployment(employmentData);
      setEducation(educationData);
      setLanguages(languagesData);
      setDocuments(documentsData);
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
      documentsCount: documents.length,
    }),
    [employment, education, languages, documents]
  );

  const completion = useMemo(() => (profile ? getProfileCompletion({ profile, ...counts }) : null), [profile, counts]);

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: 24 }}>Overview</h1>
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-faint)" }}>Loading your dashboard…</p>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div>
        <h1 style={{ fontSize: 24 }}>Overview</h1>
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

      <JourneyStepper />

      <div className="grid">
        <div className="col">
          <PersonalInfoCard profile={profile} onSaved={refreshProfile} />
          <CareerProfileCard profile={profile} onSaved={refreshProfile} />

          {/* RESUME */}
          <DetailCard icon={UploadIcon} title="Resume" complete={!!profile.resume_url}>
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
                  <Link href="/dashboard/profile#resume" className="btn-solid">
                    Replace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="resume-row">
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No resume uploaded yet.</p>
                <Link href="/dashboard/profile#resume" className="btn-solid">
                  Upload Resume
                </Link>
              </div>
            )}
          </DetailCard>

          {/* VIDEO PROFILE */}
          <DetailCard icon={PlayIcon} title="Video Profile" complete={!!profile.video_url}>
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
                  <Link href="/dashboard/profile#video" className="btn-solid">
                    Replace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="video-row">
                <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                  A short video helps you stand out to employers — not uploaded yet.
                </p>
                <Link href="/dashboard/profile#video" className="btn-solid">
                  Upload Video
                </Link>
              </div>
            )}
          </DetailCard>

          {/* DOCUMENTS */}
          <DetailCard
            icon={FolderIcon}
            title="Documents"
            editHref="/dashboard/profile#documents"
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

          <div className="card" style={{ borderStyle: "dashed", textAlign: "center", padding: 24 }}>
            <span
              className="trust-ic"
              style={{ margin: "0 auto", background: "var(--green-soft)", color: "var(--green-600)" }}
            >
              <SearchIcon className="icon" />
            </span>
            <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Job matching is coming soon</p>
            <p style={{ marginTop: 4, fontSize: 11.5, color: "var(--ink-faint)" }}>
              We&apos;re building AI-matched job recommendations for GCC roles. Keep your profile complete so you&apos;re
              ready when it launches.
            </p>
          </div>
        </div>

        {completion && (
          <div className="col">
            <RecruiterCard />

            <ReadinessScoreCard
              profile={profile}
              completionPercent={completion.percent}
              videoUploaded={!!profile.video_url}
              educationCount={counts.educationCount}
              languagesCount={counts.languagesCount}
            />

            <ActivityCard />

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

      <VerifiedStrip kycStatus={profile.kyc_status} />
      <TrustStrip />
    </>
  );
}
