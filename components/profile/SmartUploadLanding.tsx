"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dropzone from "@/components/ui/Dropzone";
import ParsedResumeReview from "@/components/profile/upload/ParsedResumeReview";
import DocumentsGallery from "@/components/profile/upload/DocumentsGallery";
import { SparkleIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import { updateResume, parseResume, type CandidateProfile, type ParsedResume } from "@/lib/api/candidate";

// Mirrors the backend's RESUME_UPLOAD_MIME_TYPES (src/shared/constants/
// file-type.ts) — most real candidate resumes are a phone photo of a
// printed page, not a typed document, so images are accepted alongside
// PDF/DOC/DOCX here (unlike the plain resume-replace control elsewhere,
// which stays document-only).
const SMART_UPLOAD_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp";
const SMART_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const SMART_UPLOAD_MAX_MB = 10;

type Status = "idle" | "uploading" | "review";

interface SmartUploadLandingProps {
  profile: CandidateProfile;
  refreshProfile: () => Promise<void>;
  onEmploymentCountChange: (count: number) => void;
  onEducationCountChange: (count: number) => void;
  onLanguagesCountChange: (count: number) => void;
  onDocumentsCountChange: (count: number) => void;
  // Fired when the candidate opts out before uploading anything.
  onSkip: () => void;
  // Fired once they're done reviewing (or there was nothing to review) —
  // both land back on the normal wizard/tabs flow, same as onSkip.
  onDone: () => void;
}

// The candidate portal's new first screen (Phase 3 "Smart Upload") — one
// shared build across every device tier (see lib/hooks/useDeviceTier.ts's
// comment on why the wizard/tabs split itself stays two mounts; this screen
// is deliberately NOT part of that split, it's responsive CSS only, shown
// before either shell mounts). Upload a resume, review what the AI found,
// then hand off to the existing profile flow underneath — or skip straight
// there without uploading anything at all.
export default function SmartUploadLanding({
  profile,
  refreshProfile,
  onEmploymentCountChange,
  onEducationCountChange,
  onLanguagesCountChange,
  onDocumentsCountChange,
  onSkip,
  onDone,
}: SmartUploadLandingProps) {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [parseFailed, setParseFailed] = useState(false);

  const handleFileSelected = async (file: File) => {
    setError("");

    if (file.size > SMART_UPLOAD_MAX_MB * 1024 * 1024) {
      setError(t("profile.resume.tooLarge", { maxMb: SMART_UPLOAD_MAX_MB }));
      return;
    }
    if (file.type && !SMART_UPLOAD_MIME_TYPES.includes(file.type)) {
      setError(t("profile.upload.unsupportedType"));
      return;
    }

    setStatus("uploading");

    try {
      // The resume itself is saved regardless of what happens next — parsing
      // is a best-effort bonus on top, never a precondition for the upload
      // to count.
      await updateResume(file);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
      setStatus("idle");
      return;
    }

    try {
      const result = await parseResume(file);
      setParsed(result);
    } catch {
      setParsed(null);
      setParseFailed(true);
    }

    await refreshProfile();
    setStatus("review");
  };

  if (status === "review") {
    const nothingToReview =
      parseFailed ||
      (!!parsed &&
        parsed.documents.length === 0 &&
        parsed.employment.length === 0 &&
        parsed.education.length === 0 &&
        parsed.languages.length === 0 &&
        !Object.values(parsed.personal).some(Boolean) &&
        !Object.values(parsed.career).some((v) => v !== null && v !== ""));

    return (
      <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.upload.reviewTitle")}</h1>
        <p className="mt-2 text-sm text-jz-white-400">{t("profile.upload.reviewSubtitle")}</p>

        <div className="mt-6 space-y-6">
          {nothingToReview ? (
            <div className="rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 text-center backdrop-blur-xl">
              <p className="text-sm text-jz-white-200">{t("profile.upload.nothingFound")}</p>
            </div>
          ) : (
            parsed && (
              <div className="rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
                <ParsedResumeReview
                  parsed={parsed}
                  profile={profile}
                  onProfileRefresh={refreshProfile}
                  onEmploymentCountChange={onEmploymentCountChange}
                  onEducationCountChange={onEducationCountChange}
                  onLanguagesCountChange={onLanguagesCountChange}
                />
              </div>
            )
          )}

          {parsed && parsed.documents.length > 0 && (
            <div className="rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
              <DocumentsGallery documents={parsed.documents} onDocumentsCountChange={onDocumentsCountChange} />
            </div>
          )}

          <button
            type="button"
            onClick={onDone}
            className="w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-3 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 sm:w-auto"
          >
            {t("profile.upload.continueToProfile")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-jz-yellow-400/15 text-jz-yellow-400">
          <SparkleIcon className="size-5" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.upload.landingTitle")}</h1>
      </div>
      <p className="mt-3 text-sm text-jz-white-400">{t("profile.upload.landingSubtitle")}</p>

      <div className="mt-6 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
        {error && (
          <div className="mb-4 rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
        )}
        <Dropzone
          accept={SMART_UPLOAD_ACCEPT}
          onFileSelected={handleFileSelected}
          busy={status === "uploading"}
          busyLabel={t("profile.upload.parsing")}
          label={t("profile.upload.dropzoneLabel")}
          hint={t("profile.upload.dropzoneHint", { maxMb: SMART_UPLOAD_MAX_MB })}
        />
      </div>

      <div className="mt-5 text-center">
        <button type="button" onClick={onSkip} className="text-sm text-jz-white-400 hover:text-jz-white-100">
          {t("profile.upload.skip")}
        </button>
      </div>
    </div>
  );
}
