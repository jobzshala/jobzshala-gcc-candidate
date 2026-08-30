/**
 * Voice Resume Builder — question config + static dummy data.
 *
 * STATIC-UI PHASE ONLY. The question list mirrors the backend constant the
 * sprint plan specifies (`src/shared/constants/voice-resume-questions.ts`) —
 * once `GET /candidate/voice-resume/questions` exists, the flow reads from
 * that endpoint and this local copy goes away. Same for DUMMY_ANSWERS, which
 * stands in for the transcription + extraction responses.
 */

export type VoiceResumeQuestionKey =
  | "FULL_NAME"
  | "LOCATION"
  | "EMPLOYMENT"
  | "EDUCATION"
  | "SKILLS"
  | "EXPECTED_SALARY";

export interface VoiceResumeLanguage {
  code: string;
  native: string;
  roman: string;
  rtl?: boolean;
  /** BCP-47 tag for the Web Speech API (SpeechSynthesisUtterance.lang). */
  speechLang: string;
  /** "You can speak in [language]" sample line the 🔊 Listen button reads aloud. */
  previewText: string;
}

export interface VoiceResumeQuestion {
  key: VoiceResumeQuestionKey;
  maxDurationSec: number;
  /** language code → question text, native script */
  text: Record<string, string>;
}

// No pre-recorded audio files — the 🔊 Listen button speaks previewText live
// via the browser's built-in SpeechSynthesis API (see previewLanguage() in
// app/(app)/voice-resume/page.tsx). Voice quality/availability depends on
// what the visitor's OS/browser ships, but it needs no audio assets, no
// backend, and no per-language recording to maintain.
export const VOICE_RESUME_LANGUAGES: VoiceResumeLanguage[] = [
  { code: "hi", native: "हिन्दी", roman: "Hindi", speechLang: "hi-IN", previewText: "आप हिंदी में बोल सकते हैं" },
  { code: "en", native: "English", roman: "English", speechLang: "en-IN", previewText: "You can speak in English" },
  { code: "ta", native: "தமிழ்", roman: "Tamil", speechLang: "ta-IN", previewText: "நீங்கள் தமிழில் பேசலாம்" },
  { code: "te", native: "తెలుగు", roman: "Telugu", speechLang: "te-IN", previewText: "మీరు తెలుగులో మాట్లాడవచ్చు" },
  { code: "kn", native: "ಕನ್ನಡ", roman: "Kannada", speechLang: "kn-IN", previewText: "ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು" },
  { code: "ml", native: "മലയാളം", roman: "Malayalam", speechLang: "ml-IN", previewText: "നിങ്ങൾക്ക് മലയാളത്തിൽ സംസാരിക്കാം" },
  { code: "ar", native: "العربية", roman: "Arabic", rtl: true, speechLang: "ar-SA", previewText: "يمكنك التحدث بالعربية" },
];

