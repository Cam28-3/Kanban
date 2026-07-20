export type DueUrgency = 'overdue' | 'soon' | 'normal'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function getDueUrgency(dueDate: string | null): DueUrgency | null {
  if (!dueDate) return null

  const today = startOfDay(new Date())
  const due = startOfDay(new Date(`${dueDate}T00:00:00`))
  const diffDays = Math.round((due.getTime() - today.getTime()) / MS_PER_DAY)

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'soon'
  return 'normal'
}

export function formatDueDate(dueDate: string): string {
  const date = new Date(`${dueDate}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
