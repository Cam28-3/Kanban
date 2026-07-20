import { useDraggable } from '@dnd-kit/core'
import type { Status, Task } from '../../types/task'
import { PriorityBadge } from './PriorityBadge'
import { DueDateBadge } from './DueDateBadge'

// Status-to-color mapping, kept in sync with components/Board/Column.tsx by convention.
const STATUS_ACCENT: Record<Status, string> = {
  todo: 'border-l-status-todo',
  in_progress: 'border-l-status-progress',
  in_review: 'border-l-status-review',
  done: 'border-l-status-done',
}

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none rounded-card border-l-[3px] bg-surface p-3 shadow-card transition-shadow hover:shadow-card-hover ${STATUS_ACCENT[task.status]} ${isDragging ? 'opacity-50' : ''}`}
    >
      <p className="font-display text-sm font-semibold text-ink">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 font-body text-xs text-ink-muted">{task.description}</p>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <DueDateBadge dueDate={task.due_date} />
      </div>
    </div>
  )
}
