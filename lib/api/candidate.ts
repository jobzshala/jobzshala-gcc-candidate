import { authFetch } from "./client";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "SEPARATED" | "WIDOWED";

export interface LookupRef {
  id: number;
  name: string;
}

export interface CandidateProfile {
  id: number;
  full_name: string;
  mobile_number: string;
  email: string | null;
  gender: Gender | null;
  age: number | null;
  date_of_birth: string | null;
  marital_status: MaritalStatus | null;
  address_line_1: string | null;
  address_line_2: string | null;
  pincode: string | null;
  city: LookupRef | null;
  region: LookupRef | null;
  current_country: LookupRef | null;
  preferred_country: LookupRef | null;
  job_title: LookupRef | null;
  job_functional_area: LookupRef | null;
  // Prisma Decimal fields serialize to JSON as strings, not numbers.
  experience_years: number | string | null;
  current_salary: number | string | null;
  expected_salary: number | string | null;
  passport_status: string;
  kyc_status: string;
  status: string;
  resume_url: string | null;
  video_url: string | null;
  profile_activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export function getProfile(): Promise<CandidateProfile> {
  return authFetch<CandidateProfile>("/candidate/profile");
}

export interface UpdatePersonalDetailsPayload {
  full_name?: string;
  email?: string;
  gender?: Gender;
  age?: number;
  city_id?: number | null;
  region_id?: number | null;
  current_country_id?: number | null;
  preferred_country_id?: number | null;
  date_of_birth?: string | null;
  marital_status?: MaritalStatus | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  pincode?: string | null;
}

// The PUT response is the raw candidate_details row (no relation includes),
// unlike getProfile()'s shaped output — callers should re-fetch getProfile()
// after a successful save rather than relying on this return value for
// display.
export function updatePersonalDetails(payload: UpdatePersonalDetailsPayload): Promise<unknown> {
  return authFetch<unknown>("/candidate/profile/personal-details", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export interface UpdateCareerPreferencePayload {
  job_title_id?: number | null;
  job_functional_area_id?: number | null;
  preferred_country_id?: number | null;
  experience_years?: number | null;
  current_salary?: number | null;
  expected_salary?: number | null;
}

// Same caveat as updatePersonalDetails above — re-fetch getProfile() after a
// successful save rather than relying on this return value for display.
export function updateCareerPreference(payload: UpdateCareerPreferencePayload): Promise<unknown> {
  return authFetch<unknown>("/candidate/profile/career-preference", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export interface CountryOption extends LookupRef {
  is_gcc: boolean;
}

export function getCountries(): Promise<CountryOption[]> {
  return authFetch<CountryOption[]>("/candidate/masters/countries");
}

export interface RegionOption extends LookupRef {
  country_id: number;
}

export function getRegions(countryId?: number): Promise<RegionOption[]> {
  const query = countryId ? `?country_id=${countryId}` : "";
  return authFetch<RegionOption[]>(`/candidate/masters/regions${query}`);
}

export interface CityOption extends LookupRef {
  region_id: number;
}

export function getCities(regionId: number): Promise<CityOption[]> {
  return authFetch<CityOption[]>(`/candidate/masters/cities?region_id=${regionId}`);
}

export interface JobTitleOption extends LookupRef {
  job_functional_area_id: number | null;
}

export function getJobTitles(params: { search?: string; jobFunctionalAreaId?: number } = {}): Promise<JobTitleOption[]> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.jobFunctionalAreaId) query.set("job_functional_area_id", String(params.jobFunctionalAreaId));
  const qs = query.toString();
  return authFetch<JobTitleOption[]>(`/candidate/masters/job-titles${qs ? `?${qs}` : ""}`);
}

export function getJobFunctionalAreas(): Promise<LookupRef[]> {
  return authFetch<LookupRef[]>("/candidate/masters/job-functional-areas");
}

export function getLanguagesMaster(): Promise<LookupRef[]> {
  return authFetch<LookupRef[]>("/candidate/masters/languages");
}

export interface EducationQualificationOption extends LookupRef {
  level: string;
}

export function getEducationQualifications(): Promise<EducationQualificationOption[]> {
  return authFetch<EducationQualificationOption[]>("/candidate/masters/education-qualifications");
}

export interface DocumentTypeOption extends LookupRef {
  mandatory: boolean;
}

export function getDocumentTypes(): Promise<DocumentTypeOption[]> {
  return authFetch<DocumentTypeOption[]>("/candidate/masters/document-types");
}

// ---------------------------------------------------------------------------
// Employment history
// ---------------------------------------------------------------------------

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERN" | "FREELANCE" | "SELF_EMPLOYED";

export interface EmploymentRecord {
  id: number;
  candidate_id: number;
  company_name: string;
  designation: string;
  employment_type: EmploymentType | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmploymentPayload {
  company_name: string;
  designation: string;
  employment_type: EmploymentType;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  location?: string | null;
  description?: string | null;
}

export function getEmploymentHistory(): Promise<EmploymentRecord[]> {
  return authFetch<EmploymentRecord[]>("/candidate/profile/employment");
}

export function addEmployment(payload: EmploymentPayload): Promise<EmploymentRecord> {
  return authFetch<EmploymentRecord>("/candidate/profile/employment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmployment(id: number, payload: Partial<EmploymentPayload>): Promise<EmploymentRecord> {
  return authFetch<EmploymentRecord>(`/candidate/profile/employment/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEmployment(id: number): Promise<void> {
  return authFetch<void>(`/candidate/profile/employment/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export interface EducationRecord {
  id: number;
  candidate_id: number;
  education_qualification_id: number;
  institution_name: string;
  specialization: string | null;
  start_date: string;
  end_date: string | null;
  score: number | string | null;
  created_at: string;
  updated_at: string;
  education_qualification: EducationQualificationOption;
}

export interface EducationPayload {
  education_qualification_id: number;
  institution_name: string;
  specialization?: string | null;
  start_date: string;
  end_date?: string | null;
  score?: number | null;
}

export function getEducationHistory(): Promise<EducationRecord[]> {
  return authFetch<EducationRecord[]>("/candidate/profile/education");
}

export function addEducation(payload: EducationPayload): Promise<EducationRecord> {
  return authFetch<EducationRecord>("/candidate/profile/education", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEducation(id: number, payload: Partial<EducationPayload>): Promise<EducationRecord> {
  return authFetch<EducationRecord>(`/candidate/profile/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteEducation(id: number): Promise<void> {
  return authFetch<void>(`/candidate/profile/education/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

export type LanguageProficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "FLUENT" | "NATIVE";

export interface CandidateLanguageRecord {
  id: number;
  candidate_id: number;
  language_id: number;
  proficiency: LanguageProficiency;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
  created_at: string;
  updated_at: string;
  language: LookupRef;
}

export interface LanguagePayload {
  language_id: number;
  proficiency: LanguageProficiency;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
}

export function getLanguages(): Promise<CandidateLanguageRecord[]> {
  return authFetch<CandidateLanguageRecord[]>("/candidate/profile/languages");
}

export function addLanguage(payload: LanguagePayload): Promise<CandidateLanguageRecord> {
  return authFetch<CandidateLanguageRecord>("/candidate/profile/languages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateLanguage(id: number, payload: Partial<LanguagePayload>): Promise<CandidateLanguageRecord> {
  return authFetch<CandidateLanguageRecord>(`/candidate/profile/languages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteLanguage(id: number): Promise<void> {
  return authFetch<void>(`/candidate/profile/languages/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export interface ResumeInfo {
  resume_url: string | null;
}

export interface ResumeHistoryItem {
  id: number;
  candidate_id: number;
  resume_url: string;
  source: string;
  version: number;
  created_at: string;
}

export function getResume(): Promise<ResumeInfo> {
  return authFetch<ResumeInfo>("/candidate/profile/resume");
}

export function getResumeHistory(): Promise<ResumeHistoryItem[]> {
  return authFetch<ResumeHistoryItem[]>("/candidate/profile/resume/history");
}

export function updateResume(file: File): Promise<ResumeInfo> {
  const formData = new FormData();
  formData.set("resume", file);
  return authFetch<ResumeInfo>("/candidate/profile/resume", { method: "PUT", body: formData });
}

// ---------------------------------------------------------------------------
// Video profile
// ---------------------------------------------------------------------------

export interface VideoProfileInfo {
  video_url: string | null;
}

export function getVideoProfile(): Promise<VideoProfileInfo> {
  return authFetch<VideoProfileInfo>("/candidate/profile/video");
}

export function updateVideoProfile(file: File): Promise<VideoProfileInfo> {
  const formData = new FormData();
  formData.set("video", file);
  return authFetch<VideoProfileInfo>("/candidate/profile/video", { method: "PUT", body: formData });
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export interface DocumentRecord {
  id: number;
  candidate_id: number;
  document_type_id: number;
  file_url: string;
  created_at: string;
  document_type: DocumentTypeOption;
}

export function getDocuments(): Promise<DocumentRecord[]> {
  return authFetch<DocumentRecord[]>("/candidate/profile/documents");
}

export function addDocument(documentTypeId: number, file: File): Promise<DocumentRecord> {
  const formData = new FormData();
  formData.set("document_type_id", String(documentTypeId));
  formData.set("document", file);
  return authFetch<DocumentRecord>("/candidate/profile/documents", { method: "POST", body: formData });
}

export function updateDocument(id: number, params: { documentTypeId?: number; file?: File }): Promise<DocumentRecord> {
  const formData = new FormData();
  if (params.documentTypeId) formData.set("document_type_id", String(params.documentTypeId));
  if (params.file) formData.set("document", params.file);
  return authFetch<DocumentRecord>(`/candidate/profile/documents/${id}`, { method: "PUT", body: formData });
}

export function deleteDocument(id: number): Promise<void> {
  return authFetch<void>(`/candidate/profile/documents/${id}`, { method: "DELETE" });
}
