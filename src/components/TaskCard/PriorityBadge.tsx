import type { Priority } from '../../types/task'

const STYLES: Record<Priority, string> = {
  low: 'bg-white/5 text-ink-faint',
  normal: 'bg-status-todo/15 text-status-todo',
  high: 'bg-danger/15 text-danger',
}

const LABELS: Record<Priority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  )
}
