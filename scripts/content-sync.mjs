#!/usr/bin/env node
// Generates SQL that updates a LIVE database's course content from an older
// version of supabase/seed.sql to the current one — in place, by natural keys,
// so row ids are kept and students' enrolments, progress and quiz attempts are
// untouched. (Re-running seed.sql would delete and recreate the course.)
//
//   npm run content:sync -- [--from <git-ref>] [--name <label>]
//
// Writes supabase/content-updates/<date>-<label>-partN.sql (split into parts
// small enough to paste into the Supabase SQL editor), and proves the update
// is exact: old seed + update must equal the new seed, checked by checksum.

import { PGlite } from "@electric-sql/pglite";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > -1 ? process.argv[i + 1] : d;
};
const fromRef = arg("--from", "HEAD");
const fromFile = arg("--from-file");
const label = arg("--name", "content");
const SLUG = "forklift-licence-theory";

const oldSeed = fromFile ? readFileSync(fromFile, "utf8") : execSync(`git show ${fromRef}:supabase/seed.sql`, { cwd: root }).toString();
const newSeed = readFileSync(join(root, "supabase/seed.sql"), "utf8");

export const CHECKSUM_SQL = `select md5(string_agg(x, '|' order by x collate "C")) as digest, count(*) as n from (
  select 'C'||slug||title||summary||description||price_cents||currency||published x from public.courses
  union all select 'M'||m.position||m.title from public.modules m
  union all select 'L'||m.position||'/'||l.position||l.slug||l.title||l.duration_minutes||l.is_preview||array_to_string(l.refs,',')||lc.body_md from public.lessons l join public.modules m on m.id=l.module_id join public.lesson_content lc on lc.lesson_id=l.id
  union all select 'Q'||qz.title||qz.pass_mark||qz.is_final||'/'||qn.position||qn.prompt||qn.explanation||qn.is_calculation||array_to_string(qn.refs,',')||'/'||o.position||o.text||o.is_correct
    from public.options o join public.questions qn on qn.id=o.question_id join public.quizzes qz on qz.id=qn.quiz_id) s`;

