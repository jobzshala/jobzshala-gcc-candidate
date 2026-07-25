import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// noIndex: reached only via a one-time emailed token.
export const metadata: Metadata = pageMetadata({
  title: "Reset Password",
  description: "Set a new password using your Jobzshala password reset link.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
