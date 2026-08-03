"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Checkbox from "@/components/ui/Checkbox";
import { SparkleIcon, CrossIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import {
  updatePersonalDetails,
  updateCareerPreference,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getEducationQualifications,
  getLanguagesMaster,
  writeCandidateCollections,
  type CandidateProfile,
  type ParsedResume,
  type EmploymentRecord,
  type EmploymentPayload,
  type EmploymentType,
  type EducationRecord,
  type EducationPayload,
  type EducationQualificationOption,
  type CandidateLanguageRecord,
  type LanguagePayload,
  type LanguageProficiency,
  type LookupRef,
} from "@/lib/api/candidate";

interface ParsedResumeReviewProps {
  parsed: ParsedResume;
  profile: CandidateProfile;
  onProfileRefresh: () => Promise<void>;
  onEmploymentCountChange?: (count: number) => void;
  onEducationCountChange?: (count: number) => void;
  onLanguagesCountChange?: (count: number) => void;
}

// ---------------------------------------------------------------------------
// Row state — one editable, accept/reject-able row per parsed array entry.
// sourceIndex is the entry's position in parsed.employment/.education/
// .languages, kept stable across accept/reject so low_confidence_fields
// dotted-path lookups ("employment.0.company_name") keep working even after
// the candidate rejects an earlier row.
// ---------------------------------------------------------------------------

interface Row<T> {
  key: string;
  sourceIndex: number;
  accepted: boolean;
  data: T;
}

type EmploymentRowData = {
  company_name: string;
  designation: string;
  employment_type: EmploymentType | "";
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  description: string;
};

type EducationRowData = {
  education_qualification_id: string;
  institution_name: string;
  specialization: string;
  start_date: string;
  end_date: string;
  score: string;
};

type LanguageRowData = {
  language_id: string;
  proficiency: LanguageProficiency | "";
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
};

const EMPLOYMENT_TYPE_VALUES: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "TEMPORARY",
  "INTERN",
  "FREELANCE",
  "SELF_EMPLOYED",
];
const PROFICIENCY_VALUES: LanguageProficiency[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "FLUENT", "NATIVE"];

const isoDateOnly = (value: string | null): string => (value ? value.slice(0, 10) : "");

const normalizeEnum = <T extends string>(value: string | null, allowed: T[]): T | "" => {
  if (!value) return "";
  const key = value.trim().toUpperCase().replace(/[\s-]+/g, "_") as T;
  return allowed.includes(key) ? key : "";
};

const exactMatch = <T extends LookupRef>(name: string, options: T[]): T | undefined =>
  options.find((o) => o.name.trim().toLowerCase() === name.trim().toLowerCase());

const PERSONAL_FIELD_LABEL_KEYS: Record<string, string> = {
  full_name: "profile.personalDetails.fullNameLabel",
  email: "profile.personalDetails.emailLabel",
  mobile_number: "profile.personalDetails.mobileLabel",
  gender: "profile.personalDetails.genderLabel",
  date_of_birth: "profile.personalDetails.dateOfBirthLabel",
  marital_status: "profile.personalDetails.maritalStatusLabel",
  address_line_1: "profile.personalDetails.addressLine1Label",
  address_line_2: "profile.personalDetails.addressLine2Label",
  pincode: "profile.personalDetails.pincodeLabel",
  current_country: "profile.personalDetails.currentCountryLabel",
};

const CAREER_FIELD_LABEL_KEYS: Record<string, string> = {
  job_title: "profile.careerPreference.jobTitleLabel",
  job_industry: "profile.careerPreference.jobIndustryLabel",
  job_functional_area: "profile.careerPreference.jobFunctionalAreaLabel",
  experience_years: "profile.careerPreference.experienceYearsLabel",
  summary: "profile.summary.yourSummaryLabel",
  current_salary: "profile.careerPreference.currentSalaryLabel",
  expected_salary: "profile.careerPreference.expectedSalaryLabel",
};

const flaggedInputClass = "border-jz-yellow-400/70 ring-1 ring-jz-yellow-400/40";

