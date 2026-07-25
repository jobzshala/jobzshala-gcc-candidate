import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/seo";

// Generated rather than shipped as a static asset, so the social card can't
// drift out of sync with the brand copy. Applies to every route that doesn't
// declare its own OG image.
export const alt = "Jobzshala — AI-Native Workforce Infrastructure for the GCC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #001423 0%, #003d5b 55%, #005c87 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 64, fontWeight: 700 }}>
          <span style={{ color: "#ffffff" }}>jobz</span>
          <span style={{ color: "#ffc600" }}>shala</span>
        </div>

        <div style={{ marginTop: 8, fontSize: 26, color: "#9dd6ff" }}>{SITE_TAGLINE}</div>

        <div
          style={{
            marginTop: 44,
            fontSize: 46,
            lineHeight: 1.2,
            color: "#ffffff",
            fontWeight: 600,
            maxWidth: 900,
          }}
        >
          AI-Native Workforce Infrastructure for the GCC
        </div>

        <div style={{ marginTop: 28, fontSize: 24, lineHeight: 1.4, color: "#d6d8d4", maxWidth: 960 }}>
          {SITE_DESCRIPTION.split(" — ")[1] ?? SITE_DESCRIPTION}
        </div>

        <div style={{ marginTop: "auto", display: "flex", gap: 20, fontSize: 22, color: "#ffc600" }}>
          <span>UAE</span>
          <span>Saudi Arabia</span>
          <span>Qatar</span>
          <span>Oman</span>
          <span>Kuwait</span>
          <span>Bahrain</span>
        </div>
      </div>
    ),
    size
  );
}
