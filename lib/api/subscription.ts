import { authFetch } from "./client";

/**
 * Candidate subscription and custom-offer endpoints (`/api/v3/candidate/subscription`).
 *
 * Note there is no "amount" anywhere a client can set. Checkout takes a
 * plan id or an offer token and the server reads the price off that row — a
 * client-supplied price would be a client-supplied discount.
 */

/**
 * Three states, derived server-side from end_date rather than stored:
 *  ACTIVE           everything
 *  LAPSED_READONLY  paid once, expired — keeps only what was free
 *  NONE             never subscribed
 */
export type EntitlementState = "ACTIVE" | "LAPSED_READONLY" | "NONE";

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";

export interface Currency {
  id: number;
  code: string;
  symbol: string;
}

export interface Entitlement {
  state: EntitlementState;
  subscription_id: number | null;
  plan_id: number | null;
  plan_name: string | null;
  source: string | null;
  start_date: string | null;
  end_date: string | null;
  days_remaining: number | null;
}

export interface CandidatePlan {
  id: number;
  name: string;
  price: number;
  billing_cycle: BillingCycle;
  features: Record<string, unknown>;
  currency: Currency;
}

export interface CustomOffer {
  id: number;
  amount: number;
  currency: Currency;
  tenure_days: number;
  expires_at: string;
  based_on_plan: { id: number; name: string; price: number } | null;
  discount_percent: number | null;
}

export interface CheckoutSession {
  payment_id: number;
  merchant_order_id: string;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
}

export interface PaymentVerification {
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

export const getMySubscription = () => authFetch<Entitlement>("/candidate/subscription/me");

export const getCandidatePlans = () => authFetch<CandidatePlan[]>("/candidate/subscription/plans");

/**
 * Resolves a custom pricing link.
 *
 * The server answers 404 — never 403 — for a token that is unknown, expired,
 * revoked, or belongs to a different candidate, so this cannot be used to
 * discover whether a token exists.
 */
export const resolveOffer = (token: string) =>
  authFetch<CustomOffer>(`/candidate/subscription/offer/${encodeURIComponent(token)}`);

export const startCheckout = (input: { plan_id: number } | { offer_token: string }) =>
  authFetch<CheckoutSession>("/candidate/subscription/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });

export interface RazorpayVerificationInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Called from checkout.js's success handler — the signature check IS what activates the subscription. */
export const verifyRazorpayPayment = (input: RazorpayVerificationInput) =>
  authFetch<PaymentVerification>("/candidate/subscription/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(input),
  });
