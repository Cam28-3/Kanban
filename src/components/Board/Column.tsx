// One kanban column (To Do / In Progress / In Review / Done): a header with
// a colored status indicator + task count, and a drop zone containing that
// column's cards (or a loading/empty placeholder).
import { useDroppable } from '@dnd-kit/core'
import type { Status, Task, TeamMember } from '../../types/task'
import { STATUS_LABELS } from '../../types/task'
import { TaskCard } from '../TaskCard/TaskCard'
import { EmptyState } from '../ui/EmptyState'
import { ColumnSkeleton } from '../ui/Skeleton'

// Status-to-color mapping, kept in sync with components/TaskCard/TaskCard.tsx by convention.
const STATUS_ACCENT: Record<Status, string> = {
  todo: 'bg-status-todo',
  in_progress: 'bg-status-progress',
  in_review: 'bg-status-review',
  done: 'bg-status-done',
}

interface ColumnProps {
  status: Status
  tasks: Task[] // already filtered to just this column's tasks by Board.tsx
  loading: boolean
  teamMembers: TeamMember[] // passed straight through to each TaskCard
  onDeleteTask: (taskId: string) => void
}

export function Column({ status, tasks, loading, teamMembers, onDeleteTask }: ColumnProps) {
  // Registers this column as a drop target. `id: status` is what Board's
  // handleDragEnd reads as `over.id` to know which column a card was
  // dropped into. `isOver` flips true while something is being dragged
  // over this specific column, driving the highlight below.
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-3">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-[3px] w-4 rounded-pill ${STATUS_ACCENT[status]}`} />
        <h2 className="font-display text-sm font-semibold text-ink">{STATUS_LABELS[status]}</h2>
        <span className="ml-auto rounded-pill bg-white/5 px-2 py-0.5 font-mono text-[11px] font-bold text-ink-muted">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[8rem] flex-1 flex-col gap-3 rounded-xl p-1 transition-colors ${isOver ? 'bg-accent/10' : ''}`}
      >
        {/* Three states, in priority order: still loading -> skeleton,
            loaded but nothing here -> empty state, otherwise -> real cards. */}
        {loading ? (
          <ColumnSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
