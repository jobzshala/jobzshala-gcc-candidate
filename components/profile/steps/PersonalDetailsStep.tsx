"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { ApiError } from "@/lib/api/client";
import {
  updatePersonalDetails,
  getCountries,
  getRegions,
  getCities,
  type CandidateProfile,
  type CountryOption,
  type RegionOption,
  type CityOption,
  type Gender,
  type MaritalStatus,
} from "@/lib/api/candidate";

type FormState = {
  full_name: string;
  email: string;
  gender: Gender | "";
  age: string;
  date_of_birth: string;
  marital_status: MaritalStatus | "";
  current_country_id: string;
  region_id: string;
  city_id: string;
  address_line_1: string;
  address_line_2: string;
  pincode: string;
};

const toDateInputValue = (value: string | null): string => (value ? value.slice(0, 10) : "");

// Derives whole years from a "YYYY-MM-DD" date-input value so age never goes
// stale once a real date of birth is known — DOB is the source of truth,
// age alone drifts every birthday and can be typed wrong.
const calculateAge = (dateOfBirth: string): string => {
  if (!dateOfBirth) return "";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  return age >= 0 ? String(age) : "";
};

const formFromProfile = (profile: CandidateProfile): FormState => ({
  full_name: profile.full_name ?? "",
  email: profile.email ?? "",
  gender: profile.gender ?? "",
  age: profile.age !== null ? String(profile.age) : "",
  date_of_birth: toDateInputValue(profile.date_of_birth),
  marital_status: profile.marital_status ?? "",
  current_country_id: profile.current_country ? String(profile.current_country.id) : "",
  region_id: profile.region ? String(profile.region.id) : "",
  city_id: profile.city ? String(profile.city.id) : "",
  address_line_1: profile.address_line_1 ?? "",
  address_line_2: profile.address_line_2 ?? "",
  pincode: profile.pincode ?? "",
});

interface PersonalDetailsStepProps {
  profile: CandidateProfile;
  // Awaited before the wizard shell advances to the next step — tabs shell
  // just uses it to refresh `profile` in place.
  onSaved: () => Promise<void>;
  saveLabel?: string;
  // Renders a subset of fields — the wizard defers address/pincode to keep
  // the first mobile screens short; the tabs shell shows everything at once
  // (see the mockup's "field deferral only on mobile" rationale).
  compact?: boolean;
}

