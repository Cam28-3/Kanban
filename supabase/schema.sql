-- Kanban board schema
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null check (
    status in ('todo', 'in_progress', 'in_review', 'done')
  ) default 'todo',
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  description text,
  priority text not null check (priority in ('low', 'normal', 'high')) default 'normal',
  due_date date,
  labels text [] not null default '{}'::text [],
  assignee_ids uuid [] not null default '{}'::uuid []
);
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null default 'sky',
  created_at timestamptz not null default now()
);
-- Safe to re-run against a database created before these columns/tables existed.
alter table public.tasks
add column if not exists labels text [] not null default '{}'::text [];
alter table public.tasks
add column if not exists assignee_ids uuid [] not null default '{}'::uuid [];
alter table public.tasks drop column if exists assignee_id;
create index if not exists tasks_user_id_created_at_idx on public.tasks (user_id, created_at);
alter table public.tasks enable row level security;
create policy "Users can select their own tasks" on public.tasks for
select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on public.tasks for
insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on public.tasks for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own tasks" on public.tasks for delete using (auth.uid() = user_id);
alter table public.team_members enable row level security;
create policy "Users can select their own team members" on public.team_members for
select using (auth.uid() = user_id);
create policy "Users can insert their own team members" on public.team_members for
insert with check (auth.uid() = user_id);
create policy "Users can update their own team members" on public.team_members for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own team members" on public.team_members for delete using (auth.uid() = user_id);