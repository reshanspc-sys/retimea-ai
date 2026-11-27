-- RETIMEA AI: private, account-owned projects and activity history.
-- Apply this migration in the Supabase SQL Editor for the Preview project.

create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  tool_key text not null check (char_length(tool_key) between 1 and 80),
  content jsonb not null default '{}'::jsonb,
  preview_text text not null default '' check (char_length(preview_text) <= 12000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_projects_content_size check (octet_length(content::text) <= 1048576)
);

create index if not exists user_projects_owner_updated_idx
  on public.user_projects (user_id, updated_at desc);

create table if not exists public.user_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (char_length(event_type) between 1 and 80),
  tool_key text not null check (char_length(tool_key) between 1 and 80),
  project_id uuid references public.user_projects(id) on delete set null,
  summary text not null default '' check (char_length(summary) <= 240),
  created_at timestamptz not null default now()
);

create index if not exists user_activity_owner_created_idx
  on public.user_activity (user_id, created_at desc);

alter table public.user_projects enable row level security;
alter table public.user_activity enable row level security;

-- A signed-in user can only read and modify their own projects.
drop policy if exists "Users can read their own projects" on public.user_projects;
create policy "Users can read their own projects"
  on public.user_projects for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own projects" on public.user_projects;
create policy "Users can create their own projects"
  on public.user_projects for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own projects" on public.user_projects;
create policy "Users can update their own projects"
  on public.user_projects for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own projects" on public.user_projects;
create policy "Users can delete their own projects"
  on public.user_projects for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Activity is private and append-only from the client.
drop policy if exists "Users can read their own activity" on public.user_activity;
create policy "Users can read their own activity"
  on public.user_activity for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own activity" on public.user_activity;
create policy "Users can add their own activity"
  on public.user_activity for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_projects to authenticated;
grant select, insert on public.user_activity to authenticated;
grant usage, select on sequence public.user_activity_id_seq to authenticated;