export default function PersonalDetailsStep({ profile, onSaved, saveLabel, compact = false }: PersonalDetailsStepProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>(() => formFromProfile(profile));
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(formFromProfile(profile));
  }, [profile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getCountries()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!form.current_country_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegions([]);
      return;
    }
    getRegions(Number(form.current_country_id))
      .then(setRegions)
      .catch(() => setRegions([]));
  }, [form.current_country_id]);

  useEffect(() => {
    if (!form.region_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCities([]);
      return;
    }
    getCities(Number(form.region_id))
      .then(setCities)
      .catch(() => setCities([]));
  }, [form.region_id]);

  const countryOptions = countries.map((c) => ({ value: String(c.id), label: c.name }));
  const regionOptions = regions.map((r) => ({ value: String(r.id), label: r.name }));
  const cityOptions = cities.map((c) => ({ value: String(c.id), label: c.name }));

  const genderOptions = [
    { value: "MALE", label: t("profile.personalDetails.genderOptions.male") },
    { value: "FEMALE", label: t("profile.personalDetails.genderOptions.female") },
    { value: "OTHER", label: t("profile.personalDetails.genderOptions.other") },
  ];

  const maritalStatusOptions = [
    { value: "SINGLE", label: t("profile.personalDetails.maritalStatusOptions.single") },
    { value: "MARRIED", label: t("profile.personalDetails.maritalStatusOptions.married") },
    { value: "DIVORCED", label: t("profile.personalDetails.maritalStatusOptions.divorced") },
    { value: "SEPARATED", label: t("profile.personalDetails.maritalStatusOptions.separated") },
    { value: "WIDOWED", label: t("profile.personalDetails.maritalStatusOptions.widowed") },
  ];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaveError("");
    setSaving(true);
    try {
      await updatePersonalDetails({
        full_name: form.full_name,
        email: form.email,
        gender: form.gender || undefined,
        age: form.age ? Number(form.age) : undefined,
        current_country_id: form.current_country_id ? Number(form.current_country_id) : null,
        region_id: form.region_id ? Number(form.region_id) : null,
        city_id: form.city_id ? Number(form.city_id) : null,
        date_of_birth: form.date_of_birth || null,
        marital_status: form.marital_status || null,
        address_line_1: form.address_line_1 || null,
        address_line_2: form.address_line_2 || null,
        pincode: form.pincode || null,
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
        <FormInput
          label={t("profile.personalDetails.fullNameLabel")}
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          error={errors.full_name}
        />
        <FormInput
          label={t("profile.personalDetails.emailLabel")}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <FormInput label={t("profile.personalDetails.mobileLabel")} value={profile.mobile_number} disabled />
        <FormSelect
          label={t("profile.personalDetails.genderLabel")}
          placeholder={t("profile.personalDetails.genderPlaceholder")}
          options={genderOptions}
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
          error={errors.gender}
        />
        <FormInput
          label={t("profile.personalDetails.ageLabel")}
          type="number"
          min={18}
          max={60}
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          error={errors.age}
        />
        <FormSelect
          label={t("profile.personalDetails.currentCountryLabel")}
          placeholder={t("profile.personalDetails.currentCountryPlaceholder")}
          options={countryOptions}
          value={form.current_country_id}
          onChange={(e) => setForm({ ...form, current_country_id: e.target.value, region_id: "", city_id: "" })}
          error={errors.current_country_id}
        />
        <FormSelect
          label={t("profile.personalDetails.regionLabel")}
          placeholder={t("profile.personalDetails.regionPlaceholder")}
          options={regionOptions}
          value={form.region_id}
          onChange={(e) => setForm({ ...form, region_id: e.target.value, city_id: "" })}
          disabled={!form.current_country_id}
          error={errors.region_id}
        />
        <FormSelect
          label={t("profile.personalDetails.cityLabel")}
          placeholder={t("profile.personalDetails.cityPlaceholder")}
          options={cityOptions}
          value={form.city_id}
          onChange={(e) => setForm({ ...form, city_id: e.target.value })}
          disabled={!form.region_id}
          error={errors.city_id}
        />

        {/* Address/DOB/marital status: real matching value comes from
            country+city, not street address — deferred on mobile to keep the
            wizard's first screens short, always shown in the tabs shell. */}
        {!compact && (
          <>
            <FormInput
              label={t("profile.personalDetails.dateOfBirthLabel")}
              type="date"
              value={form.date_of_birth}
              onChange={(e) => {
                const date_of_birth = e.target.value;
                const computedAge = calculateAge(date_of_birth);
                setForm((f) => ({ ...f, date_of_birth, age: computedAge || f.age }));
              }}
              error={errors.date_of_birth}
            />
            <FormSelect
              label={t("profile.personalDetails.maritalStatusLabel")}
              placeholder={t("profile.personalDetails.maritalStatusPlaceholder")}
              options={maritalStatusOptions}
              value={form.marital_status}
              onChange={(e) => setForm({ ...form, marital_status: e.target.value as MaritalStatus })}
              error={errors.marital_status}
            />
            <FormInput
              label={t("profile.personalDetails.pincodeLabel")}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              error={errors.pincode}
            />
            <FormInput
              label={t("profile.personalDetails.addressLine1Label")}
              value={form.address_line_1}
              onChange={(e) => setForm({ ...form, address_line_1: e.target.value })}
              error={errors.address_line_1}
            />
            <FormInput
              label={t("profile.personalDetails.addressLine2Label")}
              value={form.address_line_2}
              onChange={(e) => setForm({ ...form, address_line_2: e.target.value })}
              error={errors.address_line_2}
            />
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {saving ? t("profile.saving") : saveLabel ?? t("profile.save")}
      </button>
    </form>
  );
}
