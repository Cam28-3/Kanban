// A single draggable card on the board. Renders a task's title,
// description, assignee avatars, and its priority/due-date/label badges,
// plus a hover-reveal delete button.
import { useDraggable } from '@dnd-kit/core'
import type { Status, Task, TeamMember } from '../../types/task'
import { PriorityBadge } from './PriorityBadge'
import { DueDateBadge } from './DueDateBadge'
import { getLabelColor } from '../../utils/labelColor'
import { Avatar } from '../ui/Avatar'

// Status-to-color mapping, kept in sync with components/Board/Column.tsx by convention.
const STATUS_ACCENT: Record<Status, string> = {
  todo: 'border-l-status-todo',
  in_progress: 'border-l-status-progress',
  in_review: 'border-l-status-review',
  done: 'border-l-status-done',
}

interface TaskCardProps {
  task: Task
  teamMembers: TeamMember[] // full roster, so ids on the task can be resolved to name/color
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, teamMembers, onDelete }: TaskCardProps) {
  // useDraggable wires this card up to @dnd-kit's DndContext (set up in
  // Board.tsx). `id: task.id` is how Board's onDragEnd knows which task
  // was dropped where.
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  // While being dragged, dnd-kit reports a pixel offset (`transform`) from
  // the card's original position. Applying it as an inline style is what
  // makes the card visually follow the cursor. Important: no CSS
  // `transition` may apply to `transform` while dragging (see the
  // conditional className below), or the movement lags behind the cursor
  // instead of tracking it 1:1.
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  // task.assignee_ids only stores ids; look each one up in the full roster
  // to get the name/color needed to actually render an avatar. Any id that
  // no longer matches an existing member (e.g. it was deleted) is silently
  // dropped rather than showing a broken avatar.
  const assignees = task.assignee_ids
    .map((id) => teamMembers.find((member) => member.id === id))
    .filter((member): member is TeamMember => member !== undefined)

  function handleDeleteClick() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // `group` enables the group-hover: classes below (delete button).
      // The ternary strips all hover/transition classes while isDragging is
      // true — see the `style.transform` comment above for why.
      className={`group touch-none rounded-card border border-white/5 border-l-2 bg-surface p-4 shadow-card ${STATUS_ACCENT[task.status]} ${isDragging ? 'opacity-60 shadow-card-hover' : 'transition-all hover:-translate-y-0.5 hover:border-white/10 hover:bg-surface-hover hover:shadow-card-hover'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-semibold leading-snug text-ink">{task.title}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {assignees.length > 0 && (
            <div className="flex -space-x-2">
              {assignees.map((member) => (
                <Avatar key={member.id} name={member.name} color={member.color} ringed />
              ))}
            </div>
          )}
          <button
            type="button"
            // Stops the pointerdown here from ever reaching dnd-kit's drag
            // listeners on the parent card, so clicking delete can never be
            // mistaken for the start of a drag.
            onPointerDown={(event) => event.stopPropagation()}
            onClick={handleDeleteClick}
            className="opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 text-ink-faint"
            aria-label={`Delete ${task.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          </button>
        </div>
      </div>
      {task.description && (
        <p className="mt-1.5 whitespace-pre-wrap break-words font-body text-xs leading-relaxed text-ink-muted">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <DueDateBadge dueDate={task.due_date} />
        {task.labels.map((label) => (
          <span
            key={label}
            className={`inline-flex items-center rounded-pill px-2 py-0.5 font-mono text-[11px] font-bold ${getLabelColor(label)}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
