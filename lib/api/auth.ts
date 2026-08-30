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

// Self-service deactivation — reversible via reactivateAccount() below
// (email OTP). Logs the candidate out everywhere server-side, same as the
// mobile app's flow.
export function deactivateAccount(reason: string): Promise<void> {
  return authFetch<void>("/auth/deactivate-account", {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// Self-service soft delete (Play Store/App Store policy, applied here for
// parity with the mobile app). No self-service undo — restoring requires
// contacting support@jobzshala.ae.
export function deleteAccount(reason: string): Promise<void> {
  return authFetch<void>("/auth/delete-account", {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// Completes the OTP challenge login() throws (ApiError.code ===
// "ACCOUNT_DEACTIVATED") for a deactivated account — the server already
// emailed the code as a side effect of that failed login attempt, so this is
// unauthenticated (apiFetch, not authFetch) and logs the candidate straight
// back in on success, same response shape as login().
export function reactivateAccount(identifier: string, otp: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/reactivate-account", {
    method: "POST",
    body: JSON.stringify({ identifier, otp }),
  });
}
