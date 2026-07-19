"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api/client";
import { getResume, getResumeHistory, updateResume, type ResumeInfo, type ResumeHistoryItem } from "@/lib/api/candidate";

export default function ResumeSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      await updateResume(file);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <section id="resume" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.resume.heading")}</h2>

      {loading ? null : (
        <div className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
          )}

          {resume?.resume_url ? (
            <a
              href={resume.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm text-jz-yellow-400 hover:underline"
            >
              {t("profile.resume.view")}
            </a>
          ) : (
            <p className="text-sm text-jz-white-400">{t("profile.resume.notUploaded")}</p>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
            >
              {uploading ? t("profile.resume.uploading") : resume?.resume_url ? t("profile.resume.replace") : t("profile.resume.upload")}
            </button>
          </div>

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
    </section>
  );
}
