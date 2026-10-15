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
    .replace(/\s+/g, " ")
    .trim();
}
