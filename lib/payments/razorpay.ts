/**
 * Razorpay Standard Checkout loader, shared by the subscription page and the
 * custom-offer accept page — both open the same checkout.js modal against a
 * server-created order.
 */

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

type RazorpayGlobal = new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;

// Loaded once and cached — every checkout click reuses the same script tag.
let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as unknown as { Razorpay?: RazorpayGlobal }).Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Could not load the payment checkout. Please try again."));
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export async function openRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  await loadRazorpayScript();

  const RazorpayCtor = (window as unknown as { Razorpay?: RazorpayGlobal }).Razorpay;
  if (!RazorpayCtor) throw new Error("The payment checkout failed to load. Please try again.");

  new RazorpayCtor(options).open();
}
