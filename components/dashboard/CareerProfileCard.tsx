"use client";

import { useState } from "react";
import DetailCard, { Field } from "@/components/dashboard/DetailCard";
import CareerPreferenceStep from "@/components/profile/steps/CareerPreferenceStep";
import { TargetIcon } from "@/components/ui/icons";
import type { CandidateProfile } from "@/lib/api/candidate";

type CareerProfileCardProps = {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
};

// Same inline-edit pattern as PersonalInfoCard — Edit expands the real
// CareerPreferenceStep form (industry/department/job-title cascade, real
// API validation) inside the card instead of navigating away.
export default function CareerProfileCard({ profile, onSaved }: CareerProfileCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <DetailCard
      icon={TargetIcon}
      title="Career Profile"
      onEdit={() => setEditing((e) => !e)}
      editLabel={editing ? "Cancel" : "Edit"}
      complete={!!profile.job_title}
    >
      {editing ? (
        <CareerPreferenceStep
          profile={profile}
          onSaved={async () => {
            await onSaved();
            setEditing(false);
          }}
        />
      ) : (
        <div className="field-grid">
          <Field label="Job Title" value={profile.job_title?.name ?? "Not set"} />
          <Field label="Industry" value={profile.job_industry?.name ?? "Not set"} />
          <Field label="Department" value={profile.job_department?.name ?? "Not set"} />
          <Field label="Experience" value={profile.experience_years !== null ? `${profile.experience_years} years` : "Not set"} />
          <Field
            label="GCC Experience"
            value={profile.has_gcc_experience === null ? "Not set" : profile.has_gcc_experience ? "Yes" : "No"}
          />
          <Field label="Preferred Country" value={profile.preferred_country?.name ?? "Not set"} />
          <Field label="Expected Salary" value={profile.expected_salary !== null ? String(profile.expected_salary) : "Not set"} />
        </div>
      )}
    </DetailCard>
  );
}
