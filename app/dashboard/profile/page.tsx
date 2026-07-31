"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { UserIcon, SparkleIcon, TargetIcon } from "@/components/ui/icons";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import Checkbox from "@/components/ui/Checkbox";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import ProfileSidebarNav from "@/components/profile/ProfileSidebarNav";
import EmploymentSection from "@/components/profile/EmploymentSection";
import EducationSection from "@/components/profile/EducationSection";
import LanguagesSection from "@/components/profile/LanguagesSection";
import ResumeSection from "@/components/profile/ResumeSection";
import VideoSection from "@/components/profile/VideoSection";
import DocumentsSection from "@/components/profile/DocumentsSection";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { ApiError } from "@/lib/api/client";
import {
  getProfile,
  updatePersonalDetails,
  updateCareerPreference,
  getCountries,
  getRegions,
  getCities,
  getJobIndustries,
  getJobFunctionalAreas,
  getJobDepartments,
  getJobTitles,
  getEmploymentHistory,
  getEducationHistory,
  getLanguages,
  getDocuments,
  type CandidateProfile,
  type CountryOption,
  type RegionOption,
  type CityOption,
  type LookupRef,
  type Gender,
  type MaritalStatus,
} from "@/lib/api/candidate";

type PersonalForm = {
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

type CareerForm = {
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

const toDateInputValue = (value: string | null): string => (value ? value.slice(0, 10) : "");
const toDisplayValue = (value: number | string | null): string =>
  value === null || value === undefined || value === "" ? "" : String(value);

const personalFormFromProfile = (profile: CandidateProfile): PersonalForm => ({
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

const careerFormFromProfile = (profile: CandidateProfile): CareerForm => ({
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

function ViewField({ label, value }: { label: string; value: string | null }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-xs text-jz-white-600">{label}</p>
      <p className="mt-1 text-sm text-jz-white-100">{value || t("profile.notProvided")}</p>
    </div>
  );
}

const KYC_STATUS_TONE: Record<string, string> = {
  VERIFIED: "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#8FD13F]",
  PENDING: "border-jz-yellow-400/30 bg-jz-yellow-400/10 text-jz-yellow-400",
  REJECTED: "border-jz-red-600/40 bg-jz-red-600/10 text-jz-red-600",
};

const PASSPORT_STATUS_TONE: Record<string, string> = {
  AVAILABLE: "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#8FD13F]",
  APPLIED: "border-jz-yellow-400/30 bg-jz-yellow-400/10 text-jz-yellow-400",
  NOT_AVAILABLE: "border-jz-white-600/40 bg-jz-white-600/10 text-jz-white-400",
};

function StatusBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [completionCounts, setCompletionCounts] = useState({
    employmentCount: 0,
    educationCount: 0,
    languagesCount: 0,
    documentsCount: 0,
  });

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [jobIndustries, setJobIndustries] = useState<LookupRef[]>([]);
  const [jobFunctionalAreas, setJobFunctionalAreas] = useState<LookupRef[]>([]);
  const [careerDepartments, setCareerDepartments] = useState<LookupRef[]>([]);

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState<PersonalForm | null>(null);
  const [personalRegions, setPersonalRegions] = useState<RegionOption[]>([]);
  const [personalCities, setPersonalCities] = useState<CityOption[]>([]);
  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});
  const [personalSaveError, setPersonalSaveError] = useState("");
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryForm, setSummaryForm] = useState("");
  const [summarySaveError, setSummarySaveError] = useState("");
  const [savingSummary, setSavingSummary] = useState(false);

  const [editingCareer, setEditingCareer] = useState(false);
  const [careerForm, setCareerForm] = useState<CareerForm | null>(null);
  const [careerJobTitles, setCareerJobTitles] = useState<LookupRef[]>([]);
  const [careerErrors, setCareerErrors] = useState<Record<string, string>>({});
  const [careerSaveError, setCareerSaveError] = useState("");
  const [savingCareer, setSavingCareer] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [profileData, employment, education, languages, documents] = await Promise.all([
        getProfile(),
        getEmploymentHistory(),
        getEducationHistory(),
        getLanguages(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setCompletionCounts({
        employmentCount: employment.length,
        educationCount: education.length,
        languagesCount: languages.length,
        documentsCount: documents.length,
      });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setProfile(await getProfile());
    } catch {
      // Keep showing the last known-good profile — the save itself already
      // succeeded, this is just the follow-up read.
    }
  };

  useEffect(() => {
    // Fetch-on-mount — loadProfile's setState calls happen inside its own
    // async continuation, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  useEffect(() => {
    // Sections only exist in the DOM once loading clears, so a same-navigation
    // `#section-id` hash (e.g. from the dashboard overview's quick links)
    // targets an element that doesn't exist yet when Next.js's router tries
    // to scroll to it — it silently gives up instead of retrying. Do the
    // scroll ourselves once the real content has painted.
    if (loading || !profile || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [loading, profile]);

  useEffect(() => {
    if (!editingPersonal && !editingCareer) return;
    if (countries.length > 0) return;
    getCountries()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, [editingPersonal, editingCareer, countries.length]);

  useEffect(() => {
    if (!editingCareer || jobIndustries.length > 0) return;
    getJobIndustries()
      .then(setJobIndustries)
      .catch(() => setJobIndustries([]));
  }, [editingCareer, jobIndustries.length]);

  useEffect(() => {
    if (!editingCareer || !careerForm?.job_industry_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobFunctionalAreas([]);
      return;
    }
    getJobFunctionalAreas(Number(careerForm.job_industry_id))
      .then(setJobFunctionalAreas)
      .catch(() => setJobFunctionalAreas([]));
  }, [editingCareer, careerForm?.job_industry_id]);

  useEffect(() => {
    if (!editingCareer || !careerForm?.job_functional_area_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCareerDepartments([]);
      return;
    }
    getJobDepartments(Number(careerForm.job_functional_area_id))
      .then(setCareerDepartments)
      .catch(() => setCareerDepartments([]));
  }, [editingCareer, careerForm?.job_functional_area_id]);

  useEffect(() => {
    if (!editingPersonal || !personalForm?.current_country_id) {
      // Reset dependent state when the parent selection is cleared —
      // coupled with the fetch below for when it isn't, so this stays in
      // the same effect rather than being split into a derived value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPersonalRegions([]);
      return;
    }
    getRegions(Number(personalForm.current_country_id))
      .then(setPersonalRegions)
      .catch(() => setPersonalRegions([]));
  }, [editingPersonal, personalForm?.current_country_id]);

  useEffect(() => {
    if (!editingPersonal || !personalForm?.region_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPersonalCities([]);
      return;
    }
    getCities(Number(personalForm.region_id))
      .then(setPersonalCities)
      .catch(() => setPersonalCities([]));
  }, [editingPersonal, personalForm?.region_id]);

  useEffect(() => {
    if (!editingCareer || !careerForm?.job_functional_area_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCareerJobTitles([]);
      return;
    }
    getJobTitles({ jobFunctionalAreaId: Number(careerForm.job_functional_area_id) })
      .then(setCareerJobTitles)
      .catch(() => setCareerJobTitles([]));
  }, [editingCareer, careerForm?.job_functional_area_id]);

  const startEditPersonal = () => {
    if (!profile) return;
    setPersonalForm(personalFormFromProfile(profile));
    setPersonalErrors({});
    setPersonalSaveError("");
    setEditingPersonal(true);
  };

  const startEditCareer = () => {
    if (!profile) return;
    setCareerForm(careerFormFromProfile(profile));
    setCareerErrors({});
    setCareerSaveError("");
    setEditingCareer(true);
  };

  const startEditSummary = () => {
    if (!profile) return;
    setSummaryForm(profile.summary ?? "");
    setSummarySaveError("");
    setEditingSummary(true);
  };

  const submitSummary = async (e: FormEvent) => {
    e.preventDefault();
    setSummarySaveError("");
    setSavingSummary(true);
    try {
      await updatePersonalDetails({ summary: summaryForm.trim() || null });
      await refreshProfile();
      setEditingSummary(false);
    } catch (err) {
      setSummarySaveError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setSavingSummary(false);
    }
  };

  const submitPersonal = async (e: FormEvent) => {
    e.preventDefault();
    if (!personalForm) return;

    setPersonalErrors({});
    setPersonalSaveError("");
    setSavingPersonal(true);
    try {
      await updatePersonalDetails({
        full_name: personalForm.full_name,
        email: personalForm.email,
        gender: personalForm.gender || undefined,
        age: personalForm.age ? Number(personalForm.age) : undefined,
        current_country_id: personalForm.current_country_id ? Number(personalForm.current_country_id) : null,
        region_id: personalForm.region_id ? Number(personalForm.region_id) : null,
        city_id: personalForm.city_id ? Number(personalForm.city_id) : null,
        date_of_birth: personalForm.date_of_birth || null,
        marital_status: personalForm.marital_status || null,
        address_line_1: personalForm.address_line_1 || null,
        address_line_2: personalForm.address_line_2 || null,
        pincode: personalForm.pincode || null,
      });
      await refreshProfile();
      setEditingPersonal(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setPersonalErrors(err.fieldErrors ?? {});
        setPersonalSaveError(err.message);
      } else {
        setPersonalSaveError(t("profile.saveError"));
      }
    } finally {
      setSavingPersonal(false);
    }
  };

  const submitCareer = async (e: FormEvent) => {
    e.preventDefault();
    if (!careerForm) return;

    setCareerErrors({});
    setCareerSaveError("");
    setSavingCareer(true);
    try {
      await updateCareerPreference({
        job_industry_id: careerForm.job_industry_id ? Number(careerForm.job_industry_id) : null,
        job_functional_area_id: careerForm.job_functional_area_id ? Number(careerForm.job_functional_area_id) : null,
        job_department_id: careerForm.job_department_id ? Number(careerForm.job_department_id) : null,
        job_title_id: careerForm.job_title_id ? Number(careerForm.job_title_id) : null,
        preferred_country_id: careerForm.preferred_country_id ? Number(careerForm.preferred_country_id) : null,
        experience_years: careerForm.experience_years ? Number(careerForm.experience_years) : null,
        current_salary: careerForm.current_salary ? Number(careerForm.current_salary) : null,
        expected_salary: careerForm.expected_salary ? Number(careerForm.expected_salary) : null,
        has_gcc_experience: careerForm.has_gcc_experience,
      });
      await refreshProfile();
      setEditingCareer(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setCareerErrors(err.fieldErrors ?? {});
        setCareerSaveError(err.message);
      } else {
        setCareerSaveError(t("profile.saveError"));
      }
    } finally {
      setSavingCareer(false);
    }
  };

  const countryOptions = countries.map((c) => ({ value: String(c.id), label: c.name }));
  const regionOptions = personalRegions.map((r) => ({ value: String(r.id), label: r.name }));
  const cityOptions = personalCities.map((c) => ({ value: String(c.id), label: c.name }));
  const jobIndustryOptions = jobIndustries.map((i) => ({ value: String(i.id), label: i.name }));
  const jobFunctionalAreaOptions = jobFunctionalAreas.map((a) => ({ value: String(a.id), label: a.name }));
  const jobDepartmentOptions = careerDepartments.map((d) => ({ value: String(d.id), label: d.name }));
  const jobTitleOptions = careerJobTitles.map((jt) => ({ value: String(jt.id), label: jt.name }));

  const genderOptions = [
    { value: "MALE", label: t("profile.personalDetails.genderOptions.male") },
    { value: "FEMALE", label: t("profile.personalDetails.genderOptions.female") },
    { value: "OTHER", label: t("profile.personalDetails.genderOptions.other") },
  ];

  const completion = useMemo(
    () => (profile ? getProfileCompletion({ profile, ...completionCounts }) : null),
    [profile, completionCounts]
  );

  const maritalStatusOptions = [
    { value: "SINGLE", label: t("profile.personalDetails.maritalStatusOptions.single") },
    { value: "MARRIED", label: t("profile.personalDetails.maritalStatusOptions.married") },
    { value: "DIVORCED", label: t("profile.personalDetails.maritalStatusOptions.divorced") },
    { value: "SEPARATED", label: t("profile.personalDetails.maritalStatusOptions.separated") },
    { value: "WIDOWED", label: t("profile.personalDetails.maritalStatusOptions.widowed") },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
      {loading ? (
        <>
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.title")}</h1>
          <p className="mt-2 text-sm text-jz-white-400">{t("profile.subtitle")}</p>
          <p className="mt-10 text-sm text-jz-white-400">{t("profile.loading")}</p>
        </>
      ) : loadError || !profile ? (
        <>
          <h1 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("profile.title")}</h1>
          <p className="mt-2 text-sm text-jz-white-400">{t("profile.subtitle")}</p>
          <div className="mt-10 rounded-2xl border border-jz-red-600/40 bg-jz-red-600/10 p-6 text-center">
            <p className="text-sm text-jz-white-100">{t("profile.loadError")}</p>
            <button
              type="button"
              onClick={loadProfile}
              className="mt-3 rounded-xl border border-jz-white-600 px-4 py-2 text-sm text-jz-white-100 hover:opacity-90"
            >
              {t("profile.retry")}
            </button>
          </div>
        </>
      ) : (
        <>
          <ProfileTopBar
            profile={profile}
            completionPercent={completion?.percent}
            // Keep the page's copy in sync so a later section save (which
            // re-renders from `profile`) doesn't show a stale photo.
            onImageChange={(profile_image_url) =>
              setProfile((current) => (current ? { ...current, profile_image_url } : current))
            }
          />

          <div className="mt-6 flex items-start gap-6">
            <ProfileSidebarNav />

            <div className="min-w-0 flex-1 space-y-6">
              {/* Personal Details */}
              <section id="personal-details" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
                      <UserIcon className="size-4" />
                    </span>
                    <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.personalDetails.heading")}</h2>
                  </div>
                  {!editingPersonal && (
                    <button
                      type="button"
                      onClick={startEditPersonal}
                      className="rounded-xl border border-jz-white-600 px-3.5 py-1.5 text-sm text-jz-white-100 hover:opacity-90"
                    >
                      {t("profile.edit")}
                    </button>
                  )}
                </div>

                {editingPersonal && personalForm ? (
                  <form onSubmit={submitPersonal} className="mt-5 space-y-4">
                    {personalSaveError && (
                      <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                        {personalSaveError}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormInput
                        label={t("profile.personalDetails.fullNameLabel")}
                        value={personalForm.full_name}
                        onChange={(e) => setPersonalForm({ ...personalForm, full_name: e.target.value })}
                        error={personalErrors.full_name}
                      />
                      <FormInput
                        label={t("profile.personalDetails.emailLabel")}
                        type="email"
                        value={personalForm.email}
                        onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                        error={personalErrors.email}
                      />
                      <FormInput label={t("profile.personalDetails.mobileLabel")} value={profile.mobile_number} disabled />
                      <FormSelect
                        label={t("profile.personalDetails.genderLabel")}
                        placeholder={t("profile.personalDetails.genderPlaceholder")}
                        options={genderOptions}
                        value={personalForm.gender}
                        onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value as Gender })}
                        error={personalErrors.gender}
                      />
                      <FormInput
                        label={t("profile.personalDetails.ageLabel")}
                        type="number"
                        min={18}
                        max={60}
                        value={personalForm.age}
                        onChange={(e) => setPersonalForm({ ...personalForm, age: e.target.value })}
                        error={personalErrors.age}
                      />
                      <FormInput
                        label={t("profile.personalDetails.dateOfBirthLabel")}
                        type="date"
                        value={personalForm.date_of_birth}
                        onChange={(e) => setPersonalForm({ ...personalForm, date_of_birth: e.target.value })}
                        error={personalErrors.date_of_birth}
                      />
                      <FormSelect
                        label={t("profile.personalDetails.maritalStatusLabel")}
                        placeholder={t("profile.personalDetails.maritalStatusPlaceholder")}
                        options={maritalStatusOptions}
                        value={personalForm.marital_status}
                        onChange={(e) => setPersonalForm({ ...personalForm, marital_status: e.target.value as MaritalStatus })}
                        error={personalErrors.marital_status}
                      />
                      <FormSelect
                        label={t("profile.personalDetails.currentCountryLabel")}
                        placeholder={t("profile.personalDetails.currentCountryPlaceholder")}
                        options={countryOptions}
                        value={personalForm.current_country_id}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, current_country_id: e.target.value, region_id: "", city_id: "" })
                        }
                        error={personalErrors.current_country_id}
                      />
                      <FormSelect
                        label={t("profile.personalDetails.regionLabel")}
                        placeholder={t("profile.personalDetails.regionPlaceholder")}
                        options={regionOptions}
                        value={personalForm.region_id}
                        onChange={(e) => setPersonalForm({ ...personalForm, region_id: e.target.value, city_id: "" })}
                        disabled={!personalForm.current_country_id}
                        error={personalErrors.region_id}
                      />
                      <FormSelect
                        label={t("profile.personalDetails.cityLabel")}
                        placeholder={t("profile.personalDetails.cityPlaceholder")}
                        options={cityOptions}
                        value={personalForm.city_id}
                        onChange={(e) => setPersonalForm({ ...personalForm, city_id: e.target.value })}
                        disabled={!personalForm.region_id}
                        error={personalErrors.city_id}
                      />
                      <FormInput
                        label={t("profile.personalDetails.pincodeLabel")}
                        value={personalForm.pincode}
                        onChange={(e) => setPersonalForm({ ...personalForm, pincode: e.target.value })}
                        error={personalErrors.pincode}
                      />
                      <FormInput
                        label={t("profile.personalDetails.addressLine1Label")}
                        value={personalForm.address_line_1}
                        onChange={(e) => setPersonalForm({ ...personalForm, address_line_1: e.target.value })}
                        error={personalErrors.address_line_1}
                      />
                      <FormInput
                        label={t("profile.personalDetails.addressLine2Label")}
                        value={personalForm.address_line_2}
                        onChange={(e) => setPersonalForm({ ...personalForm, address_line_2: e.target.value })}
                        error={personalErrors.address_line_2}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingPersonal}
                        className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        {savingPersonal ? t("profile.saving") : t("profile.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPersonal(false)}
                        disabled={savingPersonal}
                        className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                      >
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <ViewField label={t("profile.personalDetails.fullNameLabel")} value={profile.full_name} />
                    <ViewField label={t("profile.personalDetails.emailLabel")} value={profile.email} />
                    <ViewField label={t("profile.personalDetails.mobileLabel")} value={profile.mobile_number} />
                    <ViewField
                      label={t("profile.personalDetails.genderLabel")}
                      value={profile.gender ? t(`profile.personalDetails.genderOptions.${profile.gender.toLowerCase()}`) : null}
                    />
                    <ViewField label={t("profile.personalDetails.ageLabel")} value={profile.age !== null ? String(profile.age) : null} />
                    <ViewField
                      label={t("profile.personalDetails.dateOfBirthLabel")}
                      value={profile.date_of_birth ? toDateInputValue(profile.date_of_birth) : null}
                    />
                    <ViewField
                      label={t("profile.personalDetails.maritalStatusLabel")}
                      value={
                        profile.marital_status
                          ? t(`profile.personalDetails.maritalStatusOptions.${profile.marital_status.toLowerCase()}`)
                          : null
                      }
                    />
                    <ViewField label={t("profile.personalDetails.currentCountryLabel")} value={profile.current_country?.name ?? null} />
                    <ViewField label={t("profile.personalDetails.regionLabel")} value={profile.region?.name ?? null} />
                    <ViewField label={t("profile.personalDetails.cityLabel")} value={profile.city?.name ?? null} />
                    <ViewField label={t("profile.personalDetails.pincodeLabel")} value={profile.pincode} />
                    <ViewField label={t("profile.personalDetails.addressLine1Label")} value={profile.address_line_1} />
                    <ViewField label={t("profile.personalDetails.addressLine2Label")} value={profile.address_line_2} />
                    <div>
                      <p className="text-xs text-jz-white-600">{t("profile.personalDetails.kycStatusLabel")}</p>
                      <div className="mt-1.5">
                        <StatusBadge
                          label={t(`profile.personalDetails.kycStatusOptions.${profile.kyc_status}`, { defaultValue: profile.kyc_status })}
                          tone={KYC_STATUS_TONE[profile.kyc_status] ?? "border-jz-border bg-jz-blue-900/60 text-jz-white-200"}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-jz-white-600">{t("profile.personalDetails.passportStatusLabel")}</p>
                      <div className="mt-1.5">
                        <StatusBadge
                          label={t(`profile.personalDetails.passportStatusOptions.${profile.passport_status}`, {
                            defaultValue: profile.passport_status,
                          })}
                          tone={PASSPORT_STATUS_TONE[profile.passport_status] ?? "border-jz-border bg-jz-blue-900/60 text-jz-white-200"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Profile Summary */}
              <section id="profile-summary" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
                      <SparkleIcon className="size-4" />
                    </span>
                    <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.summary.heading")}</h2>
                  </div>
                  {!editingSummary && (
                    <button
                      type="button"
                      onClick={startEditSummary}
                      className="rounded-xl border border-jz-white-600 px-3.5 py-1.5 text-sm text-jz-white-100 hover:opacity-90"
                    >
                      {t("profile.edit")}
                    </button>
                  )}
                </div>

                {profile.ai_summary && (
                  <div className="mt-5 rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 p-4">
                    <p className="text-xs font-medium text-jz-yellow-400">{t("profile.summary.aiGeneratedLabel")}</p>
                    <p className="mt-1.5 whitespace-pre-line text-sm text-jz-white-100">{profile.ai_summary}</p>
                  </div>
                )}

                {editingSummary ? (
                  <form onSubmit={submitSummary} className="mt-5 space-y-4">
                    {summarySaveError && (
                      <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                        {summarySaveError}
                      </div>
                    )}
                    <FormTextarea
                      label={t("profile.summary.yourSummaryLabel")}
                      placeholder={t("profile.summary.placeholder")}
                      value={summaryForm}
                      onChange={(e) => setSummaryForm(e.target.value)}
                      maxLength={600}
                      rows={5}
                      hint={t("profile.summary.charCount", { count: summaryForm.length })}
                    />
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingSummary}
                        className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        {savingSummary ? t("profile.saving") : t("profile.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSummary(false)}
                        disabled={savingSummary}
                        className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                      >
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5">
                    <p className="text-xs text-jz-white-600">{t("profile.summary.yourSummaryLabel")}</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-jz-white-100">{profile.summary || t("profile.notProvided")}</p>
                  </div>
                )}
              </section>

              {/* Career Profile */}
              <section id="career-preference" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
                      <TargetIcon className="size-4" />
                    </span>
                    <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.careerPreference.heading")}</h2>
                  </div>
                  {!editingCareer && (
                    <button
                      type="button"
                      onClick={startEditCareer}
                      className="rounded-xl border border-jz-white-600 px-3.5 py-1.5 text-sm text-jz-white-100 hover:opacity-90"
                    >
                      {t("profile.edit")}
                    </button>
                  )}
                </div>

                {editingCareer && careerForm ? (
                  <form onSubmit={submitCareer} className="mt-5 space-y-4">
                    {careerSaveError && (
                      <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                        {careerSaveError}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormSelect
                        label={t("profile.careerPreference.jobIndustryLabel")}
                        placeholder={t("profile.careerPreference.jobIndustryPlaceholder")}
                        options={jobIndustryOptions}
                        value={careerForm.job_industry_id}
                        onChange={(e) =>
                          setCareerForm({
                            ...careerForm,
                            job_industry_id: e.target.value,
                            job_functional_area_id: "",
                            job_department_id: "",
                            job_title_id: "",
                          })
                        }
                        error={careerErrors.job_industry_id}
                      />
                      <FormSelect
                        label={t("profile.careerPreference.jobFunctionalAreaLabel")}
                        placeholder={t("profile.careerPreference.jobFunctionalAreaPlaceholder")}
                        options={jobFunctionalAreaOptions}
                        value={careerForm.job_functional_area_id}
                        onChange={(e) =>
                          setCareerForm({
                            ...careerForm,
                            job_functional_area_id: e.target.value,
                            job_department_id: "",
                            job_title_id: "",
                          })
                        }
                        disabled={!careerForm.job_industry_id}
                        error={careerErrors.job_functional_area_id}
                      />
                      <FormSelect
                        label={t("profile.careerPreference.jobDepartmentLabel")}
                        placeholder={t("profile.careerPreference.jobDepartmentPlaceholder")}
                        options={jobDepartmentOptions}
                        value={careerForm.job_department_id}
                        onChange={(e) => setCareerForm({ ...careerForm, job_department_id: e.target.value })}
                        disabled={!careerForm.job_functional_area_id}
                        error={careerErrors.job_department_id}
                      />
                      <FormSelect
                        label={t("profile.careerPreference.jobTitleLabel")}
                        placeholder={t("profile.careerPreference.jobTitlePlaceholder")}
                        options={jobTitleOptions}
                        value={careerForm.job_title_id}
                        onChange={(e) => setCareerForm({ ...careerForm, job_title_id: e.target.value })}
                        disabled={!careerForm.job_functional_area_id}
                        error={careerErrors.job_title_id}
                      />
                      <FormSelect
                        label={t("profile.careerPreference.preferredCountryLabel")}
                        placeholder={t("profile.careerPreference.preferredCountryPlaceholder")}
                        options={countryOptions}
                        value={careerForm.preferred_country_id}
                        onChange={(e) => setCareerForm({ ...careerForm, preferred_country_id: e.target.value })}
                        error={careerErrors.preferred_country_id}
                      />
                      <FormInput
                        label={t("profile.careerPreference.experienceYearsLabel")}
                        type="number"
                        min={0}
                        max={50}
                        step="0.5"
                        value={careerForm.experience_years}
                        onChange={(e) => setCareerForm({ ...careerForm, experience_years: e.target.value })}
                        error={careerErrors.experience_years}
                      />
                      <FormInput
                        label={t("profile.careerPreference.currentSalaryLabel")}
                        type="number"
                        min={0}
                        value={careerForm.current_salary}
                        onChange={(e) => setCareerForm({ ...careerForm, current_salary: e.target.value })}
                        error={careerErrors.current_salary}
                      />
                      <FormInput
                        label={t("profile.careerPreference.expectedSalaryLabel")}
                        type="number"
                        min={0}
                        value={careerForm.expected_salary}
                        onChange={(e) => setCareerForm({ ...careerForm, expected_salary: e.target.value })}
                        error={careerErrors.expected_salary}
                      />
                    </div>

                    <Checkbox
                      label={t("profile.careerPreference.hasGccExperienceLabel")}
                      checked={careerForm.has_gcc_experience}
                      onChange={(e) => setCareerForm({ ...careerForm, has_gcc_experience: e.target.checked })}
                    />

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={savingCareer}
                        className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        {savingCareer ? t("profile.saving") : t("profile.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCareer(false)}
                        disabled={savingCareer}
                        className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                      >
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <ViewField label={t("profile.careerPreference.jobIndustryLabel")} value={profile.job_industry?.name ?? null} />
                    <ViewField label={t("profile.careerPreference.jobFunctionalAreaLabel")} value={profile.job_functional_area?.name ?? null} />
                    <ViewField label={t("profile.careerPreference.jobDepartmentLabel")} value={profile.job_department?.name ?? null} />
                    <ViewField label={t("profile.careerPreference.jobTitleLabel")} value={profile.job_title?.name ?? null} />
                    <ViewField label={t("profile.careerPreference.preferredCountryLabel")} value={profile.preferred_country?.name ?? null} />
                    <ViewField
                      label={t("profile.careerPreference.experienceYearsLabel")}
                      value={toDisplayValue(profile.experience_years) || null}
                    />
                    <ViewField
                      label={t("profile.careerPreference.currentSalaryLabel")}
                      value={toDisplayValue(profile.current_salary) || null}
                    />
                    <ViewField
                      label={t("profile.careerPreference.expectedSalaryLabel")}
                      value={toDisplayValue(profile.expected_salary) || null}
                    />
                    <ViewField
                      label={t("profile.careerPreference.hasGccExperienceLabel")}
                      value={
                        profile.has_gcc_experience === null
                          ? null
                          : profile.has_gcc_experience
                            ? t("profile.careerPreference.yes")
                            : t("profile.careerPreference.no")
                      }
                    />
                  </div>
                )}
              </section>

              <EmploymentSection />
              <EducationSection />
              <LanguagesSection />
              <ResumeSection />
              <VideoSection />
              <DocumentsSection />
            </div> 
          </div> 
        </>    
)}
    </div>
  );
}