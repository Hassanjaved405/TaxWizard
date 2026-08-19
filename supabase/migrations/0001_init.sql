-- Filings: one row per saved wizard run. Answers are stored raw (WizardAnswers
-- JSON) and re-summarized on read via computeFilingSummary(), so results never
-- go stale if the calc engine changes. Column-level encryption of `answers`
-- is a deliberately separate follow-up phase, not done here.
create table public.filings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tax_year text not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index filings_user_id_idx on public.filings (user_id);

alter table public.filings enable row level security;

create policy "select own filings" on public.filings
  for select using (auth.uid() = user_id);

create policy "insert own filings" on public.filings
  for insert with check (auth.uid() = user_id);

create policy "update own filings" on public.filings
  for update using (auth.uid() = user_id);

create policy "delete own filings" on public.filings
  for delete using (auth.uid() = user_id);
