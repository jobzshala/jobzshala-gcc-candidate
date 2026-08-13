import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

// noIndex: reached only via a one-time emailed token.
export const metadata: Metadata = pageMetadata({
  title: "Reset Password",
  description: "Set a new password using your Jobzshala password reset link.",
  path: ROUTES.resetPassword,
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
