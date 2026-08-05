"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Checkbox from "@/components/ui/Checkbox";
import { ApiError } from "@/lib/api/client";
import {
  updateCareerPreference,
  getCountries,
  getJobIndustries,
  getJobFunctionalAreas,
  getJobDepartments,
  getJobTitles,
  type CandidateProfile,
  type CountryOption,
  type LookupRef,
} from "@/lib/api/candidate";

type FormState = {
  job_industry_id: string;
  job_functional_area_id: string;
  job_department_id: string;
  job_title_id: string;
  preferred_country_id: string;
  experience_years: string;
  current_salary: string;
  expected_salary: string;
  has_gcc_experience: boolean;
};

const toDisplayValue = (value: number | string | null): string =>
  value === null || value === undefined || value === "" ? "" : String(value);

const formFromProfile = (profile: CandidateProfile): FormState => ({
  job_industry_id: profile.job_industry ? String(profile.job_industry.id) : "",
  job_functional_area_id: profile.job_functional_area ? String(profile.job_functional_area.id) : "",
  job_department_id: profile.job_department ? String(profile.job_department.id) : "",
  job_title_id: profile.job_title ? String(profile.job_title.id) : "",
  preferred_country_id: profile.preferred_country ? String(profile.preferred_country.id) : "",
  experience_years: toDisplayValue(profile.experience_years),
  current_salary: toDisplayValue(profile.current_salary),
  expected_salary: toDisplayValue(profile.expected_salary),
  has_gcc_experience: profile.has_gcc_experience ?? false,
});

interface CareerPreferenceStepProps {
  profile: CandidateProfile;
  onSaved: () => Promise<void>;
  saveLabel?: string;
  // Wizard's first pass only needs job category + preferred country — the
  // pair that actually drives the "N jobs match" teaser. Salary/GCC
  // experience/department are deferred, matching the mockup's field split.
  compact?: boolean;
}

