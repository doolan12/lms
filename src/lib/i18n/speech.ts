// Narration in other languages: which languages have a recorded voice, and how text is cleaned for speaking.

/**
 * Recorded voices for translated narration.
 * Kokoro languages name their voice here. Google Cloud languages list locales to try; the exact
 * Google voice is chosen when recording and saved in that language's audio manifest.
 */
export type Voiced = { voice: string; kokoroLang?: string; google?: string[]; label: string };
export const VOICED: Record<string, Voiced> = {
  "zh-Hans": { voice: "zf_xiaoxiao", kokoroLang: "z", label: "普通话" },
  hi: { voice: "hf_alpha", kokoroLang: "h", label: "हिन्दी" },
  es: { voice: "ef_dora", kokoroLang: "e", label: "Español" },
  it: { voice: "if_sara", kokoroLang: "i", label: "Italiano" },
  ar: { voice: "", google: ["ar-XA"], label: "العربية" },
  vi: { voice: "", google: ["vi-VN"], label: "Tiếng Việt" },
  "zh-Hant": { voice: "", google: ["yue-HK", "cmn-TW"], label: "廣東話" },
  pa: { voice: "", google: ["pa-IN"], label: "ਪੰਜਾਬੀ" },
  el: { voice: "", google: ["el-GR"], label: "Ελληνικά" },
  tl: { voice: "", google: ["fil-PH"], label: "Filipino" },
};

/** Drop the "(English term)" helpers and markdown so the voice reads only the translation. */
export function speakable(text: string) {
  return text
    .replace(/\s*[(（][^()（）]*[A-Za-z][^()（）]*[)）]/g, "")
    .replace(/[*_#>`]/g, "")
    // "2,500" → "2500": in Spanish and Italian a comma is a decimal point, so the voice would misread it.
    .replace(/(\d),(?=\d{3}\b)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
