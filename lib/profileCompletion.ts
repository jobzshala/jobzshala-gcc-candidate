import type { CandidateProfile } from "./api/candidate";

export interface CompletionItem {
  key: string;
  label: string;
  href: string;
  done: boolean;
}

export interface ProfileCompletionInput {
  profile: CandidateProfile;
  employmentCount: number;
  educationCount: number;
  languagesCount: number;
  documentsCount: number;
}

export interface ProfileCompletion {
  items: CompletionItem[];
  percent: number;
  doneCount: number;
  total: number;
}

export function getProfileCompletion({
  profile,
  employmentCount,
  educationCount,
  languagesCount,
  documentsCount,
}: ProfileCompletionInput): ProfileCompletion {
  const items: CompletionItem[] = [
    { key: "email", label: "Email address", href: "/dashboard/profile#personal-details", done: !!profile.email },
    { key: "gender", label: "Gender", href: "/dashboard/profile#personal-details", done: !!profile.gender },
    { key: "dob", label: "Date of birth", href: "/dashboard/profile#personal-details", done: !!profile.date_of_birth },
    { key: "location", label: "Current location", href: "/dashboard/profile#personal-details", done: !!profile.current_country },
    { key: "summary", label: "Profile summary", href: "/dashboard/profile#profile-summary", done: !!profile.summary?.trim() },
    { key: "job_title", label: "Career preference", href: "/dashboard/profile#career-preference", done: !!profile.job_title },
    {
      key: "experience",
      label: "Experience details",
      href: "/dashboard/profile#career-preference",
      done: profile.experience_years !== null,
    },
    { key: "employment", label: "Employment history", href: "/dashboard/profile#employment", done: employmentCount > 0 },
    { key: "education", label: "Education history", href: "/dashboard/profile#education", done: educationCount > 0 },
    { key: "languages", label: "Languages", href: "/dashboard/profile#languages", done: languagesCount > 0 },
    { key: "resume", label: "Resume", href: "/dashboard/profile#resume", done: !!profile.resume_url },
    { key: "video", label: "Video profile", href: "/dashboard/profile#video", done: !!profile.video_url },
    { key: "documents", label: "Documents", href: "/dashboard/profile#documents", done: documentsCount > 0 },
  ];

  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);

  return { items, percent, doneCount, total: items.length };
}

// The 13 items collapse onto 9 distinct #hash groups (personal-details alone
// covers 4 of them). A group counts as done only once every item in it is —
// used by the wizard's progress dots and the tabs shell's "done" tab badge
// so both read the same underlying model instead of each inventing its own
// notion of "this section is complete".
export const isStepDone = (items: CompletionItem[], hashId: string): boolean => {
  const group = items.filter((item) => item.href.endsWith(`#${hashId}`));
  return group.length > 0 && group.every((item) => item.done);
};
