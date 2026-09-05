"use client";

import { useEffect, useState, type FormEvent } from "react";
import { QuestionIcon, ClockIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import {
  createSupportTicket,
  getMySupportTickets,
  type SupportTicket,
  type SupportIssueType,
  type SupportTicketStatus,
} from "@/lib/api/support";

const ISSUE_OPTIONS: { value: SupportIssueType; label: string }[] = [
  { value: "SALARY", label: "Salary" },
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "MEDICAL", label: "Medical" },
  { value: "FOOD", label: "Food" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "COMPLAINT", label: "Complaint" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "OTHER", label: "Other" },
];

const STATUS_TONE: Record<SupportTicketStatus, string> = {
  OPEN: "bg-jz-yellow-400/15 text-jz-yellow-400",
  IN_PROGRESS: "bg-jz-blue-400/15 text-jz-blue-400",
  RESOLVED: "bg-jz-green-500/15 text-jz-green-500",
  CLOSED: "bg-jz-white-600/15 text-jz-white-200",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function TicketRow({ ticket }: { ticket: SupportTicket }) {
  const issueLabel = ISSUE_OPTIONS.find((o) => o.value === ticket.issue_type)?.label ?? ticket.issue_type;
  return (
    <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-serif text-base font-semibold text-jz-white-50">{issueLabel}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[ticket.status]}`}>
          {ticket.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-jz-white-200">{ticket.description}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-jz-white-400">
        <ClockIcon className="size-3.5 shrink-0" />
        Raised {formatDate(ticket.created_at)}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [loadError, setLoadError] = useState("");

  const [issueType, setIssueType] = useState<SupportIssueType | "">("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const load = () => {
    getMySupportTickets()
      .then(setTickets)
      .catch(() => setLoadError("We couldn't load your tickets. Please try again."));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");
    if (!issueType || description.trim().length < 10) {
      setSubmitError("Pick an issue type and describe it in at least 10 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await createSupportTicket({ issue_type: issueType, description: description.trim() });
      setIssueType("");
      setDescription("");
      setSuccessMessage("Ticket raised — our team will get back to you.");
      load();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 px-4 py-10 sm:px-6 lg:px-10">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-jz-white-100">
          <QuestionIcon className="size-5 text-jz-yellow-400" />
          Support
        </h1>
        <p className="mt-1 text-sm text-jz-white-400">
          Salary, accommodation, medical, food, transfer, or anything else — raise it here and our team will follow up.
        </p>
      </header>

      <form onSubmit={submit} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-5">
        {submitError && (
          <div className="mb-4 rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-jz-green-500/40 bg-jz-green-500/10 px-3.5 py-2.5 text-sm text-jz-white-100">
            {successMessage}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="issue_type" className="mb-1.5 block text-sm text-jz-white-200">
              Issue type
            </label>
            <select
              id="issue_type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as SupportIssueType)}
              className="h-11 w-full rounded-xl border border-jz-border bg-jz-blue-900 px-3.5 text-sm text-jz-white-100 outline-none focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20"
            >
              <option value="" className="bg-jz-blue-900">
                Select an issue
              </option>
              {ISSUE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-jz-blue-900">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="mb-1.5 block text-sm text-jz-white-200">
            Tell us what&apos;s going on
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue — the more detail, the faster we can help."
            className="w-full rounded-xl border border-jz-border bg-jz-blue-900 px-3.5 py-2.5 text-sm text-jz-white-100 outline-none focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-xl bg-[var(--green-600)] px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Raise ticket"}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-jz-white-200">Your tickets</h2>

        {loadError && <div className="rounded-xl border border-jz-red-600/40 bg-jz-red-600/10 p-4 text-sm text-jz-red-600">{loadError}</div>}

        {tickets === null && !loadError && <p className="text-sm text-jz-white-400">Loading your tickets…</p>}

        {tickets && tickets.length === 0 && (
          <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 text-center">
            <p className="text-sm text-jz-white-200">No tickets yet.</p>
          </div>
        )}

        {tickets && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
