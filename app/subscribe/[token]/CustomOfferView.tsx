"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, SparkleIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import { useAppSelector } from "@/lib/store/hooks";
import { resolveOffer, startCheckout, type CustomOffer } from "@/lib/api/subscription";

export default function CustomOfferView({ token }: { token: string }) {
  // This page is outside DashboardShell, which is where the dashboard's
  // "no session -> /login" redirect lives, so it has to do its own. The offer
  // path is carried through ?next= because the link is single-use — bouncing
  // someone to the dashboard after login would strand them with no way back
  // to it.
  const session = useAppSelector((state) => state.auth);

  const [offer, setOffer] = useState<CustomOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const load = useCallback(async () => {
    if (!session.accessToken) {
      window.location.href = `/login?next=${encodeURIComponent(`/subscribe/${token}`)}`;
      return;
    }

    setLoading(true);
    try {
      setOffer(await resolveOffer(token));
    } catch (err) {
      // The server answers 404 for every failure mode — unknown, expired,
      // revoked, or belonging to a different candidate — so that this page
      // cannot be used to discover whether a token exists. One message covers
      // all of them, deliberately.
      if (err instanceof ApiError && err.status === 404) setNotFound(true);
      else setError("We couldn't load this offer. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, session.accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const accept = async () => {
    setError("");
    setRedirecting(true);
    try {
      // The token goes to the server, not an amount — the price is read off
      // the offer row there.
      const checkout = await startCheckout({ offer_token: token });
      window.location.href = checkout.checkout_url;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "We couldn't start the payment. Please try again."
      );
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center px-4">
        <p className="text-sm text-jz-white-400">Loading your offer…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center px-4">
        <div className="w-full rounded-2xl border border-jz-white-800/60 bg-jz-blue-900/40 p-8 text-center">
          <p className="text-lg font-semibold text-jz-white-100">This offer isn&apos;t available</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-jz-white-400">
            The link may have expired, already been used, or been issued to a different account.
            If you were expecting an offer, please contact whoever sent it to you.
          </p>
          <Link
            href="/dashboard/subscription"
            className="mt-5 inline-flex rounded-xl border border-jz-white-600 px-4 py-2 text-sm text-jz-white-100 hover:opacity-90"
          >
            See standard plans
          </Link>
        </div>
      </main>
    );
  }

  if (!offer) return null;

  const expires = new Date(offer.expires_at);
  const savesMoney = offer.discount_percent !== null && offer.discount_percent > 0;

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-jz-yellow-400/30 bg-jz-blue-900/40 p-6">
        <p className="flex items-center gap-2 text-sm font-medium text-jz-yellow-400">
          <SparkleIcon className="size-4" />
          An offer prepared for you
        </p>

        <p className="mt-4 text-3xl font-semibold text-jz-white-50">
          {/* bdi keeps a right-to-left currency symbol from reordering the
              text around it — AED and SAR both do this. */}
          <bdi>
            {offer.currency.symbol || `${offer.currency.code} `}
            {offer.amount.toLocaleString()}
          </bdi>
          <span className="ml-2 text-base font-normal text-jz-white-400">
            for {offer.tenure_days} days
          </span>
        </p>

        {savesMoney && offer.based_on_plan && (
          <p className="mt-2 text-sm text-jz-green-500">
            {offer.discount_percent}% below the standard {offer.based_on_plan.name} price of{" "}
            <bdi>
              {offer.currency.symbol || `${offer.currency.code} `}
              {offer.based_on_plan.price.toLocaleString()}
            </bdi>
          </p>
        )}

        <ul className="mt-5 space-y-2 text-sm text-jz-white-200">
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-jz-green-500" />
            Every job match we find for you, unlocked
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-jz-green-500" />
            {offer.tenure_days} days of full access
          </li>
        </ul>

        {error && (
          <div className="mt-5 rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 p-3 text-sm text-jz-red-600">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={redirecting}
          onClick={() => void accept()}
          className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-3 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {redirecting ? "Redirecting to payment…" : "Accept and pay"}
        </button>

        <p className="mt-3 text-center text-xs text-jz-white-600">
          This link can be used once, and expires on{" "}
          {expires.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-jz-white-600">
        Payments are handled by PhonePe. Jobzshala never sees or stores your card details.
      </p>
    </main>
  );
}
