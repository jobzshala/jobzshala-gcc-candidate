"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { ShieldCheckIcon, AlertIcon, CheckIcon } from "@/components/ui/icons";

const VERIFICATION_BENEFITS = [
  "Your profile becomes visible to GCC employers — unverified profiles aren't shown to them at all.",
  "You get priority in AI job matching, since recruiters trust verified profiles first.",
  "Recruiters can shortlist and call you faster, without a manual background check first.",
  "It's how Jobzshala keeps this a fraud-free platform for both sides of a cross-border hire.",
];

// "How Verification Helps?" used to link out to the public /faq page — wrong
// theme (public navy vs this dashboard's green artifact palette), wrong
// content (generic FAQs, nothing about KYC), and it dropped a logged-in
// candidate out of the authenticated shell entirely. This answers the
// question in place instead, and points at the real next step (/documents).
export default function VerifiedStrip({ kycStatus }: { kycStatus: string }) {
  const verified = kycStatus === "VERIFIED";
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`verified-strip${verified ? "" : " unverified"}`}>
      <div className="left">
        <span className="shield">{verified ? <ShieldCheckIcon className="icon" /> : <AlertIcon className="icon" />}</span>
        <div>
          <h4>{verified ? "You are a Verified Workforce Member" : "Your profile isn't verified yet"}</h4>
          <p>
            {verified
              ? "Your profile is verified and visible to top employers in GCC."
              : "Complete your documents and KYC so your profile becomes visible to top GCC employers."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="btn-outline"
        style={{ background: "var(--paper)", padding: "9px 16px" }}
      >
        How Verification Helps?
      </button>

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="How verification helps">
        <div style={{ padding: 20, background: "var(--paper)", color: "var(--ink)" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {VERIFICATION_BENEFITS.map((benefit) => (
              <li key={benefit} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--green-soft)",
                    color: "var(--green-600)",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <CheckIcon className="size-2.5" />
                </span>
                <span style={{ color: "var(--ink-soft)" }}>{benefit}</span>
              </li>
            ))}
          </ul>

          {!verified && (
            <Link
              href="/documents"
              onClick={() => setShowHelp(false)}
              className="btn-solid"
              style={{ display: "inline-flex", marginTop: 20 }}
            >
              Complete your documents
            </Link>
          )}
        </div>
      </Modal>
    </div>
  );
}
