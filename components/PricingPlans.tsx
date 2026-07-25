"use client";

import { useMemo, useState } from "react";
import type { SubscriptionPlan, SubscriptionUserType } from "@/lib/api/subscription-plans";

const billingCycleLabel: Record<SubscriptionPlan["billing_cycle"], string> = {
  MONTHLY: "month",
  QUARTERLY: "quarter",
  HALF_YEARLY: "6 months",
  YEARLY: "year",
};

const ctaHrefByAudience: Record<SubscriptionUserType, string> = {
  CANDIDATE: "/register",
  EMPLOYER: "/hire/register",
};

// Freeform admin-authored JSON — rendered best-effort as bullet lines rather
// than assuming a fixed shape.
function featureLines(features: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(features ?? {})) {
    const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (value === false) continue;
    if (value === true) {
      lines.push(label);
    } else if (value !== null && value !== undefined && value !== "") {
      lines.push(`${label}: ${value}`);
    }
  }
  return lines;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-4 shrink-0 text-jz-blue-400" aria-hidden="true">
      <path
        d="M16.667 5L7.5 14.167 3.333 10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const priceNum = typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
  const bullets = featureLines(plan.features);

  return (
    <div className="flex flex-col rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
      <h3 className="font-serif text-xl font-semibold text-jz-white-50">{plan.name}</h3>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-serif text-3xl font-bold text-jz-white-50">
          ₹{Number.isNaN(priceNum) ? "-" : priceNum.toLocaleString("en-IN")}
        </span>
        <span className="text-sm text-jz-white-600">/ {billingCycleLabel[plan.billing_cycle]}</span>
      </div>

      <div className="mt-5 h-px bg-jz-grey-400" />

      <ul className="mt-5 flex flex-col gap-3 text-sm text-jz-white-200">
        <li className="flex items-start gap-2">
          <CheckIcon />
          {plan.unlimited_job_postings ? "Unlimited job postings" : `${plan.job_posting_limit ?? 0} job postings`}
        </li>
        <li className="flex items-start gap-2">
          <CheckIcon />
          {plan.hiring_credits} hiring credits
        </li>
        {bullets.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <CheckIcon />
            {line}
          </li>
        ))}
      </ul>

      <a
        href={ctaHrefByAudience[plan.user_type]}
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90"
      >
        Get Started
      </a>
    </div>
  );
}

export default function PricingPlans({ plans }: { plans: SubscriptionPlan[] }) {
  const [audience, setAudience] = useState<SubscriptionUserType>("CANDIDATE");

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.user_type === audience), [plans, audience]);

  return (
    <div>
      <div className="mx-auto grid w-fit grid-cols-2 gap-1 rounded-xl border border-jz-border bg-jz-blue-900 p-1">
        <button
          type="button"
          onClick={() => setAudience("CANDIDATE")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
            audience === "CANDIDATE"
              ? "bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 text-jz-ink-on-accent"
              : "text-jz-white-200 hover:bg-jz-blue-800 hover:text-jz-white-50"
          }`}
        >
          For Candidates
        </button>
        <button
          type="button"
          onClick={() => setAudience("EMPLOYER")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
            audience === "EMPLOYER"
              ? "bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 text-jz-ink-on-accent"
              : "text-jz-white-200 hover:bg-jz-blue-800 hover:text-jz-white-50"
          }`}
        >
          For Employers
        </button>
      </div>

      {visiblePlans.length === 0 ? (
        <p className="mt-14 text-center text-sm text-jz-white-400">
          Plans for {audience === "CANDIDATE" ? "candidates" : "employers"} are coming soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
