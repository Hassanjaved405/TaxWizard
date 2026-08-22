create extension if not exists pgcrypto with schema extensions;

-- Pre-launch project, negligible existing test data — dropping and
-- retyping the column is simpler than an in-place encrypted backfill,
-- which would need the app's secret key at migration-apply time anyway.
alter table public.filings drop column answers;
alter table public.filings add column answers bytea not null;

-- Both functions run security invoker (the default), so the insert/select
-- inside them still go through the existing RLS policies using the
-- caller's own auth.uid() — encryption layers on top of RLS, it doesn't
-- replace it. insert_filing takes auth.uid() itself rather than trusting a
-- client-supplied user_id. pgcrypto lives in the "extensions" schema on
-- Supabase, not "public", so its functions are schema-qualified below.
create or replace function public.insert_filing(p_tax_year text, p_answers text, p_key text)
returns uuid
language sql
as $$
  insert into public.filings (user_id, tax_year, answers)
  values (auth.uid(), p_tax_year, extensions.pgp_sym_encrypt(p_answers, p_key))
  returning id;
$$;

create or replace function public.get_filing_answers(p_id uuid, p_key text)
returns text
language sql
stable
as $$
  select extensions.pgp_sym_decrypt(answers, p_key)
  from public.filings
  where id = p_id;
$$;

grant execute on function public.insert_filing(text, text, text) to authenticated;
grant execute on function public.get_filing_answers(uuid, text) to authenticated;
