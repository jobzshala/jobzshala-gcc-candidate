import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Indexable: a genuine entry point candidates search for, not just an auth screen.
export const metadata: Metadata = pageMetadata({
  title: "Register",
  description:
    "Create your verified GCC Workforce Profile on Jobzshala — get screened once and be discovered by verified employers hiring across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
