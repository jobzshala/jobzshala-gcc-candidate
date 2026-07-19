"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api/client";
import { getVideoProfile, updateVideoProfile, type VideoProfileInfo } from "@/lib/api/candidate";

export default function VideoSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [video, setVideo] = useState<VideoProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setVideo(await getVideoProfile());
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
      await updateVideoProfile(file);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <section id="video" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.video.heading")}</h2>

      {loading ? null : (
        <div className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
          )}

          {video?.video_url ? (
            <video src={video.video_url} controls className="max-h-64 w-full max-w-sm rounded-xl border border-jz-border" />
          ) : (
            <p className="text-sm text-jz-white-400">{t("profile.video.notUploaded")}</p>
          )}

          <div>
            <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0])} />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
            >
              {uploading ? t("profile.video.uploading") : video?.video_url ? t("profile.video.replace") : t("profile.video.upload")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
