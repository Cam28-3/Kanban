// Header stats strip: Total / Completed / Overdue counts, recalculated
// live from the current tasks array every render (no separate stored
// counters to keep in sync). This is the second of the two "advanced
// features" this project scoped in (the other is DueDateBadge).
import type { Task } from '../../types/task'
import { getDueUrgency } from '../../utils/date'

interface BoardStatsProps {
  tasks: Task[] // full task list across all columns, not just one column
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'done').length
  // "Overdue" excludes done tasks — a task finished after its due date
  // shouldn't still count as overdue.
  const overdue = tasks.filter(
    (task) => task.status !== 'done' && getDueUrgency(task.due_date) === 'overdue',
  ).length

  const stats = [
    { label: 'Total', value: total },
    { label: 'Completed', value: completed },
    { label: 'Overdue', value: overdue },
  ]

  return (
    <div className="flex divide-x divide-ink/5 rounded-card border border-ink/5 bg-surface px-5 py-3 shadow-card">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col px-5 first:pl-0 last:pr-0">
          <span
            // Only the Overdue number turns red, and only when it's > 0 —
            // a red "0" would read as a false alarm.
            className={`font-mono text-lg font-bold ${stat.label === 'Overdue' && stat.value > 0 ? 'text-danger' : 'text-ink'}`}
          >
            {stat.value}
          </span>
          <span className="font-body text-xs text-ink-faint">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
