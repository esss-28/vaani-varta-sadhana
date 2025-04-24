
export const LANGUAGES = {
  en: { name: "English", code: "en", displayName: "English" },
  hi: { name: "Hindi", code: "hi", displayName: "हिन्दी" },
  bn: { name: "Bengali", code: "bn", displayName: "বাংলা" },
  te: { name: "Telugu", code: "te", displayName: "తెలుగు" },
  mr: { name: "Marathi", code: "mr", displayName: "मराठी" },
  ta: { name: "Tamil", code: "ta", displayName: "தமிழ்" },
  ur: { name: "Urdu", code: "ur", displayName: "اردو" },
  gu: { name: "Gujarati", code: "gu", displayName: "ગુજરાતી" },
  kn: { name: "Kannada", code: "kn", displayName: "ಕನ್ನಡ" },
  ml: { name: "Malayalam", code: "ml", displayName: "മലയാളം" },
  pa: { name: "Punjabi", code: "pa", displayName: "ਪੰਜਾਬੀ" },
  or: { name: "Odia", code: "or", displayName: "ଓଡ଼ିଆ" },
};

export const REGIONS = [
  {
    name: "North",
    languages: ["hi", "ur", "pa"],
    pitch: 1.0,
    rate: 0.9,
  },
  {
    name: "South",
    languages: ["te", "ta", "kn", "ml"],
    pitch: 1.1,
    rate: 1.0,
  },
  {
    name: "East",
    languages: ["bn", "or"],
    pitch: 0.9,
    rate: 0.95,
  },
  {
    name: "West",
    languages: ["mr", "gu"],
    pitch: 1.0,
    rate: 1.0,
  },
  {
    name: "Central",
    languages: ["hi"],
    pitch: 1.0,
    rate: 0.9,
  },
  {
    name: "Northeast",
    languages: ["bn"],
    pitch: 0.9,
    rate: 0.9,
  },
];

export const TRANSLATION_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "mr", name: "Marathi" },
  { code: "kn", name: "Kannada" },
  { code: "gu", name: "Gujarati" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
];

export const findVoiceByLang = (voices: SpeechSynthesisVoice[], langCode: string): SpeechSynthesisVoice | null => {
  // First try to find a voice that exactly matches the language code
  const exactMatch = voices.find(voice => voice.lang.startsWith(langCode));
  if (exactMatch) return exactMatch;
  
  // If no exact match, try to find a voice with similar language code
  // e.g., for 'hi', try to find 'hi-IN'
  const similarMatch = voices.find(voice => voice.lang.startsWith(`${langCode}-`));
  if (similarMatch) return similarMatch;
  
  // If no similar match, for Indian languages, try to find an Indian English voice
  if (langCode !== 'en') {
    const indianEnglish = voices.find(voice => voice.lang === 'en-IN');
    if (indianEnglish) return indianEnglish;
  }
  
  // As a last resort, return the first available voice or null
  return voices.length > 0 ? voices[0] : null;
};
