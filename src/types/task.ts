// Shared types for the board. These mirror the columns/tables defined in
// supabase/schema.sql — if you add a column there, add it here too.

// The four kanban columns. Order matters for rendering (see STATUS_ORDER).
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'

export type Priority = 'low' | 'normal' | 'high'

// Closed set of semantic color names (not raw hex codes). Each name maps to
// a fixed Tailwind color in components/ui/Avatar.tsx, so every team member's
// avatar and every task's assignee chip stays visually consistent.
export type AvatarColor =
  | 'rose'
  | 'orange'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'cyan'
  | 'sky'
  | 'violet'
  | 'fuchsia'

// One row from the `tasks` table.
export interface Task {
  id: string
  title: string
  status: Status
  user_id: string // owning guest session's auth.uid() — enforced by RLS
  created_at: string
  description: string | null
  priority: Priority
  due_date: string | null // ISO date string, e.g. "2026-07-21"
  labels: string[] // free-text tags the user typed in, e.g. ["bug", "urgent"]
  assignee_ids: string[] // TeamMember.id values assigned to this task (0 or more)
}

// One row from the `team_members` table. These are lightweight named
// "people" scoped to a single guest session — not real user accounts.
export interface TeamMember {
  id: string
  user_id: string // owning guest session, same as Task.user_id
  name: string
  color: AvatarColor
  created_at: string
}

// Left-to-right column order used everywhere the board is rendered.
export const STATUS_ORDER: Status[] = ['todo', 'in_progress', 'in_review', 'done']

// Human-readable column headings shown in the UI.
export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}
