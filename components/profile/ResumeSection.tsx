"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api/client";
import {
  getResume,
  getResumeHistory,
  updateResume,
  parseResume,
  regenerateResume,
  type ResumeInfo,
  type ResumeHistoryItem,
  type ParsedResume,
  type AiResumeResult,
  type CandidateProfile,
} from "@/lib/api/candidate";
import Dropzone from "@/components/ui/Dropzone";
import Modal from "@/components/ui/Modal";
import { DocumentIcon, DownloadIcon, UploadIcon, SparkleIcon } from "@/components/ui/icons";
import ParsedResumeReview from "@/components/profile/upload/ParsedResumeReview";
import DocumentsGallery from "@/components/profile/upload/DocumentsGallery";

const RESUME_ACCEPT = ".pdf,.doc,.docx";
const RESUME_MAX_MB = 5;

const isPdfUrl = (url: string) => /\.pdf(\?|$)/i.test(url);

interface ResumeSectionProps {
  // Both optional — when present, a successful upload also runs the resume
  // through AI parsing and offers to fill in whatever the candidate hasn't
  // already typed (merge, never overwrite). Without them the section still
  // works exactly as before, just without the auto-fill offer.
  profile?: CandidateProfile;
  onProfileRefresh?: () => Promise<void>;
  // Forwarded straight into ParsedResumeReview/DocumentsGallery so accepting
  // a parsed employment/education/language/document entry from this section
  // keeps the wizard/tabs shell's own completion counts in sync, same as
  // every other section already does for its own adds/edits/deletes.
  onEmploymentCountChange?: (count: number) => void;
  onEducationCountChange?: (count: number) => void;
  onLanguagesCountChange?: (count: number) => void;
  onDocumentsCountChange?: (count: number) => void;
}

export default function ResumeSection({
  profile,
  onProfileRefresh,
  onEmploymentCountChange,
  onEducationCountChange,
  onLanguagesCountChange,
  onDocumentsCountChange,
}: ResumeSectionProps = {}) {
  const { t } = useTranslation();

  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [aiResume, setAiResume] = useState<AiResumeResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [resumeInfo, historyList] = await Promise.all([getResume(), getResumeHistory()]);
      setResume(resumeInfo);
      setHistory(historyList);
    } catch {
      // Leave the section in its last-known state — the upload control still works.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleFileSelected = async (file: File) => {
    setError("");
    setParsed(null);

    if (file.size > RESUME_MAX_MB * 1024 * 1024) {
      setError(t("profile.resume.tooLarge", { maxMb: RESUME_MAX_MB }));
      return;
    }

    setUploading(true);
    try {
      await updateResume(file);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
      setUploading(false);
      return;
    }
    setUploading(false);

    // Best-effort — the resume itself is already saved above regardless of
    // whether parsing succeeds, so a parse failure never blocks the upload.
    if (profile) {
      try {
        setParsed(await parseResume(file));
      } catch {
        setParsed(null);
      }
    }
  };

  const handleGenerate = async () => {
    setGenerateError("");
    setGenerating(true);
    try {
      setAiResume(await regenerateResume());
    } catch (err) {
      setGenerateError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="resume" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
          <UploadIcon className="size-4" />
        </span>
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.resume.heading")}</h2>
      </div>

      {loading ? null : (
        <div className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
          )}

          {resume?.resume_url && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-jz-border bg-jz-blue-900/60 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-jz-yellow-400/10 text-jz-yellow-400">
                  <DocumentIcon className="size-5" />
                </span>
                <p className="text-sm text-jz-white-100">{t("profile.resume.currentFile")}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="text-sm font-medium text-jz-yellow-400 hover:underline"
                >
                  {t("profile.resume.view")}
                </button>
                <a
                  href={resume.resume_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-jz-white-200 hover:text-jz-white-100"
                >
                  <DownloadIcon className="size-4" />
                  {t("profile.resume.download")}
                </a>
              </div>
            </div>
          )}

          <Dropzone
            accept={RESUME_ACCEPT}
            onFileSelected={handleFileSelected}
            busy={uploading}
            busyLabel={t("profile.resume.uploading")}
            label={resume?.resume_url ? t("profile.resume.replace") : t("profile.resume.upload")}
            hint={t("profile.resume.hint", { maxMb: RESUME_MAX_MB })}
          />

          <div className="rounded-xl border border-jz-border bg-jz-blue-900/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-jz-white-100">
                  <SparkleIcon className="size-4 text-jz-yellow-400" />
                  {t("profile.resume.aiGenerate.title")}
                </p>
                <p className="mt-0.5 text-xs text-jz-white-400">{t("profile.resume.aiGenerate.subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="shrink-0 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
              >
                {generating ? t("profile.resume.aiGenerate.generating") : t("profile.resume.aiGenerate.button")}
              </button>
            </div>
            {generateError && <p className="mt-2 text-xs text-jz-red-600">{generateError}</p>}
            {aiResume && (
              <a
                href={aiResume.ai_resume_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-jz-yellow-400 hover:underline"
              >
                <DownloadIcon className="size-4" />
                {t("profile.resume.aiGenerate.view")}
              </a>
            )}
          </div>

          {parsed && profile && onProfileRefresh && (
            <div className="space-y-4">
              <ParsedResumeReview
                parsed={parsed}
                profile={profile}
                onProfileRefresh={onProfileRefresh}
                onEmploymentCountChange={onEmploymentCountChange}
                onEducationCountChange={onEducationCountChange}
                onLanguagesCountChange={onLanguagesCountChange}
              />
              {parsed.documents.length > 0 && (
                <DocumentsGallery documents={parsed.documents} onDocumentsCountChange={onDocumentsCountChange} />
              )}
              <button type="button" onClick={() => setParsed(null)} className="text-sm text-jz-white-400 hover:text-jz-white-100">
                {t("profile.resume.autoFill.dismiss")}
              </button>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <p className="text-xs text-jz-white-600">{t("profile.resume.history")}</p>
              <ul className="mt-2 space-y-1.5">
                {history.map((item) => (
                  <li key={item.id} className="text-sm">
                    <a href={item.resume_url} target="_blank" rel="noreferrer" className="text-jz-white-200 hover:text-jz-yellow-400">
                      {t("profile.resume.version")} {item.version} — {item.created_at.slice(0, 10)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title={t("profile.resume.heading")}>
        {resume?.resume_url && isPdfUrl(resume.resume_url) ? (
          <iframe src={resume.resume_url} title={t("profile.resume.heading")} className="h-[70vh] w-full" />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <p className="text-sm text-jz-white-400">{t("profile.resume.previewUnavailable")}</p>
            {resume?.resume_url && (
              <a
                href={resume.resume_url}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90"
              >
                <DownloadIcon className="size-4" />
                {t("profile.resume.download")}
              </a>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
