import { ChatIcon, PhoneIcon, CalendarIcon } from "@/components/ui/icons";

// TODO(backend): there is no assigned-recruiter concept anywhere in
// CandidateProfile or the API today (confirmed via repo-wide search — the
// only related backend concept is verification gating matches, not a named
// recruiter contact). This card is a static placeholder so the layout can
// be reviewed; wire it up once a real recruiter-assignment field/endpoint
// exists, and make the WhatsApp/call/schedule actions real at that point.

export default function RecruiterCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: 13.5 }}>Your Recruiter</h3>
          <span
            style={{ fontSize: 11, color: "var(--green-600)", display: "flex", alignItems: "center", gap: 4 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-500)", display: "inline-block" }} />
            Online
          </span>
        </div>
        <div className="recruiter-top" style={{ marginTop: 12 }}>
          <span className="rav">
            PS
            <span className="online" />
          </span>
          <div>
            <div className="rname">Priya Sharma</div>
            <div className="rrole">Senior Recruiter</div>
          </div>
        </div>
        <div className="contact-icons">
          <button type="button" disabled title="Coming soon" className="cicon wa">
            <ChatIcon className="icon" />
          </button>
          <button type="button" disabled title="Coming soon" className="cicon">
            <PhoneIcon className="icon" />
          </button>
          <button type="button" disabled title="Coming soon" className="cicon">
            <CalendarIcon className="icon" />
          </button>
        </div>
        <button type="button" disabled title="Coming soon" className="btn-block">
          Schedule a Call
        </button>
      </div>
    </div>
  );
}
