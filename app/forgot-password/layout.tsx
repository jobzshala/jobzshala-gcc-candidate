import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// noIndex: transient account-recovery step, no content worth indexing.
export const metadata: Metadata = pageMetadata({
  title: "Forgot Password",
  description: "Request a password reset link for your Jobzshala candidate account.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
