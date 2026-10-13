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
2. In **SQL Editor**, run the files in `supabase/migrations/` in order (`0001`, `0002`, `0003`), then `supabase/seed.sql`.
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

For now, content is edited in Supabase (Table Editor or SQL). Lesson bodies are Markdown in `lesson_content.body_md`; set `video_url` to an embeddable URL (e.g. `https://player.vimeo.com/video/…` or `https://www.youtube.com/embed/…`).

## Curriculum coverage (TLILIC0003)

Every lesson and question is tagged (`refs`) with the TLILIC0003 Knowledge Evidence (`KE01`–`KE16`) and Performance Evidence (`PE01`–`PE10`) items it addresses. The items live in the `curriculum_items` table.

```bash
npm run coverage            # regenerate docs/curriculum-coverage.md
npm run coverage -- --check # fail if any requirement has no question, or there are too few calculation questions
```

In Supabase you can also query `select * from curriculum_coverage;` in the SQL editor.

When you add or edit questions, tag them with the right codes and rerun the report.

> The content is original. Don't add questions copied from a SafeWork National Assessment Instrument (NAI) — NAIs are confidential to accredited assessors, and sharing them breaches the conditions of accreditation.

## Compliance note

The sample content is general study material aligned to the topics of **TLILIC0003 Licence to operate a forklift truck**. Have your RTO or a qualified trainer review it before selling. This platform delivers theory preparation only — the licence itself is issued by the state or territory WHS regulator after assessment by an accredited assessor.

## Next steps

- Admin area for editing courses, lessons and questions in the browser
- Completion certificates (PDF)
- Question banks with randomised exams
- Email receipts and reminders
- Deploy to Vercel