export const VOICE_RESUME_QUESTIONS: VoiceResumeQuestion[] = [
  {
    key: "FULL_NAME",
    maxDurationSec: 30,
    text: {
      en: "Please say your full name",
      hi: "अपना पूरा नाम बोलिए",
      ar: "قل اسمك الكامل",
      kn: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ",
      ta: "உங்கள் முழுப் பெயரைச் சொல்லுங்கள்",
      ml: "നിങ്ങളുടെ മുഴുവൻ പേര് പറയൂ",
      te: "మీ పూర్తి పేరు చెప్పండి",
    },
  },
  {
    key: "LOCATION",
    maxDurationSec: 30,
    text: {
      en: "Which city do you live in?",
      hi: "आप किस शहर में रहते हैं?",
      ar: "في أي مدينة تسكن؟",
      kn: "ನೀವು ಯಾವ ನಗರದಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?",
      ta: "நீங்கள் எந்த நகரத்தில் வசிக்கிறீர்கள்?",
      ml: "നിങ്ങൾ ഏത് നഗരത്തിലാണ് താമസിക്കുന്നത്?",
      te: "మీరు ఏ నగరంలో ఉంటారు?",
    },
  },
  {
    key: "EMPLOYMENT",
    maxDurationSec: 90,
    text: {
      en: "Tell us about your jobs — company, role, how many years",
      hi: "अपनी नौकरियों के बारे में बताइए — कंपनी, रोल, कितने साल",
      ar: "أخبرنا عن وظائفك — الشركة، الدور، كم سنة",
      kn: "ನಿಮ್ಮ ಕೆಲಸಗಳ ಬಗ್ಗೆ ಹೇಳಿ — ಕಂಪನಿ, ಹುದ್ದೆ, ಎಷ್ಟು ವರ್ಷ",
      ta: "உங்கள் வேலைகளைப் பற்றி சொல்லுங்கள் — நிறுவனம், பணி, எத்தனை ஆண்டுகள்",
      ml: "നിങ്ങളുടെ ജോലികളെക്കുറിച്ച് പറയൂ — കമ്പനി, റോൾ, എത്ര വർഷം",
      te: "మీ ఉద్యోగాల గురించి చెప్పండి — కంపెనీ, పాత్ర, ఎన్ని సంవత్సరాలు",
    },
  },
  {
    key: "EDUCATION",
    maxDurationSec: 60,
    text: {
      en: "Tell us about your education",
      hi: "अपनी पढ़ाई के बारे में बताइए",
      ar: "أخبرنا عن تعليمك",
      kn: "ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸದ ಬಗ್ಗೆ ಹೇಳಿ",
      ta: "உங்கள் படிப்பைப் பற்றி சொல்லுங்கள்",
      ml: "നിങ്ങളുടെ പഠനത്തെക്കുറിച്ച് പറയൂ",
      te: "మీ చదువు గురించి చెప్పండి",
    },
  },
  {
    key: "SKILLS",
    maxDurationSec: 60,
    text: {
      en: "What work / skills do you know?",
      hi: "आप कौनसे काम / स्किल्स जानते हैं?",
      ar: "ما هي الأعمال والمهارات التي تعرفها؟",
      kn: "ನಿಮಗೆ ಯಾವ ಕೆಲಸ / ಕೌಶಲ್ಯ ಗೊತ್ತು?",
      ta: "உங்களுக்கு என்ன வேலை / திறமைகள் தெரியும்?",
      ml: "നിങ്ങൾക്ക് ഏതെല്ലാം ജോലി / കഴിവുകൾ അറിയാം?",
      te: "మీకు ఏ పనులు / నైపుణ్యాలు వచ్చు?",
    },
  },
  {
    key: "EXPECTED_SALARY",
    maxDurationSec: 30,
    text: {
      en: "What salary do you expect?",
      hi: "आप कितनी सैलरी एक्सपेक्ट करते हैं?",
      ar: "ما الراتب الذي تتوقعه؟",
      kn: "ನೀವು ಎಷ್ಟು ಸಂಬಳ ನಿರೀಕ್ಷಿಸುತ್ತೀರಿ?",
      ta: "நீங்கள் எவ்வளவு சம்பளம் எதிர்பார்க்கிறீர்கள்?",
      ml: "നിങ്ങൾ എത്ര ശമ്പളം പ്രതീക്ഷിക്കുന്നു?",
      te: "మీరు ఎంత జీతం ఆశిస్తున్నారు?",
    },
  },
];

/** Stand-in for the transcription + extraction API responses. */
export interface DummyAnswer {
  transcript: string;
  fields?: { label: string; value: string | null }[];
  jobs?: { company: string; role: string; years: string }[];
  skills?: string[];
}

export const DUMMY_ANSWERS: Record<VoiceResumeQuestionKey, DummyAnswer> = {
  FULL_NAME: {
    transcript: "Ramesh Kumar",
    fields: [{ label: "Pura naam", value: "Ramesh Kumar" }],
  },
  LOCATION: {
    transcript: "Main Mumbai mein rehta hoon",
    fields: [
      { label: "Sheher", value: "Mumbai" },
      { label: "Rajya", value: "Maharashtra" },
    ],
  },
  EMPLOYMENT: {
    transcript:
      "Main warehouse mein supervisor tha, paanch saal ka experience hai. Company Gulf Star Manpower thi. Usse pehle do saal Reliance mein helper tha.",
    jobs: [
      { company: "Gulf Star Manpower", role: "Supervisor", years: "5 saal (approx.)" },
      { company: "Reliance", role: "Helper", years: "2 saal (approx.)" },
    ],
  },
  EDUCATION: {
    transcript: "Maine Delhi se ITI kiya hai",
    fields: [
      { label: "Qualification", value: "ITI" },
      { label: "Institute", value: "Delhi" },
    ],
  },
  SKILLS: {
    transcript: "Mujhe welding aur electrical wiring aati hai, forklift bhi chala leta hoon",
    skills: ["Welding", "Electrical Wiring", "Forklift Operation"],
  },
  EXPECTED_SALARY: {
    transcript: "Main pachees hazaar rupaye expect karta hoon",
    fields: [{ label: "Expected salary", value: "₹ 25,000 / month" }],
  },
};
