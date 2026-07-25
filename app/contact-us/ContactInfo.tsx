import Link from "next/link";
import { MailIcon } from "@/components/ui/icons";

const HELP_TOPICS = ["Recruitment Solutions", "Workforce Infrastructure", "AI Matching", "Candidate Verification", "Visa Assistance"];

const GCC_COUNTRIES = ["UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain"];

export default function ContactInfo() {
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

      <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
        <h3 className="font-serif text-lg font-semibold text-jz-white-50">What we can help with</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {HELP_TOPICS.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-sm text-jz-white-400">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-jz-yellow-400" aria-hidden="true" />
              {topic}
            </li>
          ))}
        </ul>
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
    </div>
  );
}