export default function CareerPreferenceStep({ profile, onSaved, saveLabel, compact = false }: CareerPreferenceStepProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>(() => formFromProfile(profile));
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [jobIndustries, setJobIndustries] = useState<LookupRef[]>([]);
  const [jobFunctionalAreas, setJobFunctionalAreas] = useState<LookupRef[]>([]);
  const [jobDepartments, setJobDepartments] = useState<LookupRef[]>([]);
  const [jobTitles, setJobTitles] = useState<LookupRef[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(formFromProfile(profile));
  }, [profile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getCountries().then(setCountries).catch(() => setCountries([]));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getJobIndustries().then(setJobIndustries).catch(() => setJobIndustries([]));
  }, []);

  useEffect(() => {
    // No industry filter fetches every functional area — lets compact mode
    // (industry select hidden) offer "Job Category" as one flat picker,
    // matching the mockup's single-field mobile step instead of forcing the
    // industry→category cascade the full form uses.
    getJobFunctionalAreas(form.job_industry_id ? Number(form.job_industry_id) : undefined)
      .then(setJobFunctionalAreas)
      .catch(() => setJobFunctionalAreas([]));
  }, [form.job_industry_id]);

  useEffect(() => {
    if (!form.job_functional_area_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobDepartments([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobTitles([]);
      return;
    }
    getJobDepartments(Number(form.job_functional_area_id))
      .then(setJobDepartments)
      .catch(() => setJobDepartments([]));
    getJobTitles({ jobFunctionalAreaId: Number(form.job_functional_area_id) })
      .then(setJobTitles)
      .catch(() => setJobTitles([]));
  }, [form.job_functional_area_id]);

  const countryOptions = countries.map((c) => ({ value: String(c.id), label: c.name }));
  const jobIndustryOptions = jobIndustries.map((i) => ({ value: String(i.id), label: i.name }));
  const jobFunctionalAreaOptions = jobFunctionalAreas.map((a) => ({ value: String(a.id), label: a.name }));
  const jobDepartmentOptions = jobDepartments.map((d) => ({ value: String(d.id), label: d.name }));
  const jobTitleOptions = jobTitles.map((jt) => ({ value: String(jt.id), label: jt.name }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaveError("");
    setSaving(true);
    try {
      await updateCareerPreference({
        job_industry_id: form.job_industry_id ? Number(form.job_industry_id) : null,
        job_functional_area_id: form.job_functional_area_id ? Number(form.job_functional_area_id) : null,
        job_department_id: form.job_department_id ? Number(form.job_department_id) : null,
        job_title_id: form.job_title_id ? Number(form.job_title_id) : null,
        preferred_country_id: form.preferred_country_id ? Number(form.preferred_country_id) : null,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        current_salary: form.current_salary ? Number(form.current_salary) : null,
        expected_salary: form.expected_salary ? Number(form.expected_salary) : null,
        has_gcc_experience: form.has_gcc_experience,
      });
      await onSaved();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors ?? {});
        setSaveError(err.message);
      } else {
        setSaveError(t("profile.saveError"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {saveError && (
        <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
          {saveError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label={t("profile.careerPreference.jobFunctionalAreaLabel")}
          placeholder={t("profile.careerPreference.jobFunctionalAreaPlaceholder")}
          options={jobFunctionalAreaOptions}
          value={form.job_functional_area_id}
          onChange={(e) =>
            setForm({ ...form, job_functional_area_id: e.target.value, job_department_id: "", job_title_id: "" })
          }
          disabled={!form.job_industry_id}
          error={errors.job_functional_area_id}
        />
        <FormSelect
          label={t("profile.careerPreference.preferredCountryLabel")}
          placeholder={t("profile.careerPreference.preferredCountryPlaceholder")}
          options={countryOptions}
          value={form.preferred_country_id}
          onChange={(e) => setForm({ ...form, preferred_country_id: e.target.value })}
          error={errors.preferred_country_id}
        />

        {!compact && (
          <>
            <FormSelect
              label={t("profile.careerPreference.jobIndustryLabel")}
              placeholder={t("profile.careerPreference.jobIndustryPlaceholder")}
              options={jobIndustryOptions}
              value={form.job_industry_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  job_industry_id: e.target.value,
                  job_functional_area_id: "",
                  job_department_id: "",
                  job_title_id: "",
                })
              }
              error={errors.job_industry_id}
            />
            <FormSelect
              label={t("profile.careerPreference.jobDepartmentLabel")}
              placeholder={t("profile.careerPreference.jobDepartmentPlaceholder")}
              options={jobDepartmentOptions}
              value={form.job_department_id}
              onChange={(e) => setForm({ ...form, job_department_id: e.target.value })}
              disabled={!form.job_functional_area_id}
              error={errors.job_department_id}
            />
            <FormSelect
              label={t("profile.careerPreference.jobTitleLabel")}
              placeholder={t("profile.careerPreference.jobTitlePlaceholder")}
              options={jobTitleOptions}
              value={form.job_title_id}
              onChange={(e) => setForm({ ...form, job_title_id: e.target.value })}
              disabled={!form.job_functional_area_id}
              error={errors.job_title_id}
            />
            <FormInput
              label={t("profile.careerPreference.experienceYearsLabel")}
              type="number"
              min={0}
              max={50}
              step="0.5"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              error={errors.experience_years}
            />
            <FormInput
              label={t("profile.careerPreference.currentSalaryLabel")}
              type="number"
              min={0}
              value={form.current_salary}
              onChange={(e) => setForm({ ...form, current_salary: e.target.value })}
              error={errors.current_salary}
            />
            <FormInput
              label={t("profile.careerPreference.expectedSalaryLabel")}
              type="number"
              min={0}
              value={form.expected_salary}
              onChange={(e) => setForm({ ...form, expected_salary: e.target.value })}
              error={errors.expected_salary}
            />
          </>
        )}
      </div>

      {!compact && (
        <Checkbox
          label={t("profile.careerPreference.hasGccExperienceLabel")}
          checked={form.has_gcc_experience}
          onChange={(e) => setForm({ ...form, has_gcc_experience: e.target.checked })}
        />
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--green-600)] px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {saving ? t("profile.saving") : saveLabel ?? t("profile.save")}
      </button>
    </form>
  );
}
