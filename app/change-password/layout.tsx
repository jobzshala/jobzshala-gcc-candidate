import type { Metadata } from "next";
import SessionGate from "@/lib/store/SessionGate";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

// noIndex: account-only page with no content worth surfacing in search.
export const metadata: Metadata = pageMetadata({
  title: "Change Password",
  description: "Set a new password for your Jobzshala candidate account.",
  path: ROUTES.changePassword,
  noIndex: true,
});

// Gated: the page reads the rehydrated session to know whose password to change.
export default function ChangePasswordLayout({ children }: { children: React.ReactNode }) {
  return <SessionGate>{children}</SessionGate>;
}
