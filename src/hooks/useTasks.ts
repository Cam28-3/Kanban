// Central data hook for the board: fetches a guest user's tasks and exposes
// create/move/delete actions. Owns the single source of truth for `tasks`
// state that Board.tsx renders.
//
// Optimistic-update pattern used by moveTask and deleteTask (this is the
// pattern behind the "instant" drag-and-drop feel):
//   1. snapshot the current tasks list
//   2. update local state immediately, as if the write already succeeded
//   3. send the actual write to Supabase
//   4. if it fails, roll local state back to the snapshot and surface the
//      error (Board.tsx shows this via ErrorBanner with a Retry button)
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Priority, Status, Task } from '../types/task'

// Fields the caller can supply when creating a task; everything else
// (id, status, user_id, created_at) is filled in here or by the database.
interface NewTaskInput {
  title: string
  description?: string
  priority?: Priority
  due_date?: string | null
  labels?: string[]
  assignee_ids?: string[]
}

interface UseTasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

export function useTasks(userId: string | undefined) {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    loading: true,
    error: null,
  })

  // Loads every task belonging to this guest user, oldest first.
  // RLS on the `tasks` table would enforce this scoping even without the
  // .eq('user_id', ...) filter, but filtering client-side too avoids an
  // unnecessary round trip of rows that would just get rejected.
  const fetchTasks = useCallback(async () => {
    if (!userId) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      setState({ tasks: [], loading: false, error: error.message })
      return
    }

    setState({ tasks: data as Task[], loading: false, error: null })
  }, [userId])

  // Re-fetch whenever the signed-in user changes (i.e. once the guest
  // session finishes bootstrapping in useGuestSession).
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Inserts a new task (always starts in the "todo" column) and appends the
  // server's copy of the row (with its generated id) to local state.
  const createTask = useCallback(
    async (input: NewTaskInput) => {
      if (!userId) return

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: input.title,
          description: input.description ?? null,
          priority: input.priority ?? 'normal',
          due_date: input.due_date ?? null,
          labels: input.labels ?? [],
          assignee_ids: input.assignee_ids ?? [],
          status: 'todo',
          user_id: userId,
        })
        .select()
        .single()

      if (error) {
        setState((prev) => ({ ...prev, error: error.message }))
        return
      }

      setState((prev) => ({ ...prev, tasks: [...prev.tasks, data as Task], error: null }))
    },
    [userId],
  )

  // Moves a task to a new column. See the optimistic-update pattern above —
  // this is what makes dragging a card feel instant instead of laggy.
  const moveTask = useCallback(async (taskId: string, nextStatus: Status) => {
    let previousTasks: Task[] = []

    setState((prev) => {
      previousTasks = prev.tasks
      return {
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === taskId ? { ...task, status: nextStatus } : task,
        ),
        error: null,
      }
    })

    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', taskId)

    if (error) {
      setState((prev) => ({ ...prev, tasks: previousTasks, error: error.message }))
    }
  }, [])

  // Removes a task. Same optimistic-then-rollback pattern as moveTask.
  // The caller (TaskCard) is responsible for confirming with the user first.
  const deleteTask = useCallback(async (taskId: string) => {
    let previousTasks: Task[] = []

    setState((prev) => {
      previousTasks = prev.tasks
      return { ...prev, tasks: prev.tasks.filter((task) => task.id !== taskId), error: null }
    })

    const { error } = await supabase.from('tasks').delete().eq('id', taskId)

    if (error) {
      setState((prev) => ({ ...prev, tasks: previousTasks, error: error.message }))
    }
  }, [])

  // Clears a surfaced error without retrying (used by ErrorBanner's dismiss button).
  const dismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    createTask,
    moveTask,
    deleteTask,
    retry: fetchTasks,
    dismissError,
  }
}
