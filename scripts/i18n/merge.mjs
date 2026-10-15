// Checks a language's translated chunks against the English source and builds the app file.
//   node scripts/i18n/merge.mjs <lang>     e.g. node scripts/i18n/merge.mjs vi
// Reads scripts/i18n/work/<lang>-NN.json ({ key: translated text }) and writes
// src/content/i18n/<lang>.json ({ key: { h: hash of English, t: translation } }).
// Exits non-zero and lists problems if anything is missing or the structure doesn't match.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const lang = process.argv[2];
if (!lang) throw new Error("usage: node scripts/i18n/merge.mjs <lang>");
const source = JSON.parse(readFileSync("src/content/i18n/source.json", "utf8"));
const dir = "scripts/i18n/work";
const tr = {};
for (const f of readdirSync(dir).filter((f) => f.startsWith(`${lang}-`) && f.endsWith(".json")).sort()) {
  let data;
  try {
    data = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  } catch (e) {
    console.error(`✗ ${f}: invalid JSON — ${e.message}`);
    process.exit(1);
  }
  Object.assign(tr, data);
}

const problems = [];
const nums = (s) => (s.match(/\d[\d,.]*/g) ?? []).map((n) => n.replace(/[.,]$/, ""));
const pipes = (s) => s.split("\n").filter((l) => l.trim().startsWith("|")).map((l) => (l.match(/\|/g) ?? []).length);

for (const [key, { t: en }] of Object.entries(source)) {
  const t = tr[key];
  if (typeof t !== "string" || !t.trim()) {
    problems.push(`${key}: missing`);
    continue;
  }
  const e0 = en.trimStart(), t0 = t.trimStart();
  for (const m of ["### ", "## ", "> ", "- "]) if (e0.startsWith(m) && !t0.startsWith(m)) problems.push(`${key}: should start with "${m}"`);
  const ol = e0.match(/^(\d+)\. /);
  if (ol && !t0.startsWith(`${ol[1]}. `)) problems.push(`${key}: should start with "${ol[1]}. "`);
  const eb = (en.match(/\*\*/g) ?? []).length, tb = (t.match(/\*\*/g) ?? []).length;
  if (tb % 2) problems.push(`${key}: unbalanced ** (bold)`);
  if (t.includes("****")) problems.push(`${key}: two bold phrases touch (****) — add a space`);
  if (eb > 0 && tb === 0) problems.push(`${key}: lost all bold`);
  const ep = pipes(en), tp = pipes(t);
  if (ep.length && JSON.stringify(ep) !== JSON.stringify(tp)) problems.push(`${key}: table shape differs (en ${ep.length} rows ${ep.join("/")} vs ${tp.length} rows ${tp.join("/")})`);
  if (!key.startsWith("V:")) {
    const tn = new Set(nums(t).map((n) => n.replace(/,/g, "")));
    for (const n of nums(en)) if (!tn.has(n.replace(/,/g, ""))) { problems.push(`${key}: number "${n}" missing`); break; }
  }
  if (/[٠-٩]/.test(t)) problems.push(`${key}: use Western digits 0-9, not Arabic-Indic`);
}
const extra = Object.keys(tr).filter((k) => !source[k]);
if (extra.length) problems.push(`unknown keys: ${extra.slice(0, 5).join(", ")}${extra.length > 5 ? "…" : ""}`);

if (problems.length) {
  console.error(`✗ ${lang}: ${problems.length} problem(s)\n` + problems.slice(0, 60).join("\n"));
  process.exit(1);
}
const out = Object.fromEntries(Object.entries(source).map(([k, { h }]) => [k, { h, t: tr[k] }]));
writeFileSync(`src/content/i18n/${lang}.json`, JSON.stringify(out) + "\n");
console.log(`✓ ${lang}: ${Object.keys(out).length} segments OK → src/content/i18n/${lang}.json`);
