"use client";

import { useState } from "react";
import DetailCard from "@/components/dashboard/DetailCard";
import ProfileSummaryStep from "@/components/profile/steps/ProfileSummaryStep";
import { DocumentIcon } from "@/components/ui/icons";
import type { CandidateProfile } from "@/lib/api/candidate";

type ProfileSummaryCardProps = {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
};

// Same inline-edit pattern as CareerProfileCard/PersonalInfoCard — Edit
// expands the real ProfileSummaryStep form inside the card. Was missing
// entirely from the view-mode summary despite being a tracked completion
// item (profileCompletion.ts's "summary" key) with its own real edit tab.
export default function ProfileSummaryCard({ profile, onSaved }: ProfileSummaryCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <DetailCard
      id="profile-summary"
      icon={DocumentIcon}
      title="Profile Summary"
      onEdit={() => setEditing((e) => !e)}
      editLabel={editing ? "Cancel" : "Edit"}
      complete={!!profile.summary?.trim()}
    >
      {editing ? (
        <ProfileSummaryStep
          profile={profile}
          onSaved={async () => {
            await onSaved();
            setEditing(false);
          }}
        />
      ) : profile.summary?.trim() ? (
        <p style={{ fontSize: 13, color: "var(--ink)", whiteSpace: "pre-line" }}>{profile.summary}</p>
      ) : (
        <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No profile summary added yet.</p>
      )}
    </DetailCard>
  );
}
