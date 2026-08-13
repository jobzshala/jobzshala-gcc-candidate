"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronRightIcon,
  GlobeIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TargetIcon,
} from "@/components/ui/icons";
import { getMatches, type Match, type MatchesPage, type UnlockedMatch } from "@/lib/api/matches";
import { ROUTES } from "@/lib/routes";

const PAGE_SIZE = 20;

function formatSalary(match: UnlockedMatch): string {
  const { salary_offered: salary, currency } = match.job;
  if (!salary) return "Not disclosed";
  // <bdi> is not needed here because the symbol and amount are the whole
  // string, but several GCC currency symbols are right-to-left so the code is
  // used when there is no symbol rather than concatenating blindly.
  return `${currency?.symbol ?? `${currency?.code ?? ""} `}${Number(salary).toLocaleString()}`;
}

function UnlockedCard({ match }: { match: UnlockedMatch }) {
  const { job } = match;

  return (
    <li className="rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-jz-white-100">{job.job_title.name}</p>
          <p className="mt-0.5 text-sm text-jz-white-400">{job.employer.company_name}</p>
        </div>

        <div className="flex items-center gap-2">
          {match.revealed_tier === "FREE" && (
            <span className="rounded-full bg-jz-blue-900/60 px-2.5 py-1 text-xs text-jz-white-400">
              Free match
            </span>
          )}
          <span className="rounded-full bg-jz-yellow-400/15 px-2.5 py-1 text-xs font-medium text-jz-yellow-400">
            {Math.round(match.score)}% match
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-jz-white-600">Location</dt>
          <dd className="text-jz-white-200">
            {[job.city?.name, job.country?.name].filter(Boolean).join(", ") || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-jz-white-600">Salary</dt>
          <dd className="text-jz-white-200">{formatSalary(match)}</dd>
        </div>
        <div>
          <dt className="text-xs text-jz-white-600">Visa</dt>
          <dd className="text-jz-white-200">{job.visa_type?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-jz-white-600">Experience</dt>
          <dd className="text-jz-white-200">{job.experience_required?.name ?? "—"}</dd>
        </div>
      </dl>

      {match.reason && (
        <p className="mt-4 flex gap-2 rounded-xl bg-jz-blue-950/60 p-3 text-sm text-jz-white-400">
          <SparkleIcon className="size-4 shrink-0 text-jz-yellow-400" />
          <span>{match.reason}</span>
        </p>
      )}
    </li>
  );
}

/**
 * A locked row. There is nothing to hide here — the server sends no job, no
 * employer, no salary and no score for a locked match, so this cannot leak
 * even if someone reads the network response.
 */
function LockedCard({ rank }: { rank: number }) {
  return (
    <li className="rounded-2xl border border-dashed border-jz-white-800/60 bg-jz-blue-900/20 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-40 rounded bg-jz-blue-800/60" aria-hidden />
          <div className="mt-2 h-3 w-28 rounded bg-jz-blue-800/40" aria-hidden />
        </div>
        <span className="shrink-0 rounded-full bg-jz-blue-900/60 px-2.5 py-1 text-xs text-jz-white-400">
          Match #{rank} · locked
        </span>
      </div>
      <p className="sr-only">Match {rank} is locked. Subscribe to view it.</p>
    </li>
  );
}

function Paywall({ access }: { access: MatchesPage["access"] }) {
  if (!access.paywall) return null;

  // Not a subscription state — nothing to buy yet, so no Subscribe/Renew CTA.
  // Points at the profile instead, where verification status is visible.
  if (access.paywall.reason === "PROFILE_NOT_VERIFIED") {
    return (
      <div className="rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-jz-white-100">Profile verification in progress</p>
            <p className="mt-1 text-sm text-jz-white-400">{access.paywall.message}</p>
          </div>

          <Link
            href={ROUTES.profile}
            className="inline-flex items-center gap-1.5 rounded-xl bg-jz-blue-800/60 px-4 py-2 text-sm font-semibold text-jz-white-100 transition-opacity hover:opacity-90"
          >
            View profile
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const expired = access.paywall.reason === "SUBSCRIPTION_EXPIRED";

  return (
    <div className="rounded-2xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-jz-white-100">
            {expired ? "Your subscription has expired" : `${access.locked_count} more matches waiting`}
          </p>
          <p className="mt-1 text-sm text-jz-white-400">{access.paywall.message}</p>
        </div>

        <Link
          href={ROUTES.subscription}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
        >
          {expired ? "Renew" : "See plans"}
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Zero matches reads two different ways and the UI has to say which: a
 * candidate mid-verification isn't in a dead end (matching hasn't started
 * yet), while a verified candidate with nothing found is — and telling a
 * verified candidate "finish your profile" when it's already done just
 * erodes trust. `notVerified` comes straight off `access.paywall.reason`
 * rather than a guess, so the two never get crossed.
 */
function EmptyMatchesState({ notVerified }: { notVerified: boolean }) {
  const Icon = notVerified ? ShieldCheckIcon : SearchIcon;

  return (
    <div className="rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-jz-yellow-400/10">
        <Icon className="size-8 text-jz-yellow-400" />
      </div>

      <p className="mt-5 text-lg font-semibold text-jz-white-100">
        {notVerified ? "Your profile is under verification" : "No matches yet — we're still looking"}
      </p>

      {/* div, not p — this page renders inside DashboardShell's
          .dashboard-artifact wrapper, whose `.dashboard-artifact p { margin: 0 }`
          reset (unlayered CSS, so it beats Tailwind's @layer utilities
          regardless of specificity) was killing this element's mx-auto
          centering while leaving its mt-2 mostly invisible too. */}
      <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-jz-white-400">
        {notVerified
          ? "Matching starts as soon as a recruiter verifies your details — usually within 24–48 hours. We'll notify you the moment it's done."
          : "We check new job postings against your profile every day. A more complete profile — skills, experience, salary expectations — gets matched to better-fit roles, faster."}
      </div>

      <Link
        href={ROUTES.profile}
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-5 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
      >
        {notVerified ? "Review your profile" : "Strengthen your profile"}
        <ChevronRightIcon className="size-4" />
      </Link>
    </div>
  );
}

export default function MatchesPage() {
  const [data, setData] = useState<MatchesPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError("");
    try {
      setData(await getMatches({ page: targetPage, limit: PAGE_SIZE }));
    } catch {
      setError("We couldn't load your matches. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page);
  }, [load, page]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10 space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-jz-white-100">
            <TargetIcon className="size-5 text-jz-yellow-400" />
            Job matches
          </h1>
          <p className="mt-1 text-sm text-jz-white-400">
            Roles matched to your profile by our AI, ranked by fit.
          </p>
        </div>

        {data?.entitlement.state === "ACTIVE" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-jz-green-500/10 px-3 py-1 text-xs font-medium text-jz-green-500">
            <CheckIcon className="size-3.5" />
            {data.entitlement.plan_name ?? "Subscribed"}
            {data.entitlement.days_remaining !== null && ` · ${data.entitlement.days_remaining} days left`}
          </span>
        )}
      </header>

      {error && (
        <div className="rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 p-4 text-sm text-jz-red-600">
          {error}
        </div>
      )}

      {loading && !data && <p className="text-sm text-jz-white-400">Loading your matches…</p>}

      {data && data.pagination.total === 0 && !loading && (
        <EmptyMatchesState notVerified={data.access.paywall?.reason === "PROFILE_NOT_VERIFIED"} />
      )}

      {data && data.pagination.total > 0 && (
        <>
          <p className="text-sm text-jz-white-400">
            <GlobeIcon className="mr-1.5 inline size-4 align-text-bottom" />
            {data.access.unlocked_count} of {data.pagination.total} matches open to you
          </p>

          <Paywall access={data.access} />

          <ul className="space-y-3">
            {data.matches.map((match: Match) =>
              match.locked ? (
                <LockedCard key={`locked-${match.rank}`} rank={match.rank} />
              ) : (
                <UnlockedCard key={match.job.id} match={match} />
              )
            )}
          </ul>

          {data.pagination.total_pages > 1 && (
            <nav className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-xl border border-jz-white-600 px-3.5 py-2 text-sm text-jz-white-200 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-jz-white-400">
                Page {data.pagination.page} of {data.pagination.total_pages}
              </span>
              <button
                type="button"
                disabled={page >= data.pagination.total_pages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl border border-jz-white-600 px-3.5 py-2 text-sm text-jz-white-200 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
