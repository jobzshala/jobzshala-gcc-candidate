import type { Metadata } from "next";
import { Inter, Fraunces, Poppins } from "next/font/google";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import ThemeProvider from "@/lib/theme/ThemeProvider";
import StoreProvider from "@/lib/store/StoreProvider";
import JsonLd from "@/components/JsonLd";
import { ROUTES } from "@/lib/routes";
import {
  IS_CANONICAL_HOST,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

// Light is the default for a first-time visitor regardless of their OS setting;
// once they toggle, the stored preference wins on every later visit.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('jobzshala-candidate-theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

// Redirects an already-authenticated visitor away from the public landing
// page and the logged-out-only auth pages (login/register/forgot-password,
// plus a token-less reset-password) before any of them ever paint. This has
// to live here, in the root layout's <head>, not on the page itself (see
// components/RedirectIfAuthenticated.tsx history) — a <script> rendered via
// dangerouslySetInnerHTML inside page content gets inserted through
// React/RSC's client-side patching, where browsers never execute injected
// <script> tags; only a script that's part of the very first HTML the
// browser's own parser sees (the root <head>, same as THEME_INIT_SCRIPT
// above) reliably runs before paint. Self-scoped via a runtime pathname
// check since this fires on every route.
//
// reset-password is only guest-gated when it has no ?token= — that page is
// reached from an emailed link tied to a specific account, independent of
// whatever session happens to already be active in this browser, so a valid
// token must always be allowed through even for a logged-in visitor.
const REDIRECT_IF_AUTHED_SCRIPT = `(function(){try{var p=location.pathname;var guestOnly=p==='${ROUTES.home}'||p==='${ROUTES.login}'||p==='${ROUTES.register}'||p==='${ROUTES.forgotPassword}'||(p==='${ROUTES.resetPassword}'&&location.search.indexOf('token=')===-1);if(guestOnly){var raw=localStorage.getItem('jobzshala-candidate-session')||sessionStorage.getItem('jobzshala-candidate-session');if(raw){var target='${ROUTES.profile}';try{var s=JSON.parse(raw);if(s&&s.candidate&&s.candidate.must_change_password){target='${ROUTES.changePassword}';}}catch(e){}location.replace(target);}}}catch(e){}})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Landing page runs on Poppins (per Figma); the rest of the app stays on Inter.
// Applied via the `font-poppins` utility on the landing sections. The CSS var is
// named --font-poppins-family (not --font-poppins) so it doesn't collide with the
// @theme token of the same name in globals.css, which references it.
const poppins = Poppins({
  variable: "--font-poppins-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // metadataBase makes every relative URL in metadata below (and in each page's
  // canonical/OG fields) resolve to an absolute one, which OG and canonical
  // tags require. Set here so all routes inherit it.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jobzshala | AI-Native Workforce Infrastructure for the GCC",
    // Pages supply just their own name; this appends the brand consistently.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "GCC jobs",
    "Gulf jobs",
    "blue-collar recruitment",
    "UAE jobs",
    "Saudi Arabia jobs",
    "Qatar jobs",
    "workforce hiring GCC",
    "overseas jobs from India",
    "verified workforce",
    "visa and deployment",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  // Indexable only on jobzshala.ae / www.jobzshala.ae — any other subdomain or
  // domain this is deployed to serves noindex/nofollow (see IS_CANONICAL_HOST).
  robots: IS_CANONICAL_HOST
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          // Let Google use full-length text/video/image previews, which is what
          // rich results and AI Overviews draw on.
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Jobzshala | AI-Native Workforce Infrastructure for the GCC",
    description: SITE_DESCRIPTION,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobzshala | AI-Native Workforce Infrastructure for the GCC",
    description: SITE_DESCRIPTION,
  },
  category: "Employment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${poppins.variable} h-full antialiased`}
      // Tells Next.js the smooth scrolling set on `html` in globals.css is
      // intentional, so it skips resetting it to `auto` during route
      // transitions (and stops warning about it).
      data-scroll-behavior="smooth"
      // THEME_INIT_SCRIPT sets data-theme before hydration on purpose (to
      // avoid a flash of the wrong theme) — the server render never has this
      // attribute, since it doesn't know the visitor's stored preference.
      // That's an intentional, expected mismatch on this one attribute, not
      // a bug; suppressHydrationWarning tells React not to flag it.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: REDIRECT_IF_AUTHED_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        {/* Site-wide identity graph — every page inherits it, so Organization and
            WebSite are declared once here and referenced by @id elsewhere. */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <ThemeProvider>
          <LanguageProvider>
            <StoreProvider>{children}</StoreProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
