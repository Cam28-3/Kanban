# Cam's Kanban

A Kanban-style task board — Vite + React + TypeScript + Tailwind CSS on the frontend, Supabase (Postgres + Auth) for the backend, deployed on Vercel.

**Live app:** https://camskanban.vercel.app
**Repo:** https://github.com/Cam28-3/Kanban

## Overview & Design Decisions

Users get a guest account automatically on first load via Supabase anonymous auth — no email/password required — and manage tasks across four columns (To Do, In Progress, In Review, Done) with drag-and-drop powered by `@dnd-kit`. The design uses a dark theme with per-status color accents (slate/amber/violet/emerald), translucent color-coded badges for priority/labels/due-dates, and the Geist typeface throughout.

Backend calls go directly from the frontend to Supabase — no separate API layer — with Row Level Security as the actual security boundary rather than client-side filtering. Every policy keys off `auth.uid() = user_id`, so one guest session's rows are never visible to another, enforced by Postgres itself.

## Setup Instructions (Local)

1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings (anon/public key only — never the service role key)
3. In the Supabase dashboard: **Authentication → Providers → enable Anonymous Sign-ins** (dashboard-only toggle, can't be set via SQL)
4. Run `supabase/schema.sql` in the Supabase SQL editor
5. `npm run dev`, then open the printed localhost URL

## Database Schema

See [`supabase/schema.sql`](supabase/schema.sql) for the full script. Summary:

- **`tasks`** — id, title, status, user_id, created_at, description, priority, due_date, labels (text[]), assignee_ids (uuid[])
- **`team_members`** — id, user_id, name, color, created_at

Both tables have RLS enabled with select/insert/update/delete policies scoped to `auth.uid() = user_id`.

## Advanced Features Built

- **Due Date Indicators** — colored badge per card (red = overdue, amber = due within 2 days, neutral = otherwise), computed live from `due_date`.
- **Board Summary/Stats** — header strip showing Total / Completed / Overdue counts, recalculated from the current task list on every render.
- **Team Members** — create lightweight team members (name + color) via the header widget, assign one or more to any task, see their initials-avatars stacked on the card. These are rows scoped to the guest session, not full linked accounts.
- **Custom Labels** — free-text tags typed into the task form (chip input, Enter/comma to add). Each label's color is derived deterministically from its own text, so the same label always renders the same color without a shared labels table.

Not built: comments, activity log, search/filter.

## Tech Stack

- Frontend: Vite + React + TypeScript + Tailwind CSS
- Drag-and-drop: `@dnd-kit/core`
- Backend: Supabase (Postgres + Auth), called directly from the frontend
- Hosting: Vercel
