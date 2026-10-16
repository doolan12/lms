import "server-only";
import { createHash } from "node:crypto";
import manifest from "./audio-manifest.json";
import type { ModuleVideo } from "./types";
import { VOICED, speakable } from "@/lib/i18n/speech";
import mZhHans from "./audio-manifest.zh-Hans.json";
import mHi from "./audio-manifest.hi.json";
import mEs from "./audio-manifest.es.json";
import mIt from "./audio-manifest.it.json";
import mAr from "./audio-manifest.ar.json";
import mVi from "./audio-manifest.vi.json";
import mZhHant from "./audio-manifest.zh-Hant.json";
import mPa from "./audio-manifest.pa.json";
import mEl from "./audio-manifest.el.json";
import mTl from "./audio-manifest.tl.json";

// Must match scripts/narration/manifest.mts
const lineId = (text: string, voice: string) =>
  createHash("sha1").update(`${voice}|${text}`).digest("hex").slice(0, 16);

const recorded = new Set<string>(manifest.ids);

/** URL of the recorded narration for each line, or null to fall back to the device voice. */
export function narrationAudio(video: ModuleVideo): (string | null)[][] {
  return video.slides.map((s) =>
    s.say.map((text) => {
      const id = lineId(text, manifest.voice);
      return recorded.has(id) ? `/audio/${id}.mp3` : null;
    }),
  );
}


const I18N_MANIFESTS: Record<string, { voice: string; ids: string[] }> = {
  "zh-Hans": mZhHans, hi: mHi, es: mEs, it: mIt,
  ar: mAr, vi: mVi, "zh-Hant": mZhHant, pa: mPa, el: mEl, tl: mTl,
};
const recordedI18n = Object.fromEntries(Object.entries(I18N_MANIFESTS).map(([l, m]) => [l, new Set(m.ids)]));

/** Recorded narration in the learner's language, line by line (null where not recorded), or undefined if none. */
export function translatedNarrationAudio(lang: string, translated: (string | null)[][]): (string | null)[][] | undefined {
  const m = I18N_MANIFESTS[lang];
  const have = recordedI18n[lang];
  if (!VOICED[lang] || !m?.voice || !have || have.size === 0) return undefined;
  const out = translated.map((row) =>
    row.map((t) => {
      if (!t) return null;
      const id = createHash("sha1").update(`${m.voice}|${speakable(t)}`).digest("hex").slice(0, 16);
      return have.has(id) ? `/audio/${id}.mp3` : null;
    }),
  );
  return out.some((r) => r.some(Boolean)) ? out : undefined;
}
