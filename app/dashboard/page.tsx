"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  UserIcon,
  SparkleIcon,
  TargetIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  GlobeIcon,
  UploadIcon,
  VideoIcon,
  FolderIcon,
  CheckIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@/components/ui/icons";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import {
  getProfile,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getDocuments,
  type CandidateProfile,
} from "@/lib/api/candidate";
import { getProfileCompletion } from "@/lib/profileCompletion";

type QuickAccessItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  done: boolean;
  detail: string;
};

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [counts, setCounts] = useState({ employmentCount: 0, educationCount: 0, languagesCount: 0, documentsCount: 0 });

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employment, education, languages, documents] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setCounts({
        employmentCount: employment.length,
        educationCount: education.length,
        languagesCount: languages.length,
        documentsCount: documents.length,
      });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch-on-mount — load()'s setState calls happen inside its own async
    // continuation, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const completion = useMemo(() => (profile ? getProfileCompletion({ profile, ...counts }) : null), [profile, counts]);

  const quickAccess: QuickAccessItem[] = profile
    ? [
        {
          key: "personal",
          label: "Personal Details",
          icon: UserIcon,
          href: "/dashboard/profile#personal-details",
          done: !!(profile.email && profile.gender && profile.date_of_birth && profile.current_country),
          detail: profile.current_country?.name ?? "Not set",
        },
        {
          key: "summary",
          label: "Profile Summary",
          icon: SparkleIcon,
          href: "/dashboard/profile#profile-summary",
          done: !!profile.summary?.trim(),
          detail: profile.summary?.trim() ? "Added" : "Not added",
        },
        {
          key: "career",
          label: "Career Preference",
          icon: TargetIcon,
          href: "/dashboard/profile#career-preference",
          done: !!profile.job_title,
          detail: profile.job_title?.name ?? "Not set",
        },
        {
          key: "employment",
          label: "Employment History",
          icon: BriefcaseIcon,
          href: "/dashboard/profile#employment",
          done: counts.employmentCount > 0,
          detail: `${counts.employmentCount} ${counts.employmentCount === 1 ? "entry" : "entries"}`,
        },
        {
          key: "education",
          label: "Education History",
          icon: GraduationCapIcon,
          href: "/dashboard/profile#education",
          done: counts.educationCount > 0,
          detail: `${counts.educationCount} ${counts.educationCount === 1 ? "entry" : "entries"}`,
        },
        {
          key: "languages",
          label: "Languages",
          icon: GlobeIcon,
          href: "/dashboard/profile#languages",
          done: counts.languagesCount > 0,
          detail: `${counts.languagesCount} added`,
        },
        {
          key: "resume",
          label: "Resume",
          icon: UploadIcon,
          href: "/dashboard/profile#resume",
          done: !!profile.resume_url,
          detail: profile.resume_url ? "Uploaded" : "Not uploaded",
        },
        {
          key: "video",
          label: "Video Profile",
          icon: VideoIcon,
          href: "/dashboard/profile#video",
          done: !!profile.video_url,
          detail: profile.video_url ? "Uploaded" : "Not uploaded",
        },
        {
          key: "documents",
          label: "Documents",
          icon: FolderIcon,
          href: "/dashboard/profile#documents",
          done: counts.documentsCount > 0,
          detail: `${counts.documentsCount} uploaded`,
        },
      ]
    : [];


  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      {loading ? (
        <>
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">Overview</h1>
          <p className="mt-2 text-sm text-jz-white-400">Loading your dashboard…</p>
        </>
      ) : loadError || !profile ? (
        <>
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">Overview</h1>
          <div className="mt-10 rounded-2xl border border-jz-red-600/40 bg-jz-red-600/10 p-6 text-center">
            <p className="text-sm text-jz-white-100">We couldn&apos;t load your dashboard. Please try again.</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-xl border border-jz-white-600 px-4 py-2 text-sm text-jz-white-100 hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </>
      ) : (
        <>
          <ProfileTopBar profile={profile} completionPercent={completion?.percent} />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-lg font-semibold text-jz-white-50">Your profile</h2>
                <p className="mt-1 text-sm text-jz-white-400">Jump into any section to add or update your details.</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {quickAccess.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-4 transition-colors hover:border-[#8FD13F]/40 hover:bg-jz-blue-900/60"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#4ADE80]/15 text-[#8FD13F]">
                        <item.icon className="size-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-jz-white-50">{item.label}</p>
                        <p className="mt-0.5 truncate text-xs text-jz-white-400">{item.detail}</p>
                      </div>
                      {item.done ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]/20 text-[#8FD13F]">
                          <CheckIcon className="size-3" />
                        </span>
                      ) : (
                        <ChevronRightIcon className="size-4 shrink-0 text-jz-white-600 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-jz-border bg-jz-blue-900/20 p-6 text-center">
                <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#4ADE80]/15 text-[#8FD13F]">
                  <SearchIcon className="size-4.5" />
                </span>
                <p className="mt-3 text-sm font-medium text-jz-white-50">Job matching is coming soon</p>
                <p className="mt-1 text-xs text-jz-white-400">
                  We&apos;re building AI-matched job recommendations for GCC roles. Keep your profile complete so you&apos;re
                  ready when it launches.
                </p>
              </div>
            </div>

            {completion && (
              <aside className="h-fit rounded-2xl border border-jz-border bg-jz-blue-900/40 p-5">
                <h2 className="font-serif text-base font-semibold text-jz-white-50">Complete your profile</h2>
                <p className="mt-1 text-xs text-jz-white-400">
                  {completion.doneCount} of {completion.total} steps done
                </p>
                <ul className="mt-4 space-y-1">
                  {completion.items.map((item) =>
                    item.done ? (
                      <li key={item.key} className="flex items-center gap-2 px-2 py-2 text-sm text-jz-white-600">
                        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]/20 text-[#8FD13F]">
                          <CheckIcon className="size-2.5" />
                        </span>
                        <span className="line-through decoration-jz-white-600/50">{item.label}</span>
                      </li>
                    ) : (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-jz-white-200 transition-colors hover:bg-white/5 hover:text-jz-white-50"
                        >
                          <span className="size-4.5 shrink-0 rounded-full border border-jz-white-600/60" />
                          <span className="flex-1">{item.label}</span>
                          <ChevronRightIcon className="size-3.5 shrink-0 text-jz-white-600" />
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </aside>
            )}
          </div>
        </>
      )}
    </div>
  );
}
