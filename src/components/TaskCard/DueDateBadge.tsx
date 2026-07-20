// Colored pill showing a task's due date, styled by urgency (see
// utils/date.ts for the overdue/soon/normal classification). This is one
// of the two "advanced features" this project scoped in (the other is
// BoardStats' overdue count).
import { formatDueDate, getDueUrgency } from '../../utils/date'

const STYLES = {
  overdue: 'bg-danger/15 text-danger',
  soon: 'bg-status-progress/15 text-status-progress',
  normal: 'bg-white/5 text-ink-muted',
}

export function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  const urgency = getDueUrgency(dueDate)

  // No due date at all -> render nothing (no empty/placeholder badge).
  if (!urgency || !dueDate) return null

  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 font-mono text-[11px] font-bold ${STYLES[urgency]}`}
    >
      {urgency === 'overdue' ? 'Overdue · ' : ''}
      {formatDueDate(dueDate)}
    </span>
  )
}
