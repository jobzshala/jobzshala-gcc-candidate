import type { Metadata } from "next";
import SessionGate from "@/lib/store/SessionGate";
import DashboardShell from "./DashboardShell";
import { pageMetadata } from "@/lib/seo";

// A server layout so this authenticated area can declare noindex metadata (a
// client component can't export metadata) and so the session gate is scoped to
// the dashboard rather than the whole app.
export const metadata: Metadata = pageMetadata({
  title: "Dashboard",
  description: "Your Jobzshala candidate dashboard.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate>
      <DashboardShell>{children}</DashboardShell>
    </SessionGate>
  );
}
