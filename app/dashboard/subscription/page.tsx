"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon, SparkleIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import {
  getCandidatePlans,
  getMySubscription,
  startCheckout,
  verifyPayment,
  type CandidatePlan,
  type Entitlement,
} from "@/lib/api/subscription";

const CYCLE_LABEL: Record<string, string> = {
  MONTHLY: "month",
  QUARTERLY: "quarter",
  HALF_YEARLY: "6 months",
  YEARLY: "year",
};

function planFeatures(plan: CandidatePlan): string[] {
  // `features` is free-form JSON set by admins, so nothing about its shape can
  // be assumed — render only what is safely printable and skip the rest.
  return Object.entries(plan.features ?? {})
    .filter(([, value]) => value !== false && value !== null && value !== "")
    .map(([key, value]) =>
      value === true ? key.replace(/_/g, " ") : `${key.replace(/_/g, " ")}: ${String(value)}`
    );
}

function CurrentPlan({ entitlement }: { entitlement: Entitlement }) {
  if (entitlement.state === "NONE") return null;

  const active = entitlement.state === "ACTIVE";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-jz-green-500/30 bg-jz-green-500/10"
          : "border-jz-yellow-400/30 bg-jz-yellow-400/10"
      }`}
    >
      <p className="text-base font-semibold text-jz-white-100">
        {active ? "Your subscription is active" : "Your subscription has expired"}
      </p>
      <p className="mt-1 text-sm text-jz-white-400">
        {entitlement.plan_name ?? "Custom plan"}
        {active && entitlement.days_remaining !== null && ` · ${entitlement.days_remaining} days remaining`}
        {!active && " · you can still see the matches that were free"}
      </p>
    </div>
  );
}

function SubscriptionInner() {
  const searchParams = useSearchParams();

  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [plans, setPlans] = useState<CandidatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [startingPlanId, setStartingPlanId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [currentEntitlement, availablePlans] = await Promise.all([
        getMySubscription(),
        getCandidatePlans(),
      ]);
      setEntitlement(currentEntitlement);
      setPlans(availablePlans);
    } catch {
      setError("We couldn't load your subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // PhonePe sends the candidate back here after payment. Verifying is what
  // activates the subscription on the PENDING -> PAID edge; the webhook does
  // the same thing, and whichever arrives first wins — the server claims the
  // transition with a guarded update, so activation happens exactly once.
  useEffect(() => {
    const orderId = searchParams.get("order");
    if (!orderId) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await verifyPayment(orderId);
        if (cancelled) return;

        if (result.payment_status === "PAID") {
          setNotice("Payment received — your subscription is active.");
          await load();
        } else if (result.payment_status === "FAILED") {
          setError("That payment did not go through. Nothing has been charged.");
        } else {
          setNotice("Your payment is still processing. This page will reflect it once it settles.");
        }
      } catch {
        if (!cancelled) setError("We couldn't confirm that payment. Please check back shortly.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, load]);

  const subscribe = async (plan: CandidatePlan) => {
    setError("");
    setStartingPlanId(plan.id);
    try {
      const session = await startCheckout({ plan_id: plan.id });
      window.location.href = session.checkout_url;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "We couldn't start the payment. Please try again."
      );
      setStartingPlanId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10 space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-jz-white-100">
          <SparkleIcon className="size-5 text-jz-yellow-400" />
          Subscription
        </h1>
        <p className="mt-1 text-sm text-jz-white-400">
          Unlock every job match we find for you.
        </p>
      </header>

      {notice && (
        <div className="rounded-xl border border-jz-green-500/30 bg-jz-green-500/10 p-4 text-sm text-jz-white-200">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 p-4 text-sm text-jz-red-600">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-jz-white-400">Loading…</p>}

      {entitlement && <CurrentPlan entitlement={entitlement} />}

      {!loading && plans.length === 0 && (
        <div className="rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 p-8 text-center">
          <p className="text-base font-medium text-jz-white-200">No plans available right now</p>
          <p className="mt-1 text-sm text-jz-white-400">
            Please check back shortly, or contact support if this persists.
          </p>
        </div>
      )}

      {plans.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const features = planFeatures(plan);
            const isCurrent = entitlement?.state === "ACTIVE" && entitlement.plan_id === plan.id;

            return (
              <li
                key={plan.id}
                className="flex flex-col rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 p-5"
              >
                <p className="text-base font-semibold text-jz-white-100">{plan.name}</p>

                <p className="mt-2 text-2xl font-semibold text-jz-white-50">
                  {/* bdi: several GCC currency symbols are right-to-left and
                      would otherwise flip the text around them. */}
                  <bdi>
                    {plan.currency?.symbol ?? ""}
                    {plan.price.toLocaleString()}
                  </bdi>
                  <span className="ml-1 text-sm font-normal text-jz-white-400">
                    / {CYCLE_LABEL[plan.billing_cycle] ?? plan.billing_cycle.toLowerCase()}
                  </span>
                </p>

                {features.length > 0 && (
                  <ul className="mt-4 flex-1 space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-jz-white-200">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-jz-green-500" />
                        <span className="capitalize">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  disabled={isCurrent || startingPlanId !== null}
                  onClick={() => void subscribe(plan)}
                  className="mt-5 w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isCurrent
                    ? "Current plan"
                    : startingPlanId === plan.id
                      ? "Redirecting…"
                      : entitlement?.state === "LAPSED_READONLY"
                        ? "Renew"
                        : "Subscribe"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-jz-white-600">
        Payments are handled by PhonePe. Jobzshala never sees or stores your card details.
      </p>
    </div>
  );
}

export default function SubscriptionPage() {
  // useSearchParams needs a Suspense boundary — the page reads the ?order
  // parameter PhonePe appends on redirect back.
  return (
    <Suspense fallback={<p className="text-sm text-jz-white-400">Loading…</p>}>
      <SubscriptionInner />
    </Suspense>
  );
}
