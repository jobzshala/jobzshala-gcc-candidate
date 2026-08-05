import { CheckIcon, UserIcon, ShieldCheckIcon, ClockIcon, TargetIcon, ChatIcon, DocumentIcon, SendIcon } from "@/components/ui/icons";

// TODO(backend): `CandidateProfile.status` is currently typed as a plain
// `string` in lib/api/candidate.ts and no component in this app reads it —
// confirm with backend which enum values it actually carries (the admin
// pipeline is NEW_LEAD -> VERIFICATION_PENDING -> DOCUMENT_PENDING ->
// SCREENING_COMPLETED -> VERIFIED -> PROFILE_ACTIVE) before wiring this
// stepper's `currentStepKey` to real profile data. Until then this renders
// a fixed placeholder stage so the layout/visual can be reviewed.

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

type JourneyStepperProps = {
  currentStepKey?: StepKey;
};

export default function JourneyStepper({ currentStepKey = "review" }: JourneyStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStepKey);

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
    </div>
  );
}
