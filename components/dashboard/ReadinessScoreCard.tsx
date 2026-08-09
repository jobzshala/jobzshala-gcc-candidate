import Link from "next/link";
import CompletionRing from "@/components/ui/CompletionRing";
import { CheckIcon, AlertIcon, StarIcon } from "@/components/ui/icons";
import type { CandidateProfile } from "@/lib/api/candidate";

type ReadinessScoreCardProps = {
  profile: CandidateProfile;
  videoUploaded: boolean;
  educationCount: number;
  languagesCount: number;
};

export default function ReadinessScoreCard({
  profile,
  videoUploaded,
  educationCount,
  languagesCount,
}: ReadinessScoreCardProps) {
  const score = profile.readiness_score;
  const stars = profile.readiness_stars;
  const kycVerified = profile.status === "VERIFIED";

  const improveItems = [
    { label: "Upload Video Resume", done: videoUploaded, href: "/profile#video" },
    { label: "Add Education Details", done: educationCount > 0, href: "/profile#education" },
    { label: "Add Language Skills", done: languagesCount > 0, href: "/profile#languages" },
    { label: "Complete KYC Verification", done: kycVerified, href: "/profile#documents" },
  ];

  const message =
    score >= 80
      ? "Great! You are almost ready to be hired."
      : score >= 50
        ? "Good start — a few more steps to stand out."
        : "Let's get your profile ready for GCC employers.";

  return (
    <div className="card">
      <div className="card-body">
        <h3 style={{ fontSize: 13.5, marginBottom: 14 }}>GCC Readiness Score</h3>

        <div className="readiness-top">
          <div className="relative" style={{ width: 72, height: 72 }}>
            <CompletionRing percent={score} size={72} strokeWidth={8} trackColor="var(--line)" ringColor="var(--green-500)" />
            <span className="absolute inset-0 flex items-center justify-center font-serif text-base font-semibold" style={{ color: "var(--ink)" }}>
              {score}%
            </span>
          </div>
          <div>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`icon ${i < stars ? "on" : "off"}`} filled={i < stars} />
              ))}
            </div>
            <div className="readiness-msg" style={{ marginTop: 6 }}>
              {message}
            </div>
          </div>
        </div>

        <div className="improve-title">Improve your score</div>
        {improveItems.map((item) =>
          item.done ? (
            <div key={item.label} className="improve-row ok">
              <CheckIcon className="icon" />
              {item.label}
            </div>
          ) : (
            <Link key={item.label} href={item.href} className="improve-row warn">
              <AlertIcon className="icon" />
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
