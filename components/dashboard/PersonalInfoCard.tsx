"use client";

import { useState } from "react";
import DetailCard, { Field } from "@/components/dashboard/DetailCard";
import PersonalDetailsStep from "@/components/profile/steps/PersonalDetailsStep";
import { UserIcon, MailIcon, CalendarIcon, PinIcon, HeartIcon, ShieldCheckIcon } from "@/components/ui/icons";
import type { CandidateProfile } from "@/lib/api/candidate";

const PASSPORT_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  APPLIED: "Applied",
  NOT_AVAILABLE: "Not Available",
};

function formatDate(value: string | null): string {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function titleCase(value: string | null): string {
  if (!value) return "Not set";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

type PersonalInfoCardProps = {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
};

// Edit expands the real PersonalDetailsStep form (with its real country/
// region/city dropdowns and API validation) directly inside this card
// instead of navigating to a separate tab — the inline-edit pattern the
// artifact demonstrated, adapted to keep structured fields as real selects
// rather than free-text contenteditable (a plain text field can't carry a
// country_id).
export default function PersonalInfoCard({ profile, onSaved }: PersonalInfoCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <DetailCard
      id="personal-details"
      icon={UserIcon}
      title="Personal Information"
      onEdit={() => setEditing((e) => !e)}
      editLabel={editing ? "Cancel" : "Edit"}
      complete={!!(profile.email && profile.gender && profile.date_of_birth && profile.current_country)}
    >
      {editing ? (
        <PersonalDetailsStep
          profile={profile}
          onSaved={async () => {
            await onSaved();
            setEditing(false);
          }}
        />
      ) : (
        <div className="field-grid">
          <Field icon={MailIcon} label="Email" value={profile.email ?? "Not set"} />
          <Field icon={UserIcon} label="Gender" value={titleCase(profile.gender)} />
          <Field icon={CalendarIcon} label="Date of Birth" value={formatDate(profile.date_of_birth)} />
          <Field
            icon={PinIcon}
            label="Current Location"
            value={[profile.city?.name, profile.current_country?.name].filter(Boolean).join(", ") || "Not set"}
          />
          <Field icon={HeartIcon} label="Marital Status" value={titleCase(profile.marital_status)} />
          <Field
            icon={ShieldCheckIcon}
            label="Passport Status"
            value={PASSPORT_STATUS_LABEL[profile.passport_status] ?? profile.passport_status}
          />
        </div>
      )}
    </DetailCard>
  );
}
