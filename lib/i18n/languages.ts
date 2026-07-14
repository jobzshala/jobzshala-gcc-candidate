export type LocaleCode = "en" | "hi" | "kn" | "ta" | "ml" | "ar" | "te";

export interface LanguageMeta {
  code: LocaleCode;
  label: string;
  short: string;
  dir: "ltr" | "rtl";
}

export const languages: LanguageMeta[] = [
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "hi", label: "हिन्दी", short: "HI", dir: "ltr" },
  { code: "kn", label: "ಕನ್ನಡ", short: "KN", dir: "ltr" },
  { code: "ta", label: "தமிழ்", short: "TA", dir: "ltr" },
  { code: "ml", label: "മലയാളം", short: "ML", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" },
  { code: "te", label: "తెలుగు", short: "TE", dir: "ltr" },
];

export const defaultLocale: LocaleCode = "en";

export function getLanguageMeta(code: string): LanguageMeta {
  return languages.find((l) => l.code === code) ?? languages[0];
}
