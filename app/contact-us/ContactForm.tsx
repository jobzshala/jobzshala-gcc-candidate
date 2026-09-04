"use client";

import { FormEvent, useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import { ContactFormError, submitContactLead } from "@/lib/api/contact";
import { type CandidateSession } from "@/lib/auth/session";
import { useClientSession } from "@/lib/auth/useClientSession";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the page's own subheading ("hiring, registering as a candidate, or
// partnering") so the topic picker doesn't introduce categories the rest of
// the page doesn't already promise.
const TOPICS = ["Hiring workforce", "Registering as a candidate", "Partnership", "Something else"];

export default function ContactForm() {
  const session = useClientSession();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: TOPICS[0], message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Session resolves client-side (see useClientSession). Fill the identity
  // fields once per resolved session, from whatever the candidate already
  // told us at registration — never overwrite something they've since typed
  // themselves. Done during render (not in an effect) so the prefilled form
  // is what gets painted.
  const [prefilledFrom, setPrefilledFrom] = useState<CandidateSession | null>(null);
  if (session && session !== prefilledFrom) {
    setPrefilledFrom(session);
    setForm((prev) => ({
      ...prev,
      name: prev.name || session.candidate.full_name,
      email: prev.email || session.candidate.email,
      phone: prev.phone || session.candidate.mobile_number,
    }));
  }

  const handleChange = (field: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 5) errors.message = "Tell us a bit more — at least 5 characters.";
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await submitContactLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ContactFormError) {
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 text-center">
        <h3 className="font-serif text-xl font-semibold text-jz-white-50">Thanks for reaching out</h3>
        <p className="mt-2 text-sm text-jz-white-400">
          {session
            ? `We've received your message and will get back to you at ${form.email} shortly.`
            : "We've received your message and will get back to you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6 sm:p-8">
      {session && (
        <p className="mb-5 text-sm text-jz-white-400">
          Hi <span className="font-medium text-jz-white-100">{session.candidate.full_name.split(" ")[0]}</span>
          {" "}— we&apos;ve filled in your details below, so you can go straight to your message.
        </p>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-red-600">
          {error}
        </div>
      )}

      <div className="mb-5">
        <p className="mb-2 text-sm text-jz-white-200">What&apos;s this about?</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, subject: topic }))}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                form.subject === topic
                  ? "border-jz-yellow-400 bg-jz-yellow-400 text-jz-ink-on-accent"
                  : "border-jz-grey-400 bg-jz-blue-950 text-jz-white-200 hover:border-jz-blue-400"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput label="Full name" value={form.name} onChange={handleChange("name")} placeholder="Your name" error={fieldErrors.name} />
        <FormInput label="Email" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" error={fieldErrors.email} />
        <div className="sm:col-span-2">
          <FormInput
            label="Phone (optional)"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="+91 98765 43210"
            error={fieldErrors.phone}
          />
        </div>
      </div>

      <div className="mt-5">
        <FormTextarea
          label="Message"
          value={form.message}
          onChange={handleChange("message")}
          placeholder="How can we help?"
          rows={5}
          error={fieldErrors.message}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-6 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
