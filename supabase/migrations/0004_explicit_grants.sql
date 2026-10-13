-- Explicit table privileges. Older Supabase projects grant these by default,
-- but newer projects may not auto-expose new tables to the API roles.
-- RLS policies still decide which ROWS each user can see; these grants only
-- decide which tables/columns the roles may touch at all.

grant usage on schema public to anon, authenticated, service_role;

-- Server (service role) — full access; it bypasses RLS for trusted operations.
grant all on all tables in schema public to service_role;
grant all on all functions in schema public to service_role;

-- Public catalogue + student data (rows filtered by RLS)
grant select on public.courses, public.modules, public.lessons, public.lesson_content,
               public.quizzes, public.curriculum_items
  to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.enrollments, public.quiz_attempts to authenticated;
grant select, insert, delete on public.lesson_progress to authenticated;

-- Questions/options: column-level only, so answers and explanations stay hidden.
grant select (id, quiz_id, prompt, position, is_calculation) on public.questions to anon, authenticated;
grant select (id, question_id, text, position) on public.options to anon, authenticated;

grant execute on function public.is_enrolled(uuid) to anon, authenticated;
