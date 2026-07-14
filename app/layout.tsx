import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import "./globals.css";

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
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#071022]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
