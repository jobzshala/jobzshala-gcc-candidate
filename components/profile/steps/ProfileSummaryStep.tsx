"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormTextarea from "@/components/ui/FormTextarea";
import { ApiError } from "@/lib/api/client";
import { updatePersonalDetails, type CandidateProfile } from "@/lib/api/candidate";

interface ProfileSummaryStepProps {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
  saveLabel?: string;
}

export default function ProfileSummaryStep({ profile, onSaved, saveLabel }: ProfileSummaryStepProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState(profile.summary ?? "");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      await updatePersonalDetails({ summary: form.trim() || null });
      await onSaved();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {profile.ai_summary && (
        <div className="rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 p-4">
          <p className="text-xs font-medium text-jz-yellow-400">{t("profile.summary.aiGeneratedLabel")}</p>
          <p className="mt-1.5 whitespace-pre-line text-sm text-jz-white-100">{profile.ai_summary}</p>
        </div>
      )}

      {saveError && (
        <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
          {saveError}
        </div>
      )}

      <FormTextarea
        label={t("profile.summary.yourSummaryLabel")}
        placeholder={t("profile.summary.placeholder")}
        value={form}
        onChange={(e) => setForm(e.target.value)}
        maxLength={600}
        rows={5}
        hint={t("profile.summary.charCount", { count: form.length })}
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--green-600)] px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {saving ? t("profile.saving") : saveLabel ?? t("profile.save")}
      </button>
    </form>
  );
}
