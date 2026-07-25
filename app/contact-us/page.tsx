import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the Jobzshala team — questions about hiring, candidate registration, or partnerships across the GCC.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact-us" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Get in"
            highlight="touch"
            subheading="Questions about hiring, registering as a candidate, or partnering with Jobzshala? Send us a message and our team will respond shortly."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
