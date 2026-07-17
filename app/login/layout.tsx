import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Jobzshala",
  description: "Log in to your Jobzshala candidate account to track your workforce profile and job matches.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
