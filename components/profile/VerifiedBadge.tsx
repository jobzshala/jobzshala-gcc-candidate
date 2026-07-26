import { TickIcon, CrossIcon } from "@/components/ui/icons";

// Shared between ProfileTopBar (name header) and the Personal Details
// section (page.tsx) so both show the same verified/unverified indicator
// next to email and mobile number.
export default function VerifiedBadge({ verified, label }: { verified: boolean; label?: string }) {
  return (
    <span title={label} className="flex shrink-0 items-center">
      {verified ? <TickIcon className="size-4" /> : <CrossIcon className="size-4" />}
    </span>
  );
}
