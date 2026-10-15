import "server-only";
import { cookies } from "next/headers";
import { findLang, LANG_COOKIE, type Lang } from "./languages";
import { segHash } from "./hash";

type Table = Record<string, { h: string; t: string }>;

// Translation files live in src/content/i18n/<code>.json as { key: { h: hash of English, t: text } }.
const loaders: Record<string, () => Promise<{ default: Table }>> = {
  "zh-Hans": () => import("@/content/i18n/zh-Hans.json"),
  ar: () => import("@/content/i18n/ar.json"),
  vi: () => import("@/content/i18n/vi.json"),
  "zh-Hant": () => import("@/content/i18n/zh-Hant.json"),
  pa: () => import("@/content/i18n/pa.json"),
  el: () => import("@/content/i18n/el.json"),
  it: () => import("@/content/i18n/it.json"),
  tl: () => import("@/content/i18n/tl.json"),
  hi: () => import("@/content/i18n/hi.json"),
  es: () => import("@/content/i18n/es.json"),
};

export type Translator = {
  lang: Lang;
  /** The translation of `english` stored under `key`, or null if missing or out of date. */
  t: (key: string, english: string | null | undefined) => string | null;
};

/** The learner's chosen language (from the picker cookie) and a lookup, or null for English only. */
export async function getTranslator(): Promise<Translator | null> {
  const lang = findLang((await cookies()).get(LANG_COOKIE)?.value);
  if (!lang || !loaders[lang.code]) return null;
  const table = (await loaders[lang.code]()).default as Table;
  return {
    lang,
    t: (key, english) => {
      const hit = table[key];
      if (!hit || !english || hit.h !== segHash(english)) return null;
      return hit.t;
    },
  };
}
