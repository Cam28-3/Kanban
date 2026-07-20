export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'

export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  status: Status
  user_id: string
  created_at: string
  description: string | null
  priority: Priority
  due_date: string | null
  assignee_id: string | null
}

export const STATUS_ORDER: Status[] = ['todo', 'in_progress', 'in_review', 'done']

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}