export default function ParsedResumeReview({
  parsed,
  profile,
  onProfileRefresh,
  onEmploymentCountChange,
  onEducationCountChange,
  onLanguagesCountChange,
}: ParsedResumeReviewProps) {
  const { t } = useTranslation();

  const lowConfidenceSet = useMemo(() => new Set(parsed.low_confidence_fields), [parsed]);
  const isFlagged = (path: string) => lowConfidenceSet.has(path);

  // ---- Personal / career scalars — same merge-never-overwrite apply as the
  // original ResumeSection.applyParsedFields, just relocated here. ----
  const [applyingParsed, setApplyingParsed] = useState(false);
  const [parsedApplied, setParsedApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  const flaggedPersonalCareerLabels = useMemo(() => {
    const labels: string[] = [];
    parsed.low_confidence_fields.forEach((path) => {
      const [group, field] = path.split(".");
      const dict = group === "personal" ? PERSONAL_FIELD_LABEL_KEYS : group === "career" ? CAREER_FIELD_LABEL_KEYS : null;
      const key = dict?.[field];
      if (key) labels.push(t(key));
    });
    return labels;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, t]);

  const applyParsedFields = async () => {
    setApplyingParsed(true);
    setApplyError("");
    try {
      const p = parsed.personal;
      await updatePersonalDetails({
        full_name: profile.full_name ? undefined : p.full_name ?? undefined,
        email: profile.email ? undefined : p.email ?? undefined,
        gender: profile.gender ? undefined : (p.gender as CandidateProfile["gender"]) ?? undefined,
        date_of_birth: profile.date_of_birth ? undefined : p.date_of_birth ?? undefined,
        marital_status: profile.marital_status ? undefined : (p.marital_status as CandidateProfile["marital_status"]) ?? undefined,
        address_line_1: profile.address_line_1 ? undefined : p.address_line_1 ?? undefined,
        address_line_2: profile.address_line_2 ? undefined : p.address_line_2 ?? undefined,
        pincode: profile.pincode ? undefined : p.pincode ?? undefined,
      });

      const c = parsed.career;
      await updateCareerPreference({
        experience_years: profile.experience_years !== null ? undefined : c.experience_years ?? undefined,
        current_salary: profile.current_salary !== null ? undefined : c.current_salary ?? undefined,
        expected_salary: profile.expected_salary !== null ? undefined : c.expected_salary ?? undefined,
      });

      await onProfileRefresh();
      setParsedApplied(true);
    } catch (err) {
      setApplyError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setApplyingParsed(false);
    }
  };

  // ---- Employment / education / language rows ----
  const [qualifications, setQualifications] = useState<EducationQualificationOption[]>([]);
  const [languagesMaster, setLanguagesMaster] = useState<LookupRef[]>([]);
  const [rowsReady, setRowsReady] = useState(false);

  const [employmentRows, setEmploymentRows] = useState<Row<EmploymentRowData>[]>([]);
  const [educationRows, setEducationRows] = useState<Row<EducationRowData>[]>([]);
  const [languageRows, setLanguageRows] = useState<Row<LanguageRowData>[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [qualResult, langResult] = await Promise.allSettled([getEducationQualifications(), getLanguagesMaster()]);
      const quals = qualResult.status === "fulfilled" ? qualResult.value : [];
      const langs = langResult.status === "fulfilled" ? langResult.value : [];
      if (cancelled) return;

      setQualifications(quals);
      setLanguagesMaster(langs);

      setEmploymentRows(
        parsed.employment.map((e, sourceIndex) => ({
          key: `emp-${sourceIndex}`,
          sourceIndex,
          accepted: true,
          data: {
            company_name: e.company_name ?? "",
            designation: e.designation ?? "",
            employment_type: normalizeEnum(e.employment_type, EMPLOYMENT_TYPE_VALUES),
            start_date: isoDateOnly(e.start_date),
            end_date: isoDateOnly(e.end_date),
            is_current: e.is_current ?? false,
            location: e.location ?? "",
            description: e.description ?? "",
          },
        }))
      );

      setEducationRows(
        parsed.education.map((e, sourceIndex) => {
          const match = e.qualification ? exactMatch(e.qualification, quals) : undefined;
          return {
            key: `edu-${sourceIndex}`,
            sourceIndex,
            accepted: true,
            data: {
              education_qualification_id: match ? String(match.id) : "",
              institution_name: e.institution ?? "",
              specialization: e.field_of_study ?? "",
              start_date: isoDateOnly(e.start_date),
              end_date: isoDateOnly(e.end_date),
              score: e.grade?.match(/^\s*(\d+(\.\d+)?)/)?.[1] ?? "",
            },
          };
        })
      );

      setLanguageRows(
        parsed.languages.map((l, sourceIndex) => {
          const match = l.language ? exactMatch(l.language, langs) : undefined;
          return {
            key: `lang-${sourceIndex}`,
            sourceIndex,
            accepted: true,
            data: {
              language_id: match ? String(match.id) : "",
              proficiency: normalizeEnum(l.proficiency, PROFICIENCY_VALUES) || "INTERMEDIATE",
              can_read: true,
              can_write: true,
              can_speak: true,
            },
          };
        })
      );

      setRowsReady(true);
    })();

    return () => {
      cancelled = true;
    };
    // parsed is a stable prop for the lifetime of one review screen (a fresh
    // upload gets a fresh ParsedResumeReview mount, not a prop swap).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qualificationOptions = qualifications.map((q) => ({ value: String(q.id), label: q.name }));
  const languageOptions = languagesMaster.map((l) => ({ value: String(l.id), label: l.name }));

  const employmentTypeOptions = EMPLOYMENT_TYPE_VALUES.map((value) => ({
    value,
    label: t(`profile.employment.employmentTypeOptions.${value.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())}`),
  }));
  const proficiencyOptions = PROFICIENCY_VALUES.map((value) => ({
    value,
    label: t(`profile.languages.proficiencyOptions.${value.toLowerCase()}`),
  }));

  const [savingCollections, setSavingCollections] = useState(false);
  const [collectionsSaved, setCollectionsSaved] = useState(false);
  const [collectionsError, setCollectionsError] = useState("");

  const acceptedEmploymentCount = employmentRows.filter((r) => r.accepted).length;
  const acceptedEducationCount = educationRows.filter((r) => r.accepted && r.data.education_qualification_id).length;
  const acceptedLanguageCount = languageRows.filter((r) => r.accepted && r.data.language_id).length;
  const hasAnyAccepted = acceptedEmploymentCount + acceptedEducationCount + acceptedLanguageCount > 0;

  const saveCollections = async () => {
    setSavingCollections(true);
    setCollectionsError("");
    try {
      const payload: {
        employment?: EmploymentPayload[];
        education?: EducationPayload[];
        languages?: LanguagePayload[];
      } = {};

      // Each collection is a full-replace on the backend, so anything we
      // send has to include what's already on file, not just the new rows —
      // otherwise accepting one parsed job would silently delete every job
      // the candidate already added.
      if (acceptedEmploymentCount > 0) {
        const existing = await getEmploymentHistory();
        payload.employment = [
          ...existing.map(employmentRecordToPayload),
          ...employmentRows.filter((r) => r.accepted).map((r) => employmentRowToPayload(r.data)),
        ];
      }

      if (acceptedEducationCount > 0) {
        const existing = await getEducationHistory();
        payload.education = [
          ...existing.map(educationRecordToPayload),
          ...educationRows
            .filter((r) => r.accepted && r.data.education_qualification_id)
            .map((r) => educationRowToPayload(r.data)),
        ];
      }

      if (acceptedLanguageCount > 0) {
        const existing = await getLanguages();
        payload.languages = [
          ...existing.map(languageRecordToPayload),
          ...languageRows.filter((r) => r.accepted && r.data.language_id).map((r) => languageRowToPayload(r.data)),
        ];
      }

      await writeCandidateCollections(payload);

      const [emp, edu, lang] = await Promise.all([getEmploymentHistory(), getEducationHistory(), getLanguages()]);
      onEmploymentCountChange?.(emp.length);
      onEducationCountChange?.(edu.length);
      onLanguagesCountChange?.(lang.length);

      setCollectionsSaved(true);
    } catch (err) {
      setCollectionsError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setSavingCollections(false);
    }
  };

  const hasScalarData =
    Object.values(parsed.personal).some(Boolean) || Object.values(parsed.career).some((v) => v !== null && v !== "");
  const hasArrayData = parsed.employment.length > 0 || parsed.education.length > 0 || parsed.languages.length > 0;

  if (!hasScalarData && !hasArrayData) return null;

  return (
    <div className="space-y-5">
      {hasScalarData && (
        <div className="rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 p-4">
          <div className="flex items-center gap-2">
            <SparkleIcon className="size-4 text-jz-yellow-400" />
            <p className="text-sm font-medium text-jz-yellow-400">{t("profile.resume.autoFill.heading")}</p>
          </div>
          <p className="mt-1.5 text-sm text-jz-white-200">
            {t("profile.resume.autoFill.summary", {
              employment: parsed.employment.length,
              education: parsed.education.length,
              languages: parsed.languages.length,
            })}
          </p>
          {flaggedPersonalCareerLabels.length > 0 && (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-jz-yellow-400">
              <SparkleIcon className="size-3" />
              {t("profile.upload.pleaseCheck", { fields: flaggedPersonalCareerLabels.join(", ") })}
            </p>
          )}
          {applyError && <p className="mt-2 text-xs text-jz-red-600">{applyError}</p>}
          {!parsedApplied ? (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={applyParsedFields}
                disabled={applyingParsed}
                className="rounded-lg bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-3.5 py-2 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {applyingParsed ? t("profile.saving") : t("profile.resume.autoFill.apply")}
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#8FD13F]">{t("profile.resume.autoFill.applied")}</p>
          )}
          <p className="mt-2 text-xs text-jz-white-600">{t("profile.resume.autoFill.note")}</p>
        </div>
      )}

      {!rowsReady && hasArrayData && <p className="text-sm text-jz-white-400">{t("profile.loading")}</p>}

      {rowsReady && hasArrayData && (
        <div className="space-y-4">
          {employmentRows.length > 0 && (
            <RowGroup
              titleKey="profile.employment.heading"
              rows={employmentRows}
              onToggle={(key) => setEmploymentRows((rows) => rows.map((r) => (r.key === key ? { ...r, accepted: !r.accepted } : r)))}
              onEdit={(key, data) => setEmploymentRows((rows) => rows.map((r) => (r.key === key ? { ...r, data } : r)))}
              renderFields={(row, onChange) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormInput
                    label={t("profile.employment.companyNameLabel")}
                    value={row.data.company_name}
                    onChange={(e) => onChange({ ...row.data, company_name: e.target.value })}
                    className={isFlagged(`employment.${row.sourceIndex}.company_name`) ? flaggedInputClass : ""}
                  />
                  <FormInput
                    label={t("profile.employment.designationLabel")}
                    value={row.data.designation}
                    onChange={(e) => onChange({ ...row.data, designation: e.target.value })}
                    className={isFlagged(`employment.${row.sourceIndex}.designation`) ? flaggedInputClass : ""}
                  />
                  <FormSelect
                    label={t("profile.employment.employmentTypeLabel")}
                    placeholder={t("profile.employment.employmentTypePlaceholder")}
                    options={employmentTypeOptions}
                    value={row.data.employment_type}
                    onChange={(e) => onChange({ ...row.data, employment_type: e.target.value as EmploymentType })}
                  />
                  <FormInput
                    label={t("profile.employment.locationLabel")}
                    value={row.data.location}
                    onChange={(e) => onChange({ ...row.data, location: e.target.value })}
                  />
                  <FormInput
                    label={t("profile.employment.startDateLabel")}
                    type="date"
                    value={row.data.start_date}
                    onChange={(e) => onChange({ ...row.data, start_date: e.target.value })}
                    className={isFlagged(`employment.${row.sourceIndex}.start_date`) ? flaggedInputClass : ""}
                  />
                  {!row.data.is_current && (
                    <FormInput
                      label={t("profile.employment.endDateLabel")}
                      type="date"
                      value={row.data.end_date}
                      onChange={(e) => onChange({ ...row.data, end_date: e.target.value })}
                    />
                  )}
                  <Checkbox
                    label={t("profile.employment.isCurrentLabel")}
                    checked={row.data.is_current}
                    onChange={(e) => onChange({ ...row.data, is_current: e.target.checked })}
                    className="sm:col-span-2"
                  />
                </div>
              )}
            />
          )}

          {educationRows.length > 0 && (
            <RowGroup
              titleKey="profile.education.heading"
              rows={educationRows}
              onToggle={(key) => setEducationRows((rows) => rows.map((r) => (r.key === key ? { ...r, accepted: !r.accepted } : r)))}
              onEdit={(key, data) => setEducationRows((rows) => rows.map((r) => (r.key === key ? { ...r, data } : r)))}
              renderFields={(row, onChange) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormSelect
                    label={t("profile.education.qualificationLabel")}
                    placeholder={t("profile.education.qualificationPlaceholder")}
                    options={qualificationOptions}
                    value={row.data.education_qualification_id}
                    onChange={(e) => onChange({ ...row.data, education_qualification_id: e.target.value })}
                    className={!row.data.education_qualification_id ? flaggedInputClass : ""}
                  />
                  <FormInput
                    label={t("profile.education.institutionLabel")}
                    value={row.data.institution_name}
                    onChange={(e) => onChange({ ...row.data, institution_name: e.target.value })}
                    className={isFlagged(`education.${row.sourceIndex}.institution_name`) ? flaggedInputClass : ""}
                  />
                  <FormInput
                    label={t("profile.education.specializationLabel")}
                    value={row.data.specialization}
                    onChange={(e) => onChange({ ...row.data, specialization: e.target.value })}
                  />
                  <FormInput
                    label={t("profile.education.scoreLabel")}
                    type="number"
                    min={0}
                    max={100}
                    value={row.data.score}
                    onChange={(e) => onChange({ ...row.data, score: e.target.value })}
                  />
                  <FormInput
                    label={t("profile.education.startDateLabel")}
                    type="date"
                    value={row.data.start_date}
                    onChange={(e) => onChange({ ...row.data, start_date: e.target.value })}
                    className={isFlagged(`education.${row.sourceIndex}.start_date`) ? flaggedInputClass : ""}
                  />
                  <FormInput
                    label={t("profile.education.endDateLabel")}
                    type="date"
                    value={row.data.end_date}
                    onChange={(e) => onChange({ ...row.data, end_date: e.target.value })}
                  />
                  {!row.data.education_qualification_id && (
                    <p className="text-xs text-jz-yellow-400 sm:col-span-2">{t("profile.upload.pickQualification")}</p>
                  )}
                </div>
              )}
            />
          )}

          {languageRows.length > 0 && (
            <RowGroup
              titleKey="profile.languages.heading"
              rows={languageRows}
              onToggle={(key) => setLanguageRows((rows) => rows.map((r) => (r.key === key ? { ...r, accepted: !r.accepted } : r)))}
              onEdit={(key, data) => setLanguageRows((rows) => rows.map((r) => (r.key === key ? { ...r, data } : r)))}
              renderFields={(row, onChange) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormSelect
                    label={t("profile.languages.languageLabel")}
                    placeholder={t("profile.languages.languagePlaceholder")}
                    options={languageOptions}
                    value={row.data.language_id}
                    onChange={(e) => onChange({ ...row.data, language_id: e.target.value })}
                    className={!row.data.language_id ? flaggedInputClass : ""}
                  />
                  <FormSelect
                    label={t("profile.languages.proficiencyLabel")}
                    options={proficiencyOptions}
                    value={row.data.proficiency}
                    onChange={(e) => onChange({ ...row.data, proficiency: e.target.value as LanguageProficiency })}
                  />
                  <div className="flex items-center gap-4 sm:col-span-2">
                    <Checkbox label={t("profile.languages.canRead")} checked={row.data.can_read} onChange={(e) => onChange({ ...row.data, can_read: e.target.checked })} />
                    <Checkbox label={t("profile.languages.canWrite")} checked={row.data.can_write} onChange={(e) => onChange({ ...row.data, can_write: e.target.checked })} />
                    <Checkbox label={t("profile.languages.canSpeak")} checked={row.data.can_speak} onChange={(e) => onChange({ ...row.data, can_speak: e.target.checked })} />
                  </div>
                  {!row.data.language_id && <p className="text-xs text-jz-yellow-400 sm:col-span-2">{t("profile.upload.pickLanguage")}</p>}
                </div>
              )}
            />
          )}

          {collectionsError && <p className="text-sm text-jz-red-600">{collectionsError}</p>}

          {!collectionsSaved ? (
            <button
              type="button"
              onClick={saveCollections}
              disabled={!hasAnyAccepted || savingCollections}
              className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {savingCollections ? t("profile.saving") : t("profile.upload.saveSelected")}
            </button>
          ) : (
            <p className="text-sm text-[#8FD13F]">{t("profile.upload.collectionsSaved")}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row <-> API payload mappers
// ---------------------------------------------------------------------------

const employmentRowToPayload = (data: EmploymentRowData): EmploymentPayload => ({
  company_name: data.company_name,
  designation: data.designation,
  employment_type: data.employment_type || null,
  start_date: data.start_date,
  end_date: data.is_current ? null : data.end_date || null,
  is_current: data.is_current,
  location: data.location || null,
  description: data.description || null,
});

const employmentRecordToPayload = (r: EmploymentRecord): EmploymentPayload => ({
  company_name: r.company_name,
  designation: r.designation,
  employment_type: r.employment_type,
  start_date: r.start_date,
  end_date: r.end_date,
  is_current: r.is_current,
  location: r.location,
  description: r.description,
});

const educationRowToPayload = (data: EducationRowData): EducationPayload => ({
  education_qualification_id: Number(data.education_qualification_id),
  institution_name: data.institution_name,
  specialization: data.specialization || null,
  start_date: data.start_date,
  end_date: data.end_date || null,
  score: data.score ? Number(data.score) : null,
});

const educationRecordToPayload = (r: EducationRecord): EducationPayload => ({
  education_qualification_id: r.education_qualification_id,
  institution_name: r.institution_name,
  specialization: r.specialization,
  start_date: r.start_date,
  end_date: r.end_date,
  score: typeof r.score === "string" ? Number(r.score) : r.score,
});

const languageRowToPayload = (data: LanguageRowData): LanguagePayload => ({
  language_id: Number(data.language_id),
  proficiency: (data.proficiency || "INTERMEDIATE") as LanguageProficiency,
  can_read: data.can_read,
  can_write: data.can_write,
  can_speak: data.can_speak,
});

const languageRecordToPayload = (r: CandidateLanguageRecord): LanguagePayload => ({
  language_id: r.language_id,
  proficiency: r.proficiency,
  can_read: r.can_read,
  can_write: r.can_write,
  can_speak: r.can_speak,
});

// ---------------------------------------------------------------------------
// Shared accept/reject row-group shell
// ---------------------------------------------------------------------------

function RowGroup<T>({
  titleKey,
  rows,
  onToggle,
  onEdit,
  renderFields,
}: {
  titleKey: string;
  rows: Row<T>[];
  onToggle: (key: string) => void;
  onEdit: (key: string, data: T) => void;
  renderFields: (row: Row<T>, onChange: (data: T) => void) => ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-jz-white-50">{t(titleKey)}</h3>
      <div className="mt-2 space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className={`rounded-xl border p-4 transition-opacity ${
              row.accepted ? "border-jz-yellow-400/30 bg-jz-blue-900/60" : "border-jz-border bg-jz-blue-900/30 opacity-50"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <Checkbox label={t("profile.upload.include")} checked={row.accepted} onChange={() => onToggle(row.key)} />
              {!row.accepted && (
                <span className="flex items-center gap-1 text-xs text-jz-white-600">
                  <CrossIcon className="size-3.5" />
                  {t("profile.upload.documents.reject")}
                </span>
              )}
            </div>
            {row.accepted && renderFields(row, (data) => onEdit(row.key, data))}
          </div>
        ))}
      </div>
    </div>
  );
}
