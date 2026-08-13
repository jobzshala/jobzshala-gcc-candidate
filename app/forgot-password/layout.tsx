import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

// noIndex: transient account-recovery step, no content worth indexing.
export const metadata: Metadata = pageMetadata({
  title: "Forgot Password",
  description: "Request a password reset link for your Jobzshala candidate account.",
  path: ROUTES.forgotPassword,
  noIndex: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
