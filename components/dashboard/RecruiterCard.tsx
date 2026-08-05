import { ChatIcon, PhoneIcon, CalendarIcon } from "@/components/ui/icons";
import type { CandidateProfile } from "@/lib/api/candidate";

type RecruiterCardProps = {
  recruiter: CandidateProfile["assigned_recruiter"];
};

// No real presence/online tracking exists for staff, so unlike the old
// placeholder this doesn't claim the recruiter is "Online" — that was
// fabricated. Chat and Schedule stay disabled (no messaging or booking
// system exists yet); Call is real whenever the assigned recruiter has a
// phone number on file.
export default function RecruiterCard({ recruiter }: RecruiterCardProps) {
  if (!recruiter) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontSize: 13.5 }}>Your Recruiter</h3>
          <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-faint)" }}>
            We&apos;re assigning a recruiter to your profile — check back soon.
          </p>
        </div>
      </div>
    );
  }

  const initials =
    recruiter.full_name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "R";
  const firstName = recruiter.full_name.split(" ")[0];

  return (
    <div className="card">
      <div className="card-body">
        <h3 style={{ fontSize: 13.5 }}>Your Recruiter</h3>
        <div className="recruiter-top" style={{ marginTop: 12 }}>
          <span className="rav">{initials}</span>
          <div>
            <div className="rname">{recruiter.full_name}</div>
            <div className="rrole">Recruiter</div>
          </div>
        </div>
        <div className="contact-icons">
          <button type="button" disabled title="Coming soon" className="cicon wa">
            <ChatIcon className="icon" />
          </button>
          {recruiter.phone ? (
            <a href={`tel:${recruiter.phone}`} className="cicon" title={`Call ${recruiter.full_name}`}>
              <PhoneIcon className="icon" />
            </a>
          ) : (
            <button type="button" disabled title="No phone number on file" className="cicon">
              <PhoneIcon className="icon" />
            </button>
          )}
          <button type="button" disabled title="Coming soon" className="cicon">
            <CalendarIcon className="icon" />
          </button>
        </div>
        {recruiter.phone ? (
          <a href={`tel:${recruiter.phone}`} className="btn-block" style={{ display: "block", textAlign: "center" }}>
            Call {firstName}
          </a>
        ) : (
          <button type="button" disabled title="No phone number on file" className="btn-block">
            Schedule a Call
          </button>
        )}
      </div>
    </div>
  );
}
