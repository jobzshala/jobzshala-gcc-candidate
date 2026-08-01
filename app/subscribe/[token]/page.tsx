import type { Metadata } from "next";
import SessionGate from "@/lib/store/SessionGate";
import { pageMetadata } from "@/lib/seo";
import CustomOfferView from "./CustomOfferView";

// noindex: these are single-use private pricing links. They should never be
// crawled, and the token must not end up in a search index.
export const metadata: Metadata = pageMetadata({
  title: "Your offer",
  description: "A subscription offer prepared for you.",
  path: "/subscribe",
  noIndex: true,
});

// A server component so the token can be awaited off params (Next 16 passes
// params as a Promise) and so metadata can be declared here — a client
// component cannot export it. The token is handed to a client child because
// resolving it needs the signed-in candidate's access token, and the server
// has no session.
export default async function SubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <SessionGate>
      <CustomOfferView token={token} />
    </SessionGate>
  );
}
