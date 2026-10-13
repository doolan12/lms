-- Flag calculation questions (load weight, load centre, load chart) so the
-- coverage report can check there are enough of them, and so the quiz page
-- can tell students to have a calculator ready.
alter table public.questions add column is_calculation boolean not null default false;

-- Safe for students to see (it doesn't reveal answers).
grant select (is_calculation) on public.questions to anon, authenticated;
