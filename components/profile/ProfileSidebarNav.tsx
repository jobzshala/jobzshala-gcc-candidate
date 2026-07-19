"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SECTIONS = [
  { id: "personal-details", labelKey: "profile.personalDetails.heading" },
  { id: "career-preference", labelKey: "profile.careerPreference.heading" },
  { id: "employment", labelKey: "profile.employment.heading" },
  { id: "education", labelKey: "profile.education.heading" },
  { id: "languages", labelKey: "profile.languages.heading" },
  { id: "resume", labelKey: "profile.resume.heading" },
  { id: "video", labelKey: "profile.video.heading" },
  { id: "documents", labelKey: "profile.documents.heading" },
] as const;

// Highlights whichever section is currently under the sticky top bar, so the
// sidebar reflects scroll position instead of just being a static list of
// links.
export default function ProfileSidebarNav() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length === 0) return;
        const topMost = intersecting.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActive(topMost.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-20 hidden w-52 shrink-0 self-start lg:block">
      <ul className="space-y-0.5 border-l border-jz-border">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block border-l-2 py-2 pl-4 text-sm transition-colors ${
                active === section.id
                  ? "border-jz-yellow-400 font-medium text-jz-yellow-400"
                  : "border-transparent text-jz-white-400 hover:text-jz-white-100"
              }`}
            >
              {t(section.labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
