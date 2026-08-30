import { saveSession, isSessionPersisted, clearSession as clearRawSession } from "../auth/session";
import { store } from "../store/store";
import { setSession as setReduxSession, clearSession as clearReduxSession } from "../store/authSlice";
import { ROUTES } from "../routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

export class ApiError extends Error {
  fieldErrors?: Record<string, string>;
  status?: number;
  // Machine-readable reason a handful of endpoints attach alongside message —
  // e.g. login()'s ACCOUNT_DEACTIVATED/ACCOUNT_DEACTIVATED_NO_EMAIL, which the
  // login form uses to switch to the reactivation-code step instead of just
  // showing the message as a generic error.
  code?: string;

  constructor(message: string, fieldErrors?: Record<string, string>, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
    this.status = status;
    this.code = code;
  }
}

export interface ApiEnvelope<T> {
  status: boolean;
  message?: string | string[];
  result?: T;
  errors?: Record<string, string>;
  code?: string;
}

// Returns the whole envelope. Most endpoints only need `result`, which is
// what apiFetch hands back — but a few put data alongside it rather than
// inside it (the matches endpoint carries `entitlement` and `access` as
// siblings of `result`), and those would lose it to the unwrap.
async function fetchEnvelope<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !data?.status) {
    const rawMessage = data?.message;
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
    throw new ApiError(message || "Something went wrong. Please try again.", data?.errors, response.status, data?.code);
  }

  return data;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const data = await fetchEnvelope<T>(path, options);
  return data.result as T;
}

// De-dupes concurrent refreshes (several widgets on the same page 401ing at
// once should only trigger one /auth/refresh-token call).
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const session = store.getState().auth;

  if (!session.refreshToken || !session.candidate) {
    throw new ApiError("Not signed in");
  }

  if (!refreshPromise) {
    refreshPromise = apiFetch<{ accessToken: string; refreshToken: string }>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then((tokens) => {
        const updated = { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, candidate: session.candidate! };
        // Redux is the source of truth for anything rendered in-app; the raw
        // write keeps components/RedirectIfAuthenticated.tsx's pre-hydration
        // blocking script (which can't reach the Redux store) in sync too.
        store.dispatch(setReduxSession(updated));
        saveSession(updated, isSessionPersisted());
        return tokens.accessToken;
      })
      .catch((err) => {
        store.dispatch(clearReduxSession());
        clearRawSession();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Same as apiFetch, but attaches the signed-in candidate's access token and
// transparently refreshes + retries once on a 401 (expired access token)
// before giving up and sending the user back to /login.
async function authRequest<R>(
  path: string,
  options: RequestInit,
  run: (path: string, options: RequestInit) => Promise<R>
): Promise<R> {
  const session = store.getState().auth;

  if (!session.accessToken) {
    throw new ApiError("Not signed in");
  }

  const withAuth = (token: string): RequestInit => ({
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });

  try {
    return await run(path, withAuth(session.accessToken));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        return await run(path, withAuth(newAccessToken));
      } catch {
        if (typeof window !== "undefined") window.location.href = ROUTES.login;
        throw err;
      }
    }
    throw err;
  }
}

export function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return authRequest(path, options, apiFetch<T>);
}

// Same auth + refresh-and-retry behaviour as authFetch, but hands back the
// whole envelope for endpoints that return data outside `result`.
export function authFetchEnvelope<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  return authRequest(path, options, fetchEnvelope<T>);
}
