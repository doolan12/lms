// Shows which translated segments are missing or out of date after English content changes.
//   node --experimental-strip-types scripts/i18n/extract.mts && node scripts/i18n/status.mjs
// Out-of-date translations are hidden automatically in the app (the English still shows).
import { readFileSync } from "node:fs";
const source = JSON.parse(readFileSync("src/content/i18n/source.json", "utf8"));
const langs = ["zh-Hans", "ar", "vi", "zh-Hant", "pa", "el", "it", "tl", "hi", "es"];
for (const l of langs) {
  const t = JSON.parse(readFileSync(`src/content/i18n/${l}.json`, "utf8"));
  const stale = Object.entries(source).filter(([k, { h }]) => t[k]?.h !== h).map(([k]) => k);
  console.log(`${l.padEnd(8)} ${stale.length ? `${stale.length} need translating: ${stale.slice(0, 8).join(", ")}${stale.length > 8 ? "…" : ""}` : "✓ up to date"}`);
}
