import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password | Jobzshala",
  description: "Set a new password for your Jobzshala candidate account.",
};

export default function ChangePasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
