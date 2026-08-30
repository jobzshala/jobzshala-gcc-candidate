"use client";

import Link from "next/link";
import { MailIcon, QuestionIcon } from "@/components/ui/icons";
import { useClientSession } from "@/lib/auth/useClientSession";
import { ROUTES } from "@/lib/routes";

const GCC_COUNTRIES = ["UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain"];

export default function ContactInfo() {
  const session = useClientSession();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
        <h3 className="font-serif text-lg font-semibold text-jz-white-50">Email us directly</h3>
        <p className="mt-2 text-sm text-jz-white-400">
          Prefer email? Reach our team directly and we&apos;ll route your message to the right person.
        </p>
        <a
          href="mailto:support@jobzshala.com"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-jz-yellow-400 hover:underline"
        >
          <MailIcon className="size-4.5 shrink-0" />
          support@jobzshala.com
        </a>
      </div>

      <div className="rounded-2xl border border-jz-blue-400 bg-gradient-to-br from-jz-bg-primary to-jz-blue-900 p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-jz-blue-800 text-jz-blue-400">
            <QuestionIcon className="size-4.5" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold text-jz-white-50">Check the FAQ first</h3>
            <p className="mt-1 text-sm text-jz-white-400">
              Login, registration, subscriptions and account questions are usually answered instantly here.
            </p>
          </div>
        </div>
        <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-jz-blue-400 hover:underline">
          Browse FAQs →
        </Link>
      </div>

      <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
        <h3 className="font-serif text-lg font-semibold text-jz-white-50">Where we operate</h3>
        <p className="mt-2 text-sm text-jz-white-400">
          Jobzshala serves employers and candidates across the GCC.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GCC_COUNTRIES.map((country) => (
            <span
              key={country}
              className="rounded-full border border-jz-border bg-jz-blue-900 px-2.5 py-1 text-xs text-jz-white-200"
            >
              {country}
            </span>
          ))}
        </div>
      </div>

      {session ? (
        <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
          <h3 className="font-serif text-lg font-semibold text-jz-white-50">Already have an account</h3>
          <p className="mt-2 text-sm text-jz-white-400">
            For faster help on an active application or your profile, your dashboard has more context on your case
            than this form does.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href={ROUTES.journey} className="font-medium text-jz-yellow-400 hover:underline">
              Go to My Journey →
            </Link>
            <Link href={ROUTES.applications} className="font-medium text-jz-yellow-400 hover:underline">
              View my applications →
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
          <h3 className="font-serif text-lg font-semibold text-jz-white-50">Already looking for a job or hire?</h3>
          <p className="mt-2 text-sm text-jz-white-400">
            Skip the queue — register directly and our team will follow up as part of your onboarding.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/register?role=candidate" className="font-medium text-jz-yellow-400 hover:underline">
              Register as a candidate →
            </Link>
            <Link href="/pricing" className="font-medium text-jz-yellow-400 hover:underline">
              View employer plans →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
