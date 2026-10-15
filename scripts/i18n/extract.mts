// Collects every piece of English learners see (lessons, questions, options, explanations,
// video narration, course/module/lesson titles) into keyed, hashed segments for translation.
//   node --experimental-strip-types scripts/i18n/extract.mts   → src/content/i18n/source.json
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { splitBlocks, isTranslatable } from "../../src/lib/i18n/blocks.ts";
import { segHash } from "../../src/lib/i18n/hash.ts";
import { module1, module2, module3 } from "../../src/content/videos/modules-1-3.ts";
import { module4, module5, module6, module7 } from "../../src/content/videos/modules-4-7.ts";
const MODULE_VIDEOS = { 1: module1, 2: module2, 3: module3, 4: module4, 5: module5, 6: module6, 7: module7 };

const root = process.cwd();
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
  create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;`);
const dir = join(root, "supabase/migrations");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(readFileSync(join(dir, f), "utf8"));
await db.exec(readFileSync(join(root, "supabase/seed.sql"), "utf8"));
const q = async (s: string) => (await db.query(s)).rows as any[];

const seg: Record<string, { h: string; t: string }> = {};
const add = (k: string, t: string) => {
  if (t && isTranslatable(t)) seg[k] = { h: segHash(t), t };
};

const [course] = await q(`select title, summary, description from courses`);
add("C:title", course.title);
add("C:summary", course.summary);
add("C:description", course.description);
for (const m of await q(`select position, title from modules order by position`)) add(`M:${m.position}`, m.title);
for (const l of await q(`select l.slug, l.title, lc.body_md from lessons l join lesson_content lc on lc.lesson_id=l.id join modules m on m.id=l.module_id order by m.position, l.position`)) {
  add(`T:${l.slug}`, l.title);
  splitBlocks(l.body_md).forEach((b, i) => add(`L:${l.slug}:${i}`, b));
}
const qs = await q(`select coalesce(m.position::text,'final') as qk, qz.title, qn.position, qn.prompt, qn.explanation, qn.id
  from questions qn join quizzes qz on qz.id=qn.quiz_id left join modules m on m.id=qz.module_id order by 1, 3`);
for (const r of qs) {
  add(`Z:${r.qk}`, r.title);
  add(`Q:${r.qk}:${r.position}:p`, r.prompt);
  add(`Q:${r.qk}:${r.position}:e`, r.explanation);
  for (const o of await q(`select position, text from options where question_id='${r.id}' order by position`))
    add(`Q:${r.qk}:${r.position}:o${o.position}`, o.text);
}
for (const [mod, v] of Object.entries(MODULE_VIDEOS)) {
  v.slides.forEach((s, si) => s.say.forEach((t, k) => add(`V:${mod}:${si}:${k}`, t)));
}
mkdirSync(join(root, "src/content/i18n"), { recursive: true });
writeFileSync(join(root, "src/content/i18n/source.json"), JSON.stringify(seg, null, 1) + "\n");
const words = Object.values(seg).reduce((n, s) => n + s.t.split(/\s+/).length, 0);
console.error(`${Object.keys(seg).length} segments, ${words} words`);
