-- Security hardening (from Supabase's security advisor).

-- 1. The sign-up trigger function should only ever run as a trigger, never
--    be callable through the API (/rest/v1/rpc/handle_new_user).
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 2. is_enrolled() is used inside RLS policies, so the API roles must be able
--    to execute it — but it doesn't need to be an API endpoint. Move it to a
--    schema that isn't exposed by the Data API. Policies reference functions
--    by identity, so they keep working after the move.
create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;
alter function public.is_enrolled(uuid) set schema private;
grant execute on function private.is_enrolled(uuid) to anon, authenticated, service_role;
