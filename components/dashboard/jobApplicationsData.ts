// Static preview of a feature that doesn't exist in the API yet — there's no
// "show interest" action or per-job application status today (match_scores /
// candidate_match_reveals only gate paywall visibility, they don't record
// intent). Shared between JobApplicationsSummary (the condensed widget on
// /journey) and the full /applications workspace so both read from the same
// sample data until GET /candidate/applications is real.
export const STAGES = ["Interested", "Recruiter Review", "Interview", "Offer"] as const;

export interface TimelineEntry {
  label: string;
  when: string;
  description: string;
}

export interface JobApplication {
  id: string;
  title: string;
  employer: string;
  location: string;
  salary: string;
  /** Index into STAGES the application has reached (0-3). */
  stageIndex: number;
  /** Set only when the application closed without reaching the next stage. */
  rejectedAt?: number;
  statusLabel: string;
  statusKind: "progress" | "action" | "closed";
  timeline: TimelineEntry[];
  actionLabel: string;
  primaryAction?: string;
}

export const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: "warehouse-supervisor",
    title: "Warehouse Supervisor",
    employer: "Al Noor Logistics",
    location: "Dubai, UAE",
    salary: "AED 3,200/mo",
    stageIndex: 2,
    statusLabel: "Interview stage",
    statusKind: "progress",
    timeline: [
      { label: "You showed interest", when: "2 Aug 2026", description: "Saved from your Job Matches list." },
      {
        label: "Recruiter reviewed your profile",
        when: "4 Aug 2026",
        description: "Your recruiter matched your experience against the role and moved you forward.",
      },
      {
        label: "Interview scheduled",
        when: "9 Aug 2026 · 2:00 PM IST",
        description: "Video call with the hiring manager. Link will be shared 24 hours before.",
      },
      { label: "Offer", when: "—", description: "Waiting on your interview outcome." },
    ],
    actionLabel: "View job details",
  },
  {
    id: "electrician",
    title: "Electrician",
    employer: "Gulf Bay Construction",
    location: "Doha, Qatar",
    salary: "QAR 2,800/mo",
    stageIndex: 1,
    statusLabel: "Recruiter review",
    statusKind: "progress",
    timeline: [
      { label: "You showed interest", when: "6 Aug 2026", description: "Saved from your Job Matches list." },
      {
        label: "Recruiter review in progress",
        when: "In progress",
        description: "Your recruiter is checking this role against your profile.",
      },
      { label: "Interview", when: "—", description: "Not yet reached." },
      { label: "Offer", when: "—", description: "Not yet reached." },
    ],
    actionLabel: "View job details",
  },
  {
    id: "delivery-executive",
    title: "Delivery Executive",
    employer: "Falcon Retail Group",
    location: "Abu Dhabi, UAE",
    salary: "AED 2,600/mo",
    stageIndex: 3,
    statusLabel: "Offer received",
    statusKind: "action",
    timeline: [
      { label: "You showed interest", when: "1 Aug 2026", description: "Saved from your Job Matches list." },
      { label: "Recruiter reviewed your profile", when: "3 Aug 2026", description: "Moved forward to interview." },
      { label: "Interview completed", when: "5 Aug 2026", description: "You cleared the interview round." },
      {
        label: "Offer sent",
        when: "7 Aug 2026",
        description: "Falcon Retail Group sent an offer. Review the details and respond.",
      },
    ],
    actionLabel: "Decline",
    primaryAction: "Review offer",
  },
  {
    id: "security-guard",
    title: "Site Security Guard",
    employer: "Desert Rose Facilities",
    location: "Manama, Bahrain",
    salary: "BHD 180/mo",
    stageIndex: 2,
    rejectedAt: 2,
    statusLabel: "Not selected",
    statusKind: "closed",
    timeline: [
      { label: "You showed interest", when: "30 Jul 2026", description: "Saved from your Job Matches list." },
      { label: "Recruiter reviewed your profile", when: "1 Aug 2026", description: "Moved forward to interview." },
      {
        label: "Not selected after interview",
        when: "5 Aug 2026",
        description: "Keep applying — more matches are waiting for you.",
      },
      { label: "Offer", when: "—", description: "Not reached." },
    ],
    actionLabel: "Browse similar jobs",
  },
];

// Center of stage i out of `total`, as a percent of the track's full width —
// matches how the track line and node column are laid out in ApplicationCard,
// so the fill's left/width always land exactly on the node centers it's
// connecting rather than being eyeballed per card.
export function stagePercent(index: number, total: number): number {
  return ((index + 0.5) / total) * 100;
}
