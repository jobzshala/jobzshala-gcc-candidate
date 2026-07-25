const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// Contact leads are admin-managed (v1), not a v3-candidate-scoped resource —
// strip this app's version segment and call v1 directly, same as
// subscription-plans.ts / blog-posts.ts / success-stories.ts.
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export interface ContactLeadPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
  errors?: Record<string, string>;
}

export class ContactFormError extends Error {
  fieldErrors?: Record<string, string>;

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ContactFormError";
    this.fieldErrors = fieldErrors;
  }
}

export async function submitContactLead(payload: ContactLeadPayload): Promise<void> {
  const response = await fetch(`${API_ROOT_URL}/v1/contact-leads/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;

  if (!response.ok || !data?.status) {
    throw new ContactFormError(data?.message || "Unable to send your message. Please try again.", data?.errors);
  }
}
