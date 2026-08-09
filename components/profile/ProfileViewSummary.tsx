"use client";

import { useEffect, useState } from "react";
import DetailCard from "@/components/dashboard/DetailCard";
import PersonalInfoCard from "@/components/dashboard/PersonalInfoCard";
import CareerProfileCard from "@/components/dashboard/CareerProfileCard";
import ProfileSummaryCard from "@/components/dashboard/ProfileSummaryCard";
import { getDocumentIcon } from "@/lib/documentIcon";
import {
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
import { BriefcaseIcon, GraduationCapIcon, GlobeIcon, UploadIcon, PlayIcon, VideoIcon, FolderIcon, CheckIcon } from "@/components/ui/icons";

function formatDate(value: string | null): string {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function titleCase(value: string | null): string {
  if (!value) return "Not set";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

type ProfileViewSummaryProps = {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
  onEditTab: (tab: "employment" | "education" | "languages" | "resume" | "video" | "documents") => void;
};

// The default landing state of the "My Profile" page — real field values in
// read-only cards, matching the /dashboard overview's DetailCard pattern.
// Each card's Edit button switches ProfileTabbedForm into edit mode on the
// matching tab rather than navigating away, so viewing and editing stay on
// one page. Fetches its own employment/education/languages/documents arrays
// since useCandidateProfileData only tracks counts for the wizard/tabs shell.
export default function ProfileViewSummary({ profile, onSaved, onEditTab }: ProfileViewSummaryProps) {
  const [employment, setEmployment] = useState<EmploymentRecord[]>([]);
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [languages, setLanguages] = useState<CandidateLanguageRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [employmentData, educationData, languagesData, documentsData] = await Promise.all([
          getEmploymentHistory(),
          getEducationHistory(),
          getLanguages(),
          getDocuments(),
        ]);
        if (cancelled) return;
        setEmployment(employmentData);
        setEducation(educationData);
        setLanguages(languagesData);
        setDocuments(documentsData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="col" style={{ width: "100%" }}>
      <PersonalInfoCard profile={profile} onSaved={onSaved} />
      <CareerProfileCard profile={profile} onSaved={onSaved} />
      <ProfileSummaryCard profile={profile} onSaved={onSaved} />

      <DetailCard
        icon={BriefcaseIcon}
        title="Employment History"
        editLabel="Manage"
        onEdit={() => onEditTab("employment")}
        complete={employment.length > 0}
        footerLabel={loading ? undefined : `${employment.length} added`}
      >
        {loading ? (
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Loading…</p>
        ) : employment.length > 0 ? (
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

      <DetailCard
        icon={GraduationCapIcon}
        title="Education"
        editLabel="Manage"
        onEdit={() => onEditTab("education")}
        complete={education.length > 0}
        footerLabel={loading ? undefined : `${education.length} added`}
      >
        {loading ? (
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Loading…</p>
        ) : education.length > 0 ? (
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

      <DetailCard
        icon={GlobeIcon}
        title="Languages"
        editLabel="Manage"
        onEdit={() => onEditTab("languages")}
        complete={languages.length > 0}
        footerLabel={loading ? undefined : `${languages.length} added`}
      >
        {loading ? (
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Loading…</p>
        ) : languages.length > 0 ? (
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
              <button type="button" onClick={() => onEditTab("resume")} className="btn-solid">
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div className="resume-row">
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No resume uploaded yet.</p>
            <button type="button" onClick={() => onEditTab("resume")} className="btn-solid">
              Upload Resume
            </button>
          </div>
        )}
      </DetailCard>

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
              <button type="button" onClick={() => onEditTab("video")} className="btn-solid">
                Replace
              </button>
            </div>
          </div>
        ) : (
          <div className="video-row">
            <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>
              A short video helps you stand out to employers — not uploaded yet.
            </p>
            <button type="button" onClick={() => onEditTab("video")} className="btn-solid">
              Upload Video
            </button>
          </div>
        )}
      </DetailCard>

      <DetailCard
        icon={FolderIcon}
        title="Documents"
        editLabel="Manage"
        onEdit={() => onEditTab("documents")}
        complete={documents.length > 0}
        footerLabel={loading ? undefined : `${documents.length} uploaded`}
      >
        {loading ? (
          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>Loading…</p>
        ) : documents.length > 0 ? (
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
  );
}
