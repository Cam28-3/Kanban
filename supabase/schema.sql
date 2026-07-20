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
  assignee_id uuid references auth.users (id),
  labels text [] not null default '{}'::text []
);
alter table public.tasks
add column if not exists labels text [] not null default '{}'::text [];
create index if not exists tasks_user_id_created_at_idx on public.tasks (user_id, created_at);
alter table public.tasks enable row level security;
create policy "Users can select their own tasks" on public.tasks for
select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on public.tasks for
insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on public.tasks for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own tasks" on public.tasks for delete using (auth.uid() = user_id);