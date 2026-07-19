import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import ThemeProvider from "@/lib/theme/ThemeProvider";
import StoreProvider from "@/lib/store/StoreProvider";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('jobzshala-candidate-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

// Redirects an already-authenticated visitor away from the public landing
// page before it ever paints. This has to live here, in the root layout's
// <head>, not on the page itself (see components/RedirectIfAuthenticated.tsx
// history) — a <script> rendered via dangerouslySetInnerHTML inside page
// content gets inserted through React/RSC's client-side patching, where
// browsers never execute injected <script> tags; only a script that's part
// of the very first HTML the browser's own parser sees (the root <head>,
// same as THEME_INIT_SCRIPT above) reliably runs before paint. Self-scoped
// to "/" via a runtime pathname check since this fires on every route.
const REDIRECT_IF_AUTHED_SCRIPT = `(function(){try{if(location.pathname==='/'&&(localStorage.getItem('jobzshala-candidate-session')||sessionStorage.getItem('jobzshala-candidate-session'))){location.replace('/dashboard/profile');}}catch(e){}})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jobzshala | AI-Native Workforce Infrastructure for the GCC",
  description:
    "Jobzshala helps GCC employers source, verify, hire, deploy and manage trusted blue-collar workforce across the region.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
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
        <ThemeProvider>
          <LanguageProvider>
            <StoreProvider>{children}</StoreProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
