import Link from "next/link";
import { ShieldCheckIcon, AlertIcon } from "@/components/ui/icons";

// Real, unlike most of this dashboard's placeholder cards — kyc_status is a
// genuine CandidateProfile field.
export default function VerifiedStrip({ kycStatus }: { kycStatus: string }) {
  const verified = kycStatus === "VERIFIED";

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
      <Link href="/faq" className="btn-outline" style={{ background: "var(--paper)", padding: "9px 16px" }}>
        How Verification Helps?
      </Link>
    </div>
  );
}
