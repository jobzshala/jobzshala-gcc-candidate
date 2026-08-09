import type { Metadata } from "next";
import SessionGate from "@/lib/store/SessionGate";
import DashboardShell from "./DashboardShell";
import { pageMetadata } from "@/lib/seo";

// A server layout so this authenticated area can declare noindex metadata (a
// client component can't export metadata) and so the session gate is scoped to
// this route group rather than the whole app. Shared by every top-level
// authenticated route (journey/profile/matches/subscription/documents) via
// the (app) route group — the parens keep it out of the URL, so each page
// gets a flat path instead of a shared /dashboard prefix.
export const metadata: Metadata = pageMetadata({
  title: "Dashboard",
  description: "Your Jobzshala candidate dashboard.",
  path: "/journey",
  noIndex: true,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate>
      <DashboardShell>{children}</DashboardShell>
    </SessionGate>
  );
}
