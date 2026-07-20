// Due-date urgency classification used by DueDateBadge (color) and
// BoardStats (the "Overdue" count).
export type DueUrgency = 'overdue' | 'soon' | 'normal'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Zeroes out the time portion so day-difference math isn't thrown off by
// the current hour/minute (e.g. comparing "today at 11pm" vs "today at 1am"
// should both count as day-difference 0, not -1 or +1 depending on time).
function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

// Pseudocode:
//   no due date set          -> null (badge doesn't render at all)
//   due date is in the past  -> "overdue"
//   due date is within 2 days -> "soon"
//   otherwise                -> "normal"
export function getDueUrgency(dueDate: string | null): DueUrgency | null {
  if (!dueDate) return null

  const today = startOfDay(new Date())
  // Appending T00:00:00 forces the date string to be parsed in local time
  // rather than UTC, so "2026-07-21" means July 21st wherever the user is,
  // not potentially the 20th if they're behind UTC.
  const due = startOfDay(new Date(`${dueDate}T00:00:00`))
  const diffDays = Math.round((due.getTime() - today.getTime()) / MS_PER_DAY)

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'soon'
  return 'normal'
}

// Formats an ISO date ("2026-07-21") as a short display string ("Jul 21").
export function formatDueDate(dueDate: string): string {
  const date = new Date(`${dueDate}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
