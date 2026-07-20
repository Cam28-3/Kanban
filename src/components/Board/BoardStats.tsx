import type { Task } from '../../types/task'
import { getDueUrgency } from '../../utils/date'

interface BoardStatsProps {
  tasks: Task[]
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'done').length
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
            className={`font-mono text-lg font-semibold ${stat.label === 'Overdue' && stat.value > 0 ? 'text-danger' : 'text-ink'}`}
          >
            {stat.value}
          </span>
          <span className="font-body text-xs text-ink-faint">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
