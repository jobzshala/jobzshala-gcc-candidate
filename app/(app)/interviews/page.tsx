"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, GlobeIcon } from "@/components/ui/icons";
import { getMyInterviews, type MyInterview, type InterviewStatus } from "@/lib/api/interviews";

const STATUS_TONE: Record<InterviewStatus, string> = {
  CONFIRMED: "bg-jz-blue-400/15 text-jz-blue-400",
  COMPLETED: "bg-jz-white-600/15 text-jz-white-200",
  SELECTED: "bg-jz-green-500/15 text-jz-green-500",
  REJECTED: "bg-jz-red-600/15 text-jz-red-600",
  HOLD: "bg-jz-yellow-400/15 text-jz-yellow-400",
  SECOND_ROUND_REQUIRED: "bg-jz-blue-400/15 text-jz-blue-400",
  CANCELLED: "bg-jz-white-600/15 text-jz-white-600",
  NO_SHOW: "bg-jz-red-600/15 text-jz-red-600",
};

const formatWhen = (value: string | null, timezone: string): string => {
  if (!value) return "Time to be confirmed";
  try {
    return new Date(value).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short", timeZone: timezone });
  } catch {
    return new Date(value).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
  }
};

function InterviewCard({ interview }: { interview: MyInterview }) {
  return (
    <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-jz-white-50">{interview.job.title}</h3>
          <p className="mt-0.5 text-sm text-jz-white-400">{interview.employer.company_name}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[interview.status]}`}>
          {interview.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-jz-white-200">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 shrink-0 text-jz-white-600" />
          {formatWhen(interview.scheduled_at, interview.timezone)}
        </div>
        <div className="flex items-center gap-2">
          <GlobeIcon className="size-4 shrink-0 text-jz-white-600" />
          {interview.mode === "ONLINE" ? "Online" : "In person"}
          {interview.platform ? ` · ${interview.platform.name}` : ""}
        </div>
        {interview.instructions && <p className="text-xs text-jz-white-400">{interview.instructions}</p>}
      </div>

      {interview.meeting_link && interview.status === "CONFIRMED" && (
        <a
          href={interview.meeting_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
        >
          Join interview
        </a>
      )}
    </div>
  );
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<MyInterview[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyInterviews()
      .then(setInterviews)
      .catch(() => setError("We couldn't load your interviews. Please try again."));
  }, []);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 px-4 py-10 sm:px-6 lg:px-10">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-jz-white-100">
          <CalendarIcon className="size-5 text-jz-yellow-400" />
          Your interviews
        </h1>
        <p className="mt-1 text-sm text-jz-white-400">Every interview a recruiter has confirmed for you, newest first.</p>
      </header>

      {error && <div className="rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 p-4 text-sm text-jz-red-600">{error}</div>}

      {interviews === null && !error && <p className="text-sm text-jz-white-400">Loading your interviews…</p>}

      {interviews && interviews.length === 0 && (
        <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 text-center">
          <p className="text-sm text-jz-white-200">No interviews yet.</p>
          <p className="mt-1 text-xs text-jz-white-400">
            When an employer requests one, it&apos;ll appear here once a recruiter confirms the final time and link.
          </p>
        </div>
      )}

      {interviews && interviews.length > 0 && (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
