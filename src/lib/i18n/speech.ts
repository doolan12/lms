// Narration in other languages: which languages have a recorded voice, and how text is cleaned for speaking.

/** Kokoro voices used for translated narration (lang code → voice + Kokoro language code). */
export const VOICED: Record<string, { voice: string; kokoroLang: string; label: string }> = {
  "zh-Hans": { voice: "zf_xiaoxiao", kokoroLang: "z", label: "普通话" },
  hi: { voice: "hf_alpha", kokoroLang: "h", label: "हिन्दी" },
  es: { voice: "ef_dora", kokoroLang: "e", label: "Español" },
  it: { voice: "if_sara", kokoroLang: "i", label: "Italiano" },
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
