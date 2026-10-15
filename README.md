# Forklift Theory LMS

An online learning platform for selling forklift licence (HRWL class LF) theory courses in Australia.

**Stack:** Next.js 15 (App Router) · Supabase (Postgres, Auth, Row Level Security) · Stripe Checkout · Tailwind CSS

## What's in the MVP

- **Accounts** — email + password sign-up / sign-in (Supabase Auth)
- **Course catalogue** — public course pages with outline and free preview lessons
- **Payments** — Stripe Checkout in AUD; a webhook (plus a success-page fallback) creates the enrolment
- **Lessons** — markdown content with optional video embed, mark-complete, prev/next navigation
- **Progress** — per-lesson completion, course progress bar, "My learning" dashboard
- **Quizzes** — a quiz per module plus a final practice exam (unlocks when all lessons are done), graded on the server, with answer review and explanations
- **Sample content** — a 6-module forklift theory course (12 lessons, 34 questions) in `supabase/seed.sql`

### Security model

All access rules live in the database (`supabase/migrations/0001_init.sql`):

| Data | Who can read it |
|---|---|
| Courses, modules, lesson titles | Anyone (published courses) |
| Lesson content | Enrolled students, or anyone for preview lessons |
| Questions & options | Enrolled students — **never** `is_correct` or `explanation` |
| Enrolments, progress, quiz attempts | Only the student themselves |

Enrolments and quiz attempts can only be written by the server (service role), so students can't grant themselves access or fake scores.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (choose the Sydney region).
2. In **SQL Editor**, paste `supabase/setup.sql` (all migrations + seed in one file) and run it. Full step-by-step guide: [DEPLOY.md](DEPLOY.md).
3. In **Authentication → URL Configuration**, set the Site URL to your site and add `http://localhost:3000/auth/callback` (and your production `/auth/callback`) to the redirect URLs.

### 2. Stripe

1. Create an account at [stripe.com](https://stripe.com) and grab your **test** secret key.
2. For local development, install the Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_…` secret it prints.
3. In production, add a webhook endpoint at `https://YOUR-SITE/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### 3. Run it

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    page.tsx                                  Home + course list
    login/                                    Sign in / sign up (server actions)
    auth/callback/route.ts                    Email confirmation handler
    dashboard/page.tsx                        My learning
    courses/[slug]/page.tsx                   Course page, outline, buy button
    courses/[slug]/actions.ts                 Enrol / Stripe checkout, lesson completion
    courses/[slug]/lessons/[lessonSlug]/      Lesson viewer
    courses/[slug]/quizzes/[quizId]/          Quiz + server-side grading + results
    api/stripe/webhook/route.ts               Stripe → enrolment
  lib/
    supabase/{server,admin,middleware}.ts     Supabase clients
    courses.ts                                Course queries
    enrollment.ts                             Enrolment + checkout fulfilment
    stripe.ts
  middleware.ts                               Session refresh + route guard
supabase/
  migrations/0001_init.sql                    Schema + RLS
  seed.sql                                    Sample forklift theory course
```

## Editing course content

The source of truth for course content is `supabase/seed.sql`. Lesson bodies are Markdown; set `video_url` on a lesson to embed a recorded video (e.g. `https://player.vimeo.com/video/…` or `https://www.youtube.com/embed/…`).

**Updating content on the live site — without touching students' data:**

1. Edit `supabase/seed.sql` and commit nothing yet.
2. `npm run coverage -- --check` — every requirement still covered?
3. `npm run content:sync -- --name what-changed` — compares the last committed seed with your edits and writes the changes to `supabase/content-updates/`. It proves on a test copy that the update reproduces a fresh install exactly and keeps enrolments, progress and quiz attempts.
4. Run the generated part files, in order, in Supabase → SQL Editor. Then commit.

Never re-run `seed.sql` on the live database — it deletes and recreates the course, which removes everyone's enrolments and progress.

## Module videos

Each module has a narrated "video": a slideshow with diagrams, photos and captions. Scripts live in `src/content/videos/` (one entry per slide: what's shown, and what's said); diagrams are SVG components in `src/components/video/diagrams.tsx`. Module 1's video is a free preview. If the load chart in `seed.sql` changes, update `CHART_ROWS` in `modules-4-7.ts` to match.

**Narration** is recorded with [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) (free, open-source, Apache-2.0) by the *Record video narration* GitHub Action whenever a script changes. Only new or edited lines are recorded (`public/audio/`, listed in `audio-manifest.json`); any line without a recording falls back to the device's voice. To change the voice, set `NARRATION_VOICE` in `.github/workflows/narration.yml` (e.g. `bf_emma`, `bm_george`).

**Photos** come from Unsplash and are hotlinked with the photographer credit, as Unsplash requires. **Illustrations** are generated by the *Generate illustrations* GitHub Action using a free Hugging Face Space (prompts in `assets-pipeline/illustrations.json`); it retries every 6 hours until every image exists. Adding a free Hugging Face token as the repository secret `HF_TOKEN` raises the free allowance. Review new illustrations for unsafe practice before relying on them.

## Curriculum coverage (TLILIC0003)

Every lesson and question is tagged (`refs`) with the TLILIC0003 Knowledge Evidence (`KE01`–`KE16`) and Performance Evidence (`PE01`–`PE10`) items it addresses. The items live in the `curriculum_items` table.

```bash
npm run coverage            # regenerate docs/curriculum-coverage.md
npm run coverage -- --check # fail if any requirement has no question, or there are too few calculation questions
```

In Supabase you can also query `select * from curriculum_coverage;` in the SQL editor.

When you add or edit questions, tag them with the right codes and rerun the report.

> The content is original. Don't add questions copied from a SafeWork National Assessment Instrument (NAI) — NAIs are confidential to accredited assessors, and sharing them breaches the conditions of accreditation.

## Positioning (legal)

This is an **independent study aid**, like a driver-knowledge-test practice app — not a Registered Training Organisation (RTO).

- Don't describe it as accredited, nationally recognised, certified, a "licence course", or as delivering TLILIC0003. Only RTOs can deliver nationally recognised training; a non-RTO was convicted and fined under s123A of the *NVR Act 2011* for misrepresenting VET courses.
- Never use or imitate the confidential National Assessment Instrument, and never call practice questions "the real exam".
- No pass guarantees or regulator endorsements (Australian Consumer Law).
- The footer disclaimer and the `/terms`, `/privacy` and `/refunds` pages set this out for students. Set `NEXT_PUBLIC_CONTACT_EMAIL` (and `NEXT_PUBLIC_ABN` once you have one) in Vercel so those pages show your contact details.
- The content is internally mapped to TLILIC0003 so nothing is missed — keep that mapping internal. Have an experienced forklift trainer/assessor check the content for accuracy.

## Next steps

- Admin area for editing courses, lessons and questions in the browser
- Completion certificates (PDF)
- Question banks with randomised exams
- Email receipts and reminders
- Deploy to Vercel
