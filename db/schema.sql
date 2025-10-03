-- Run this in Supabase SQL editor
-- Create progress & attempts tables with RLS
create table if not exists progress (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stage int not null,
  completed_at timestamp with time zone default now(),
  unique(user_id, stage)
);

create table if not exists attempts (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stage int not null,
  answer text,
  correct boolean,
  attempted_at timestamp with time zone default now()
);

alter table progress enable row level security;
alter table attempts enable row level security;

-- Policies: users can insert their own rows and read their own data
create policy if not exists "progress_insert_own" on progress
  for insert with check (auth.uid() = user_id);

create policy if not exists "progress_select_own" on progress
  for select using (auth.uid() = user_id);

create policy if not exists "attempts_insert_own" on attempts
  for insert with check (auth.uid() = user_id);

create policy if not exists "attempts_select_own" on attempts
  for select using (auth.uid() = user_id);
