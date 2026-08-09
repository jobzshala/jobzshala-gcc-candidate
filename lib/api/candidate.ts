import { authFetch } from "./client";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "SEPARATED" | "WIDOWED";

export interface LookupRef {
  id: number;
  name: string;
}

export interface CandidateProfile {
  id: number;
  // Backend-issued human-facing ID ("JZ-000123"), distinct from `id` — the
  // format can change server-side without breaking anything showing it.
  workforce_id: string | null;
  full_name: string;
  mobile_number: string;
  is_mobile_verified: boolean;
  email: string | null;
  is_email_verified: boolean;
  gender: Gender | null;
  age: number | null;
  date_of_birth: string | null;
  marital_status: MaritalStatus | null;
  address_line_1: string | null;
  address_line_2: string | null;
  pincode: string | null;
  summary: string | null;
  ai_summary: string | null;
  city: LookupRef | null;
  region: LookupRef | null;
  current_country: LookupRef | null;
  preferred_country: LookupRef | null;
  job_title: LookupRef | null;
  job_functional_area: LookupRef | null;
  job_industry: LookupRef | null;
  job_department: LookupRef | null;
  // Prisma Decimal fields serialize to JSON as strings, not numbers.
  experience_years: number | string | null;
  current_salary: number | string | null;
  expected_salary: number | string | null;
  has_gcc_experience: boolean | null;
  passport_status: string;
  kyc_status: string;
  status: string;
  assigned_recruiter: {
    full_name: string;
    phone: string | null;
    email: string | null;
    profile_image_url: string | null;
  } | null;
  // Backend-computed from the same 13-item completion checklist the
  // frontend renders (lib/profileCompletion.ts) plus a KYC-verified bonus —
  // authoritative, not a frontend heuristic.
  readiness_score: number;
  readiness_stars: number;
  // Signed, time-limited URL (regenerated on each profile fetch), not a
  // permanent link — don't cache it across sessions.
  profile_image_url: string | null;
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
  summary?: string | null;
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

export function sendEmailVerificationOtp(): Promise<unknown> {
  return authFetch<unknown>("/candidate/profile/verify-email/send-otp", {
    method: "POST",
  });
}

export function confirmEmailVerificationOtp(otp: string): Promise<unknown> {
  return authFetch<unknown>("/candidate/profile/verify-email/confirm-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export interface UpdateCareerPreferencePayload {
  job_title_id?: number | null;
  job_functional_area_id?: number | null;
  job_industry_id?: number | null;
  job_department_id?: number | null;
  preferred_country_id?: number | null;
  experience_years?: number | null;
  current_salary?: number | null;
  expected_salary?: number | null;
  has_gcc_experience?: boolean | null;
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

export interface SupportSettings {
  whatsapp_number: string | null;
  whatsapp_message: string | null;
}

export function getSupportSettings(): Promise<SupportSettings> {
  return authFetch<SupportSettings>("/candidate/masters/support-settings");
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

export function getJobIndustries(): Promise<LookupRef[]> {
  return authFetch<LookupRef[]>("/candidate/masters/job-industries");
}

export function getJobFunctionalAreas(jobIndustryId?: number): Promise<LookupRef[]> {
  const query = jobIndustryId ? `?job_industry_id=${jobIndustryId}` : "";
  return authFetch<LookupRef[]>(`/candidate/masters/job-functional-areas${query}`);
}

export function getJobDepartments(jobFunctionalAreaId: number): Promise<LookupRef[]> {
  return authFetch<LookupRef[]>(`/candidate/masters/job-departments?job_functional_area_id=${jobFunctionalAreaId}`);
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
  // Nullable so this same shape can back both the single-record add/update
  // endpoints (which always send a real value) and the bulk collections
  // write, whose validation allows employment_type to be omitted/null.
  employment_type: EmploymentType | null;
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
// Resume parsing (AI auto-fill) — extracts suggested field values from an
// uploaded resume for the candidate to review before applying. Master-data
// fields come back as names (job_title, job_industry, job_functional_area,
// current_country, and each education/language entry's qualification/
// language) since the backend has no candidate id to resolve ids against
// yet — the caller matches these against already-loaded dropdown options.
// Does not touch the profile or the active resume itself; see updateResume.
// ---------------------------------------------------------------------------

export interface ParsedResumePersonal {
  full_name: string | null;
  email: string | null;
  mobile_number: string | null;
  gender: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  pincode: string | null;
  current_country: string | null;
}

export interface ParsedResumeCareer {
  job_title: string | null;
  job_industry: string | null;
  job_functional_area: string | null;
  experience_years: number | null;
  summary: string | null;
  current_salary: number | null;
  expected_salary: number | null;
}

export interface ParsedResumeEmployment {
  company_name: string;
  designation: string;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  description: string | null;
}

export interface ParsedResumeEducation {
  qualification: string;
  institution: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
}

export interface ParsedResumeLanguage {
  language: string;
  proficiency: string | null;
}

// A page (or consecutive run of same-type pages) the resume upload split out
// as *not* the resume itself — e.g. a passport photo page or a certificate
// bundled into the same PDF. Every page is already uploaded to S3 by the
// backend (s3Keys), grouped here for display only; accepting a group attaches
// each of its pages as its own candidate_documents row via
// attachDocumentByKey, one call per s3Key.
export type SplitDocumentType = "resume" | "certificate" | "passport" | "education_degree" | "id_proof" | "other";

export interface SplitDocument {
  pageNumbers: number[];
  type: SplitDocumentType;
  s3Keys: string[];
  suggestedDocumentTypeId: number | null;
  suggestedDocumentTypeName: string | null;
  // Starting point for the free-text label every candidate_documents row now
  // carries — a document type alone can't distinguish "10th Marksheet" from
  // "12th Marksheet" from "Diploma", all classified/grouped the same way.
  suggestedLabel: string | null;
  lowConfidence: boolean;
}

export interface ParsedResume {
  document_key: string;
  personal: ParsedResumePersonal;
  career: ParsedResumeCareer;
  employment: ParsedResumeEmployment[];
  education: ParsedResumeEducation[];
  languages: ParsedResumeLanguage[];
  skills: string[];
  // Dotted paths (e.g. "personal.email", "employment.0.company_name") the
  // model itself flagged as unsure — present-and-listed needs a second look,
  // present-and-not-listed is trusted, absent always needs manual entry
  // regardless of this list.
  low_confidence_fields: string[];
  // Non-resume pages found in the same upload (certificates, ID pages, etc.)
  // — empty by design whenever classification finds nothing or fails
  // (degrades to today's single-resume behavior), never an error state.
  documents: SplitDocument[];
}

export function parseResume(file: File): Promise<ParsedResume> {
  const formData = new FormData();
  formData.set("resume", file);
  return authFetch<ParsedResume>("/candidate/profile/resume/parse", { method: "POST", body: formData });
}

// ---------------------------------------------------------------------------
// Split-document attach + bulk collections write — the review-screen
// counterparts of resume parsing above. Both consume data the parse call
// already produced without re-uploading anything.
// ---------------------------------------------------------------------------

// Attaches one already-uploaded S3 page (a SplitDocument's s3Keys entry) as a
// real candidate document, no re-upload. Call once per s3Key — a multi-page
// SplitDocument group needs one call per page, all sharing the same chosen
// document_type_id.
export function attachDocumentByKey(documentKey: string, documentTypeId: number, label?: string): Promise<DocumentRecord> {
  return authFetch<DocumentRecord>("/candidate/profile/documents/attach", {
    method: "PATCH",
    body: JSON.stringify({ document_key: documentKey, document_type_id: documentTypeId, label: label || undefined }),
  });
}

// education/employment/languages are each full-replace: sending the key
// replaces everything currently on file for that collection, so only include
// a key here when the caller has already merged in whatever should survive
// (existing records + newly accepted ones) — never send a partial array.
// documents is additive-only and never touches existing document rows.
export interface WriteCollectionsPayload {
  education?: EducationPayload[];
  employment?: EmploymentPayload[];
  languages?: LanguagePayload[];
  documents?: { document_key: string; document_type_id: number }[];
}

export function writeCandidateCollections(payload: WriteCollectionsPayload): Promise<{ updated: boolean }> {
  return authFetch<{ updated: boolean }>("/candidate/profile/collections", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Profile image
// ---------------------------------------------------------------------------

// One image per candidate, so upload doubles as replace — the backend deletes
// the previous S3 object itself. The returned URL is a signed, time-limited
// GET (candidate media lives in the private bucket), not a permanent link.
export function updateProfileImage(file: File): Promise<{ profile_image_url: string }> {
  const formData = new FormData();
  formData.set("image", file);
  return authFetch<{ profile_image_url: string }>("/candidate/profile/image", { method: "PUT", body: formData });
}

export function deleteProfileImage(): Promise<void> {
  return authFetch<void>("/candidate/profile/image", { method: "DELETE" });
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
  label: string | null;
  created_at: string;
  document_type: DocumentTypeOption;
}

export function getDocuments(): Promise<DocumentRecord[]> {
  return authFetch<DocumentRecord[]>("/candidate/profile/documents");
}

export function addDocument(documentTypeId: number, file: File, label?: string): Promise<DocumentRecord> {
  const formData = new FormData();
  formData.set("document_type_id", String(documentTypeId));
  formData.set("document", file);
  if (label) formData.set("label", label);
  return authFetch<DocumentRecord>("/candidate/profile/documents", { method: "POST", body: formData });
}

export function updateDocument(
  id: number,
  params: { documentTypeId?: number; file?: File; label?: string }
): Promise<DocumentRecord> {
  const formData = new FormData();
  if (params.documentTypeId) formData.set("document_type_id", String(params.documentTypeId));
  if (params.file) formData.set("document", params.file);
  if (params.label !== undefined) formData.set("label", params.label);
  return authFetch<DocumentRecord>(`/candidate/profile/documents/${id}`, { method: "PUT", body: formData });
}

export function deleteDocument(id: number): Promise<void> {
  return authFetch<void>(`/candidate/profile/documents/${id}`, { method: "DELETE" });
}
