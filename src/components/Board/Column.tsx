import { useDroppable } from '@dnd-kit/core'
import type { Status, Task } from '../../types/task'
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
  tasks: Task[]
  loading: boolean
}

export function Column({ status, tasks, loading }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-[3px] w-4 rounded-pill ${STATUS_ACCENT[status]}`} />
        <h2 className="font-display text-sm font-semibold text-ink">{STATUS_LABELS[status]}</h2>
        <span className="ml-auto font-mono text-xs text-ink-faint">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[8rem] flex-1 flex-col gap-3 rounded-card p-1 transition-colors ${isOver ? 'bg-accent-soft' : ''}`}
      >
        {loading ? (
          <ColumnSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
