import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Priority, Status, Task } from '../types/task'

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

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

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

  const dismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    createTask,
    moveTask,
    retry: fetchTasks,
    dismissError,
  }
}
