import { CheckIcon, UserIcon, ShieldCheckIcon, ClockIcon, TargetIcon, ChatIcon, DocumentIcon, SendIcon } from "@/components/ui/icons";

const STEPS = [
  { key: "created", label: "Profile Created", icon: UserIcon },
  { key: "verified", label: "Verified", icon: ShieldCheckIcon },
  { key: "review", label: "Under Review", icon: ClockIcon },
  { key: "matching", label: "Job Matching", icon: TargetIcon },
  { key: "interview", label: "Interview", icon: ChatIcon },
  { key: "offer", label: "Offer", icon: DocumentIcon },
  { key: "visa", label: "Visa", icon: DocumentIcon },
  { key: "deployment", label: "Deployment", icon: SendIcon },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

// The backend's CandidateStatus enum (public.prisma) backs two overlapping
// state machines — a KYC flow and a legacy recruiter pipeline — neither of
// which tracks anything past "active and eligible to be matched." The
// schema does have interviews/offers/visa_applications/deployments tables,
// but nothing in the app populates them yet (confirmed — grepping src/ for
// each finds zero writes; interviews is read once, for an admin dashboard
// count that's always zero). So this stepper can only honestly reach "Job
// Matching" — the last four steps always render as not-yet-reached, which
// is accurate for every real candidate today rather than fake progress.
//
// "Verified" here is NOT the backend's literal VERIFIED status (that's KYC
// sign-off, which happens after document review) — it's read as "your
// account exists and has left NEW_LEAD," true the moment a candidate has
// registered at all (registration requires an email-OTP step; mobile-OTP
// isn't built yet, so is_mobile_verified can't be used for this). That
// keeps the original Created -> Verified -> Under Review visual order
// intuitive (quick identity check, then a deeper review) without colliding
// with the enum's own ordering.
const KYC_REVIEW_STATUSES = new Set([
  "PROFILE_COMPLETED",
  "VERIFICATION_PENDING",
  "DOCUMENT_PENDING",
  "NEEDS_INFO",
  "REJECTED",
]);
const ACTIVE_STATUSES = new Set(["VERIFIED", "SCREENING_COMPLETED", "PROFILE_ACTIVE"]);

function stepKeyForStatus(status: string): StepKey {
  if (ACTIVE_STATUSES.has(status)) return "matching";
  if (KYC_REVIEW_STATUSES.has(status)) return "review";
  // NEW_LEAD, and DEACTIVATED/DELETED/BLACKLISTED as a safe fallback — those
  // three are auth-gated before a candidate ever reaches this dashboard, so
  // this component isn't expected to render for them in practice.
  return "created";
}

type JourneyStepperProps = {
  status: string;
};

export default function JourneyStepper({ status }: JourneyStepperProps) {
  const currentStepKey = stepKeyForStatus(status);
  const currentIndex = STEPS.findIndex((s) => s.key === currentStepKey);
  const needsAction = status === "REJECTED" || status === "NEEDS_INFO";

  return (
    <div className="journey">
      <div className="steps">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          return (
            <div key={step.key} className={`step${done ? " done" : ""}${current ? " current" : ""}`}>
              <span className="circ">{done ? <CheckIcon className="icon" /> : <step.icon className="icon" />}</span>
              <span className="label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {needsAction && (
        <p className="journey-note">
          {status === "REJECTED"
            ? "Your verification wasn't approved — check your documents and resubmit."
            : "We need a bit more information from you to continue your review."}
        </p>
      )}
    </div>
  );
}
