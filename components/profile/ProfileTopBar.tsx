import { useTranslation } from "react-i18next";
import type { CandidateProfile } from "@/lib/api/candidate";

export default function ProfileTopBar({ profile }: { profile: CandidateProfile }) {
  const { t } = useTranslation();

  const contactLine = [profile.mobile_number, profile.email].filter(Boolean).join(" · ");
  const locationLine = [profile.city?.name, profile.current_country?.name].filter(Boolean).join(", ");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-jz-border bg-gradient-to-br from-jz-blue-900 to-jz-blue-950">
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-jz-yellow-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 text-2xl font-semibold text-jz-ink-on-accent">
            {profile.full_name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">{profile.full_name}</h1>
            {contactLine && <p className="mt-1 text-sm text-jz-white-400">{contactLine}</p>}
            {locationLine && <p className="mt-0.5 text-xs text-jz-white-600">{locationLine}</p>}
          </div>
        </div>

        {profile.job_title?.name && (
          <div className="rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 px-4 py-2.5 sm:text-right">
            <p className="text-xs text-jz-white-600">{t("profile.careerPreference.jobTitleLabel")}</p>
            <p className="mt-0.5 text-sm font-medium text-jz-white-50">{profile.job_title.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
