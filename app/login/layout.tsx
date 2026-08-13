import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Login",
  description:
    "Log in to your Jobzshala candidate account to track your workforce profile, verification status and GCC job matches.",
  path: ROUTES.login,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
