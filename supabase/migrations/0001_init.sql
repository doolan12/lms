-- Forklift Theory LMS — initial schema
-- Run in Supabase SQL editor, or `supabase db push` with the Supabase CLI.

-- ─────────────────────────────────────────────────────────────
-- Profiles (one per auth user)
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Course content
-- ─────────────────────────────────────────────────────────────
create table public.courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  summary      text not null default '',
  description  text not null default '',
  price_cents  integer not null default 0 check (price_cents >= 0), -- 0 = free
  currency     text not null default 'aud',
  published    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table public.modules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses (id) on delete cascade,
  title      text not null,
  position   integer not null,
  unique (course_id, position)
);

-- Lesson metadata is public (so the course outline shows before purchase)…
create table public.lessons (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid not null references public.modules (id) on delete cascade,
  course_id        uuid not null references public.courses (id) on delete cascade,
  slug             text not null,
  title            text not null,
  position         integer not null,
  duration_minutes integer not null default 5,
  is_preview       boolean not null default false,
  unique (course_id, slug),
  unique (module_id, position)
);

-- …but the lesson body is only readable by enrolled students (or preview lessons).
create table public.lesson_content (
  lesson_id  uuid primary key references public.lessons (id) on delete cascade,
  body_md    text not null default '',
  video_url  text
);

-- ─────────────────────────────────────────────────────────────
-- Enrolments & progress
-- ─────────────────────────────────────────────────────────────
create table public.enrollments (
  user_id            uuid not null references auth.users (id) on delete cascade,
  course_id          uuid not null references public.courses (id) on delete cascade,
  stripe_session_id  text unique,
  amount_paid_cents  integer not null default 0,
  created_at         timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table public.lesson_progress (
  user_id       uuid not null references auth.users (id) on delete cascade,
  lesson_id     uuid not null references public.lessons (id) on delete cascade,
  completed_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────
-- Quizzes
-- ─────────────────────────────────────────────────────────────
create table public.quizzes (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses (id) on delete cascade,
  module_id  uuid references public.modules (id) on delete cascade, -- null = course-level
  title      text not null,
  pass_mark  integer not null default 80 check (pass_mark between 0 and 100),
  is_final   boolean not null default false
);

create table public.questions (
  id           uuid primary key default gen_random_uuid(),
  quiz_id      uuid not null references public.quizzes (id) on delete cascade,
  prompt       text not null,
  explanation  text not null default '',
  position     integer not null,
  unique (quiz_id, position)
);

create table public.options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions (id) on delete cascade,
  text         text not null,
  position     integer not null,
  is_correct   boolean not null default false
);

create table public.quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  quiz_id     uuid not null references public.quizzes (id) on delete cascade,
  score       integer not null,          -- percentage 0–100
  passed      boolean not null,
  answers     jsonb not null,            -- { question_id: option_id }
  created_at  timestamptz not null default now()
);

create index on public.modules (course_id);
create index on public.lessons (module_id);
create index on public.questions (quiz_id);
create index on public.options (question_id);
create index on public.quiz_attempts (user_id, quiz_id);

-- ─────────────────────────────────────────────────────────────
-- Helper: is the current user enrolled in a course?
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_enrolled(p_course_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.enrollments
    where user_id = auth.uid() and course_id = p_course_id
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.modules         enable row level security;
alter table public.lessons         enable row level security;
alter table public.lesson_content  enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes         enable row level security;
alter table public.questions       enable row level security;
alter table public.options         enable row level security;
alter table public.quiz_attempts   enable row level security;

-- Profiles: own row only
create policy "profiles: read own"   on public.profiles for select using (id = auth.uid());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid());

-- Public catalogue
create policy "courses: read published" on public.courses for select using (published);

create policy "modules: read published" on public.modules for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.published));

create policy "lessons: read published" on public.lessons for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.published));

create policy "quizzes: read published" on public.quizzes for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.published));

-- Gated content
create policy "lesson_content: preview or enrolled" on public.lesson_content for select
  using (exists (
    select 1 from public.lessons l
    where l.id = lesson_id and (l.is_preview or public.is_enrolled(l.course_id))
  ));

create policy "questions: enrolled" on public.questions for select
  using (exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and public.is_enrolled(q.course_id)
  ));

create policy "options: enrolled" on public.options for select
  using (exists (
    select 1 from public.questions qn join public.quizzes q on q.id = qn.quiz_id
    where qn.id = question_id and public.is_enrolled(q.course_id)
  ));

-- Never let students read which option is correct: column-level grant.
-- (Grading happens on the server with the service role.)
revoke select on public.options from anon, authenticated;
grant select (id, question_id, text, position) on public.options to anon, authenticated;
-- Explanations give the answer away, so they're also server-only (shown after an attempt).
revoke select on public.questions from anon, authenticated;
grant select (id, quiz_id, prompt, position) on public.questions to anon, authenticated;

-- Enrolments: students can read their own. Rows are created by the server
-- (Stripe webhook / free-course action) using the service role.
create policy "enrollments: read own" on public.enrollments for select using (user_id = auth.uid());

-- Progress: students manage their own, only for courses they're enrolled in
create policy "progress: read own" on public.lesson_progress for select using (user_id = auth.uid());
create policy "progress: insert own" on public.lesson_progress for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.lessons l where l.id = lesson_id and public.is_enrolled(l.course_id))
  );
create policy "progress: delete own" on public.lesson_progress for delete using (user_id = auth.uid());

-- Attempts: read own. Inserted by the server after grading.
create policy "attempts: read own" on public.quiz_attempts for select using (user_id = auth.uid());
