"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { updateProfileImage, deleteProfileImage } from "@/lib/api/candidate";
import { ApiError } from "@/lib/api/client";
import CompletionRing from "@/components/ui/CompletionRing";
import { CameraIcon, TrashIcon, SpinnerIcon, MaleAvatarIcon, FemaleAvatarIcon, UserIcon } from "@/components/ui/icons";
import type { Gender } from "@/lib/api/candidate";

// Mirrors the backend's IMAGE_MIME_TYPES + 2 MB cap (candidates.routes.ts) so
// a wrong-typed or oversized file is caught before the upload round trip.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

type ProfileImageUploaderProps = {
  fullName: string;
  gender?: Gender | null;
  imageUrl: string | null;
  completionPercent?: number;
  onChange: (imageUrl: string | null) => void;
};

export default function ProfileImageUploader({ fullName, gender, imageUrl, completionPercent, onChange }: ProfileImageUploaderProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("profile.image.invalidType"));
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(t("profile.image.tooLarge"));
      return;
    }

    setBusy(true);
    try {
      const result = await updateProfileImage(file);
      onChange(result.profile_image_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.image.genericError"));
    } finally {
      setBusy(false);
    }
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear first so re-picking the same file still fires onChange.
    event.target.value = "";
    if (file) upload(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleRemove = async () => {
    setError("");
    setBusy(true);
    try {
      await deleteProfileImage();
      onChange(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.image.genericError"));
    } finally {
      setBusy(false);
    }
  };

  const AvatarIcon = gender === "MALE" ? MaleAvatarIcon : gender === "FEMALE" ? FemaleAvatarIcon : UserIcon;

  // With a ring, the avatar is inset so the progress stroke stays visible
  // around it; without one it fills the whole box.
  const hasRing = completionPercent !== undefined;
  const boxSize = hasRing ? 72 : 64;
  const avatarInset = hasRing ? 8 : 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="relative shrink-0"
        style={{ width: boxSize, height: boxSize }}
      >
        {/* The ring wraps the avatar rather than replacing it, so completion
            progress stays visible once a photo is set. */}
        {hasRing && (
          <CompletionRing percent={completionPercent} size={boxSize} strokeWidth={5} className="absolute inset-0" />
        )}

        {/* flex, not grid — a grid container with place-items-center and no
            explicit track sizes its implicit column to content rather than
            the container, so a size-full child silently renders at roughly
            half width (this bit us once already). Flex has no such trap. */}
        <button
          type="button"
          onClick={() => !busy && fileInputRef.current?.click()}
          disabled={busy}
          aria-label={imageUrl ? t("profile.image.change") : t("profile.image.upload")}
          style={{ top: avatarInset, right: avatarInset, bottom: avatarInset, left: avatarInset }}
          className={`absolute flex items-center justify-center overflow-hidden rounded-full transition-transform focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none ${
            dragging ? "scale-105 ring-2 ring-white" : ""
          } ${busy ? "cursor-wait" : "cursor-pointer"}`}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- the S3 host isn't in next.config's image domains; a plain img avoids that coupling.
            <img src={imageUrl} alt={t("profile.image.alt", { name: fullName })} className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-white">
              <AvatarIcon className="size-7" />
            </span>
          )}

          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
              <SpinnerIcon className="size-5" />
            </span>
          )}
        </button>

        {/* Persistent camera badge (always visible, not hover-only) — same
            upload action as clicking the avatar itself. */}
        {!busy && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label={imageUrl ? t("profile.image.change") : t("profile.image.upload")}
            title={imageUrl ? t("profile.image.change") : t("profile.image.upload")}
            className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#16A34A] text-white shadow-sm transition-colors hover:bg-[#15803d]"
          >
            <CameraIcon className="size-3.5" />
          </button>
        )}

        {imageUrl && !busy && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label={t("profile.image.remove")}
            title={t("profile.image.remove")}
            className="absolute -bottom-0.5 -left-0.5 flex size-6 items-center justify-center rounded-full border border-white/40 bg-[#14532d] text-white/80 shadow-sm transition-colors hover:border-white/70 hover:text-white"
          >
            <TrashIcon className="size-3.5" />
          </button>
        )}
      </div>

      {error && <p className="max-w-[10rem] text-center text-[11px] leading-tight text-red-200">{error}</p>}

      <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={handleFileSelected} className="hidden" />
    </div>
  );
}
