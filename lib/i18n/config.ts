import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/content/en.json";
import hi from "@/content/hi.json";
import kn from "@/content/kn.json";
import ta from "@/content/ta.json";
import ml from "@/content/ml.json";
import ar from "@/content/ar.json";
import te from "@/content/te.json";

import { defaultLocale } from "./languages";

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  ml: { translation: ml },
  ar: { translation: ar },
  te: { translation: te },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });
}

export default i18n;
