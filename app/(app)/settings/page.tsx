"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import FormTextarea from "@/components/ui/FormTextarea";
import { LockIcon } from "@/components/ui/icons";
import { deactivateAccount, deleteAccount } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { clearSession as clearRawSession } from "@/lib/auth/session";
import { clearSession as clearReduxSession } from "@/lib/store/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ROUTES } from "@/lib/routes";

type ActiveAction = "deactivate" | "delete" | null;

const MIN_REASON_LENGTH = 3;

// Same two self-service actions the mobile app ships (deactivate-account.tsx /
// delete-account.tsx) — reason + confirm, then the session is cleared and the
// candidate is signed out everywhere, matching /auth/deactivate-account and
// /auth/delete-account's server-side behavior.
export default function SettingsPage() {
  const dispatch = useAppDispatch();

  const [active, setActive] = useState<ActiveAction>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openAction = (action: ActiveAction) => {
    setActive(action);
    setReason("");
    setReasonError("");
    setError("");
  };

  const closeAction = () => {
    if (submitting) return;
    setActive(null);
  };

  const handleConfirm = async () => {
    if (reason.trim().length < MIN_REASON_LENGTH) {
      setReasonError("Tell us a little more — a few words is enough.");
      return;
    }
    setReasonError("");
    setError("");
    setSubmitting(true);
    try {
      if (active === "delete") {
        await deleteAccount(reason.trim());
      } else {
        await deactivateAccount(reason.trim());
      }
      clearRawSession();
      dispatch(clearReduxSession());
      window.location.href = ROUTES.login;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="card-head">
            <div className="card-title">
              <span className="ic">
                <LockIcon className="icon" />
              </span>
              <h3>Account</h3>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                Password
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--ink-faint)" }}>
                Change the password you sign in with.
              </p>
            </div>
            <Link href={ROUTES.changePassword} className="btn-outline">
              Change password
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                Deactivate account
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--ink-faint)" }}>
                Hides your profile and pauses matching. Sign in again any time — we&apos;ll email you a code to turn it
                back on.
              </p>
            </div>
            <button type="button" className="btn-outline" onClick={() => openAction("deactivate")}>
              Deactivate
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid var(--line)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--red)" }}>
                Delete account
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--ink-faint)" }}>
                Permanently removes your profile, documents, and match history. There&apos;s no self-service undo —
                email support@jobzshala.ae to restore it.
              </p>
            </div>
            <button
              type="button"
              className="btn-outline"
              style={{ borderColor: "var(--red)", color: "var(--red)" }}
              onClick={() => openAction("delete")}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal open={active !== null} onClose={closeAction} title={active === "delete" ? "Delete account" : "Deactivate account"}>
        <div className="space-y-4 p-5">
          <p className="text-sm text-jz-white-400">
            {active === "delete"
              ? "This permanently removes your Jobzshala profile, documents, and match history. There's no self-service undo — you'd need to email support@jobzshala.ae to restore it."
              : "Your profile is hidden from employers and matching pauses until you reactivate. Sign in again any time and we'll email you a code to turn it back on."}
          </p>

          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
              {error}
            </div>
          )}

          <FormTextarea
            label="Why are you leaving?"
            placeholder="A quick reason helps us improve."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={reasonError}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeAction}
              disabled={submitting}
              className="rounded-xl border border-jz-border px-4 py-2.5 text-sm font-semibold text-jz-white-200 hover:bg-jz-blue-900 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={submitting}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${
                active === "delete"
                  ? "bg-jz-red-600 text-white hover:opacity-90"
                  : "bg-gradient-to-b from-jz-yellow-300 to-jz-yellow-400 text-jz-ink-on-accent hover:opacity-90"
              }`}
            >
              {submitting ? "Please wait…" : active === "delete" ? "Delete my account" : "Deactivate my account"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