async function load(seed) {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role; create schema auth;
    create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;`);
  const dir = join(root, "supabase/migrations");
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(readFileSync(join(dir, f), "utf8"));
  if (seed) await db.exec(seed);
  return db;
}

async function snapshot(db) {
  const q = async (s) => (await db.query(s)).rows;
  const [course] = await q(`select slug,title,summary,description,price_cents,currency,published from courses where slug='${SLUG}'`);
  const modules = await q(`select position,title from modules order by position`);
  const lessons = await q(`select l.slug,m.position as module,l.position,l.title,l.duration_minutes,l.is_preview,l.refs,lc.body_md
    from lessons l join modules m on m.id=l.module_id join lesson_content lc on lc.lesson_id=l.id`);
  const quizzes = await q(`select coalesce(m.position, 0) as module, qz.title, qz.pass_mark, qz.is_final
    from quizzes qz left join modules m on m.id=qz.module_id`);
  const questions = await q(`select coalesce(m.position, 0) as module, qn.position, qn.prompt, qn.explanation, qn.is_calculation, qn.refs
    from questions qn join quizzes qz on qz.id=qn.quiz_id left join modules m on m.id=qz.module_id`);
  const options = await q(`select coalesce(m.position, 0) as module, qn.position as qpos, o.position, o.text, o.is_correct
    from options o join questions qn on qn.id=o.question_id join quizzes qz on qz.id=qn.quiz_id left join modules m on m.id=qz.module_id`);
  return { course, modules, lessons, quizzes, questions, options };
}

// ── SQL helpers ─────────────────────────────────────────────
const lit = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return `array[${v.map(lit).join(",")}]::text[]`;
  let tag = "$t$";
  for (let i = 0; String(v).includes(tag); i++) tag = `$t${i}$`;
  return `${tag}${v}${tag}`;
};
const C = `(select id from public.courses where slug='${SLUG}')`;
const MOD = (p) => `(select id from public.modules where course_id=${C} and position=${p})`;
const QUIZ = (m) =>
  m === 0
    ? `(select id from public.quizzes where course_id=${C} and is_final)`
    : `(select id from public.quizzes where course_id=${C} and module_id=${MOD(m)})`;
const QUESTION = (m, p) => `(select id from public.questions where quiz_id=${QUIZ(m)} and position=${p})`;
const same = (a, b, keys) => keys.every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));

const A = await snapshot(await load(oldSeed));
const B = await snapshot(await load(newSeed));
const stmts = [];

// Course
if (!same(A.course, B.course, ["title", "summary", "description", "price_cents", "currency", "published"])) {
  const c = B.course;
  stmts.push(`update public.courses set title=${lit(c.title)}, summary=${lit(c.summary)}, description=${lit(c.description)}, price_cents=${c.price_cents}, currency=${lit(c.currency)}, published=${c.published} where slug='${SLUG}';`);
}

// Modules (by position). Adding/removing modules isn't supported here.
if (A.modules.length !== B.modules.length) throw new Error("Module count changed — handle with a manual migration.");
for (const m of B.modules) {
  const o = A.modules.find((x) => x.position === m.position);
  if (o.title !== m.title) stmts.push(`update public.modules set title=${lit(m.title)} where course_id=${C} and position=${m.position};`);
}

// Lessons (by slug)
const lessonKeys = ["module", "position", "title", "duration_minutes", "is_preview", "refs"];
const moved = B.lessons.filter((l) => {
  const o = A.lessons.find((x) => x.slug === l.slug);
  return o && (o.module !== l.module || o.position !== l.position);
});
const removedLessons = A.lessons.filter((o) => !B.lessons.some((l) => l.slug === o.slug));
for (const o of removedLessons) stmts.push(`delete from public.lessons where course_id=${C} and slug=${lit(o.slug)};`);
if (moved.length) {
  stmts.push(
    `update public.lessons set position = position + 1000 where course_id=${C} and slug in (${moved.map((l) => lit(l.slug)).join(",")});`,
  );
}
for (const l of B.lessons) {
  const o = A.lessons.find((x) => x.slug === l.slug);
  if (!o) {
    stmts.push(
      `with l as (insert into public.lessons (module_id, course_id, slug, title, position, duration_minutes, is_preview, refs) values (${MOD(l.module)}, ${C}, ${lit(l.slug)}, ${lit(l.title)}, ${l.position}, ${l.duration_minutes}, ${l.is_preview}, ${lit(l.refs)}) returning id) insert into public.lesson_content (lesson_id, body_md) select id, ${lit(l.body_md)} from l;`,
    );
    continue;
  }
  if (!same(o, l, lessonKeys)) {
    stmts.push(
      `update public.lessons set module_id=${MOD(l.module)}, position=${l.position}, title=${lit(l.title)}, duration_minutes=${l.duration_minutes}, is_preview=${l.is_preview}, refs=${lit(l.refs)} where course_id=${C} and slug=${lit(l.slug)};`,
    );
  }
  if (o.body_md !== l.body_md) {
    stmts.push(
      `update public.lesson_content set body_md=${lit(l.body_md)} where lesson_id=(select id from public.lessons where course_id=${C} and slug=${lit(l.slug)});`,
    );
  }
}

// Quizzes (by module; 0 = final)
for (const z of B.quizzes) {
  const o = A.quizzes.find((x) => x.module === z.module);
  if (!o) throw new Error(`New quiz for module ${z.module} — handle with a manual migration.`);
  if (!same(o, z, ["title", "pass_mark", "is_final"])) {
    stmts.push(`update public.quizzes set title=${lit(z.title)}, pass_mark=${z.pass_mark} where id=${QUIZ(z.module)};`);
  }
}

// Questions (by quiz + position) and their options
for (const o of A.questions) {
  if (!B.questions.some((q) => q.module === o.module && q.position === o.position)) {
    stmts.push(`delete from public.questions where quiz_id=${QUIZ(o.module)} and position=${o.position};`);
  }
}
for (const q of B.questions) {
  const o = A.questions.find((x) => x.module === q.module && x.position === q.position);
  const opts = B.options.filter((x) => x.module === q.module && x.qpos === q.position).sort((a, b) => a.position - b.position);
  if (!o) {
    stmts.push(
      `with q as (insert into public.questions (quiz_id, prompt, explanation, position, refs, is_calculation) values (${QUIZ(q.module)}, ${lit(q.prompt)}, ${lit(q.explanation)}, ${q.position}, ${lit(q.refs)}, ${q.is_calculation}) returning id) insert into public.options (question_id, text, position, is_correct) select q.id, v.text, v.position, v.is_correct from q, (values ${opts.map((x) => `(${lit(x.text)}, ${x.position}, ${x.is_correct})`).join(", ")}) as v(text, position, is_correct);`,
    );
    continue;
  }
  if (!same(o, q, ["prompt", "explanation", "is_calculation", "refs"])) {
    stmts.push(
      `update public.questions set prompt=${lit(q.prompt)}, explanation=${lit(q.explanation)}, is_calculation=${q.is_calculation}, refs=${lit(q.refs)} where quiz_id=${QUIZ(q.module)} and position=${q.position};`,
    );
  }
  const oldOpts = A.options.filter((x) => x.module === q.module && x.qpos === q.position);
  for (const x of opts) {
    const ox = oldOpts.find((y) => y.position === x.position);
    if (!ox) {
      stmts.push(`insert into public.options (question_id, text, position, is_correct) values (${QUESTION(q.module, q.position)}, ${lit(x.text)}, ${x.position}, ${x.is_correct});`);
    } else if (ox.text !== x.text || ox.is_correct !== x.is_correct) {
      stmts.push(`update public.options set text=${lit(x.text)}, is_correct=${x.is_correct} where question_id=${QUESTION(q.module, q.position)} and position=${x.position};`);
    }
  }
  for (const ox of oldOpts) {
    if (!opts.some((x) => x.position === ox.position)) {
      stmts.push(`delete from public.options where question_id=${QUESTION(q.module, q.position)} and position=${ox.position};`);
    }
  }
}

if (stmts.length === 0) {
  console.log("No content changes.");
  process.exit(0);
}

// Prove it: old seed + update == new seed
const check = await load(oldSeed);
// Simulate a live student so we can confirm their data survives
await check.exec(`insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111');
  insert into public.enrollments (user_id, course_id) select '11111111-1111-1111-1111-111111111111', id from public.courses;
  insert into public.lesson_progress (user_id, lesson_id) select '11111111-1111-1111-1111-111111111111', id from public.lessons;
  insert into public.quiz_attempts (user_id, quiz_id, score, passed, answers) select '11111111-1111-1111-1111-111111111111', id, 90, true, '{}' from public.quizzes;`);
const before = (await check.query(`select (select count(*) from enrollments) e, (select count(*) from lesson_progress) p, (select count(*) from quiz_attempts) a`)).rows[0];
await check.exec(stmts.join("\n"));
const after = (await check.query(`select (select count(*) from enrollments) e, (select count(*) from lesson_progress) p, (select count(*) from quiz_attempts) a`)).rows[0];
const got = (await check.query(CHECKSUM_SQL)).rows[0];
const want = (await (await load(newSeed)).query(CHECKSUM_SQL)).rows[0];
const oldSum = (await (await load(oldSeed)).query(CHECKSUM_SQL)).rows[0];
if (got.digest !== want.digest) throw new Error(`Update does not reproduce the new seed: ${got.digest} != ${want.digest}`);

// Split into parts that paste comfortably into the SQL editor
const date = new Date().toISOString().slice(0, 10);
const outDir = join(root, "supabase/content-updates");
mkdirSync(outDir, { recursive: true });
const parts = [];
let cur = [];
let size = 0;
for (const s of stmts) {
  if (size + s.length > 15000 && cur.length) {
    parts.push(cur);
    cur = [];
    size = 0;
  }
  cur.push(s);
  size += s.length;
}
if (cur.length) parts.push(cur);
const files = parts.map((p, i) => {
  const name = `${date}-${label}-part${i + 1}of${parts.length}.sql`;
  writeFileSync(
    join(outDir, name),
    `-- Generated by scripts/content-sync.mjs — run parts in order, on a database that matches\n-- the previous seed (checksum ${oldSum.digest}). Keeps all students' data.\n-- Afterwards the content checksum should be ${want.digest} (${want.n} records).\n\n${p.join("\n\n")}\n`,
  );
  return name;
});

console.log(`${stmts.length} statements in ${files.length} part(s):`);
for (const f of files) console.log("  supabase/content-updates/" + f);
console.log(`checksum before: ${oldSum.digest} (${oldSum.n})`);
console.log(`checksum after:  ${want.digest} (${want.n})  ✓ matches a fresh install`);
console.log(`student data kept: enrolments ${before.e}→${after.e}, progress ${before.p}→${after.p}, attempts ${before.a}→${after.a}`);
