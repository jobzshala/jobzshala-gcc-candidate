"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api/client";
import { getResume, getResumeHistory, updateResume, type ResumeInfo, type ResumeHistoryItem } from "@/lib/api/candidate";
import Dropzone from "@/components/ui/Dropzone";
import Modal from "@/components/ui/Modal";
import { DocumentIcon, DownloadIcon, UploadIcon } from "@/components/ui/icons";

const RESUME_ACCEPT = ".pdf,.doc,.docx";
const RESUME_MAX_MB = 5;

const isPdfUrl = (url: string) => /\.pdf(\?|$)/i.test(url);

export default function ResumeSection() {
  const { t } = useTranslation();

  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

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
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="resume" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
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
