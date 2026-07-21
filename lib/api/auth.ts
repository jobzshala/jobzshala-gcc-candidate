import { apiFetch, authFetch } from "./client";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface CandidateSummary {
  id: number;
  full_name: string;
  mobile_number: string;
  email: string;
  // True while the candidate is still on the emailed temporary password —
  // the app forces them through /change-password before anything else.
  must_change_password?: boolean;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  candidate: CandidateSummary;
}

export function login(payload: LoginPayload): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerCandidate(formData: FormData): Promise<CandidateSummary> {
  return apiFetch<CandidateSummary>("/candidate/register", {
    method: "POST",
    body: formData,
  });
}

export interface SendRegistrationOtpPayload {
  full_name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  country_code: string;
  mobile_number: string;
  email: string;
}

export function sendRegistrationOtp(payload: SendRegistrationOtpPayload): Promise<void> {
  return apiFetch<void>("/candidate/register/send-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyRegistrationOtp(email: string, otp: string): Promise<{ verifyToken: string }> {
  return apiFetch<{ verifyToken: string }>("/candidate/register/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function forgotPassword(email: string): Promise<void> {
  return apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function logout(refreshToken: string): Promise<void> {
  return authFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export function resetPassword({ token, password, confirmPassword }: ResetPasswordPayload): Promise<void> {
  return apiFetch<void>(`/auth/reset-password?token=${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify({ password, confirmPassword }),
  });
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Returns a fresh session (old refresh tokens are revoked server-side).
export function changePassword(payload: ChangePasswordPayload): Promise<LoginResult> {
  return authFetch<LoginResult>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
