import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import IncidentHistory from "@/components/status/IncidentHistory";
import StatusBoard from "@/components/status/StatusBoard";
import { getSystemStatus } from "@/lib/api/system-status";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "System Status",
  description: "Live status and uptime history for Jobzshala's candidate app, employer portal, admin panel and core API.",
  path: "/status",
});

export default async function StatusPage() {
  let initialData;
  let loadError: string | null = null;
  try {
    initialData = await getSystemStatus(90);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unable to load system status.";
  }

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "System Status", path: "/status" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[860px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-jz-white-50 sm:text-4xl">System Status</h1>
            <p className="mt-3 max-w-2xl text-base text-jz-white-400">
              Live status and uptime history for the Jobzshala candidate app, employer portal, admin panel and core API.
            </p>
          </div>

          {initialData ? (
            <StatusBoard initialData={initialData} />
          ) : (
            <div className="rounded-2xl border border-jz-border bg-jz-blue-900 px-6 py-6 text-sm text-jz-white-400">
              {loadError}
            </div>
          )}

          <div className="mt-12">
            <IncidentHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
