"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api/client";
import { getVideoProfile, updateVideoProfile, type VideoProfileInfo } from "@/lib/api/candidate";
import Dropzone from "@/components/ui/Dropzone";
import Modal from "@/components/ui/Modal";
import { DownloadIcon, RecordIcon, VideoIcon } from "@/components/ui/icons";

const VIDEO_ACCEPT = "video/*";
const VIDEO_MAX_MB = 100;
const VIDEO_MAX_RECORD_SECONDS = 180; // 3 minutes

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function VideoSection() {
  const { t } = useTranslation();

  const [video, setVideo] = useState<VideoProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState("");

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Always release the camera/mic on unmount — a live stream left open is
  // both a privacy issue and a lingering browser "recording" indicator the
  // candidate would have no way to clear.
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch {
      setCameraError(t("profile.video.cameraError"));
    }
  };

  // Runs after the live-camera <video> element has actually mounted inside
  // the modal (i.e. once the modal is open and `recordedFile` is cleared),
  // so the ref is guaranteed to be attached before we assign the stream to
  // it — calling startCamera() directly from a click handler would race the
  // element's mount.
  useEffect(() => {
    if (recordModalOpen && !recordedFile && !streamRef.current) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordModalOpen, recordedFile]);

  const openRecordModal = () => {
    setError("");
    setRecordModalOpen(true);
  };

  const closeRecordModal = () => {
    stopCamera();
    setIsRecording(false);
    setRecordModalOpen(false);
    if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    setRecordedFile(null);
    setRecordedPreviewUrl("");
    setElapsedSeconds(0);
    setCameraError("");
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], `video-profile-${Date.now()}.webm`, { type: "video/webm" });
      setRecordedFile(file);
      setRecordedPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= VIDEO_MAX_RECORD_SECONDS) {
          recorderRef.current?.stop();
          setIsRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return next;
      });
    }, 1000);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const discardRecording = () => {
    if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    setRecordedFile(null);
    setRecordedPreviewUrl("");
    setElapsedSeconds(0);
  };

  const uploadFile = async (file: File): Promise<boolean> => {
    setError("");

    if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
      setError(t("profile.video.tooLarge", { maxMb: VIDEO_MAX_MB }));
      return false;
    }

    setUploading(true);
    try {
      await updateVideoProfile(file);
      await load();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleUseRecording = async () => {
    if (!recordedFile) return;
    const success = await uploadFile(recordedFile);
    if (success) closeRecordModal();
  };

  return (
    <section id="video" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
          <VideoIcon className="size-4" />
        </span>
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.video.heading")}</h2>
      </div>

      {loading ? null : (
        <div className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
          )}

          {video?.video_url && (
            <div className="space-y-2">
              <video src={video.video_url} controls className="max-h-64 w-full max-w-sm rounded-xl border border-jz-border" />
              <a
                href={video.video_url}
                download
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-1.5 text-sm font-medium text-jz-white-200 hover:text-jz-white-100"
              >
                <DownloadIcon className="size-4" />
                {t("profile.video.download")}
              </a>
            </div>
          )}

          {!video?.video_url && <p className="text-sm text-jz-white-400">{t("profile.video.notUploaded")}</p>}

          <Dropzone
            accept={VIDEO_ACCEPT}
            onFileSelected={uploadFile}
            busy={uploading}
            busyLabel={t("profile.video.uploading")}
            label={video?.video_url ? t("profile.video.replace") : t("profile.video.upload")}
            hint={t("profile.video.hint", { maxMb: VIDEO_MAX_MB })}
          />

          <button
            type="button"
            onClick={openRecordModal}
            className="flex items-center gap-2 text-sm font-medium text-jz-yellow-400 hover:underline"
          >
            <RecordIcon className="size-4 text-jz-red-600" />
            {t("profile.video.recordTab")}
          </button>
        </div>
      )}

      <Modal open={recordModalOpen} onClose={closeRecordModal} title={t("profile.video.recordTab")}>
        <div className="space-y-3 p-5">
          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">{error}</div>
          )}

          {cameraError ? (
            <p className="text-sm text-jz-red-600">{cameraError}</p>
          ) : recordedFile && recordedPreviewUrl ? (
            <>
              <video src={recordedPreviewUrl} controls className="max-h-[50vh] w-full rounded-xl border border-jz-border" />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleUseRecording}
                  className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? t("profile.video.uploading") : t("profile.video.useRecording")}
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={discardRecording}
                  className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                >
                  {t("profile.video.retake")}
                </button>
              </div>
            </>
          ) : (
            <>
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                className="max-h-[50vh] w-full rounded-xl border border-jz-border bg-black"
              />
              <div className="flex items-center justify-between gap-3">
                {isRecording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 px-4 py-2.5 text-sm font-medium text-jz-white-100 hover:opacity-90"
                  >
                    <span className="size-2.5 animate-pulse rounded-full bg-jz-red-600" />
                    {t("profile.video.stopRecording")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!cameraReady}
                    className="flex items-center gap-2 rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                  >
                    <RecordIcon className="size-4 text-jz-red-600" />
                    {t("profile.video.startRecording")}
                  </button>
                )}
                {isRecording && (
                  <p className="text-sm text-jz-white-200">
                    {formatTime(elapsedSeconds)} / {formatTime(VIDEO_MAX_RECORD_SECONDS)}
                  </p>
                )}
              </div>
            </>
          )}
          <p className="text-xs text-jz-white-600">
            {t("profile.video.recordHint", { maxMinutes: VIDEO_MAX_RECORD_SECONDS / 60 })}
          </p>
        </div>
      </Modal>
    </section>
  );
}
