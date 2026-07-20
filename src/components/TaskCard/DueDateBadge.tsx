import { formatDueDate, getDueUrgency } from '../../utils/date'

const STYLES = {
  overdue: 'bg-danger/15 text-danger',
  soon: 'bg-status-progress/15 text-status-progress',
  normal: 'bg-white/5 text-ink-muted',
}

export function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  const urgency = getDueUrgency(dueDate)

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
