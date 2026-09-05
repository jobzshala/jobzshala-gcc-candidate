/**
 * Voice Resume Builder — language picker config.
 *
 * The question list itself lives server-side
 * (`src/shared/constants/voice-resume-questions.ts`, served by
 * `GET /candidate/voice-resume/questions`) so devs change questions in ONE
 * place. This file only keeps what the language-select screen needs before
 * a session exists: native/roman names, RTL flag, and the speech-preview
 * config for the 🔊 Listen button.
 */

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

// No pre-recorded audio files needed here — the 🔊 Listen button speaks
// previewText live via the browser's built-in SpeechSynthesis API (see
// previewLanguage() in app/(app)/voice-resume/page.tsx), with the static
// /audio/voice-resume/{code}.mp3 clips as fallback.
export const VOICE_RESUME_LANGUAGES: VoiceResumeLanguage[] = [
  { code: "hi", native: "हिन्दी", roman: "Hindi", speechLang: "hi-IN", previewText: "आप हिंदी में बोल सकते हैं" },
  { code: "en", native: "English", roman: "English", speechLang: "en-IN", previewText: "You can speak in English" },
  { code: "ta", native: "தமிழ்", roman: "Tamil", speechLang: "ta-IN", previewText: "நீங்கள் தமிழில் பேசலாம்" },
  { code: "te", native: "తెలుగు", roman: "Telugu", speechLang: "te-IN", previewText: "మీరు తెలుగులో మాట్లాడవచ్చు" },
  { code: "kn", native: "ಕನ್ನಡ", roman: "Kannada", speechLang: "kn-IN", previewText: "ನೀವು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು" },
  { code: "ml", native: "മലയാളം", roman: "Malayalam", speechLang: "ml-IN", previewText: "നിങ്ങൾക്ക് മലയാളത്തിൽ സംസാരിക്കാം" },
  { code: "ar", native: "العربية", roman: "Arabic", rtl: true, speechLang: "ar-SA", previewText: "يمكنك التحدث بالعربية" },
];
