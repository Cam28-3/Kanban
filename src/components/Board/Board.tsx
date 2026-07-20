import { useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { useGuestSession } from '../../hooks/useGuestSession'
import { useTasks } from '../../hooks/useTasks'
import { STATUS_ORDER } from '../../types/task'
import type { Status } from '../../types/task'
import { Column } from './Column'
import { BoardStats } from './BoardStats'
import { TaskModal } from '../TaskModal/TaskModal'
import { Button } from '../ui/Button'
import { ErrorBanner } from '../ui/ErrorBanner'

export function Board() {
  const session = useGuestSession()
  const { tasks, loading, error, createTask, moveTask, retry, dismissError } = useTasks(
    session.session?.user.id,
  )
  const [modalOpen, setModalOpen] = useState(false)

  if (session.error) {
    return (
      <div className="mx-auto mt-16 max-w-md px-4">
        <ErrorBanner message={`Couldn't start your session: ${session.error}`} onRetry={() => location.reload()} />
      </div>
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) {
      return
    }

    const nextStatus = over.id as Status
    const task = tasks.find((t) => t.id === active.id)
    if (task && task.status !== nextStatus) {
      moveTask(task.id, nextStatus)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Board</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">Guest session</p>
        </div>
        <div className="flex items-center gap-4">
          <BoardStats tasks={tasks} />
          <Button onClick={() => setModalOpen(true)} disabled={session.loading}>
            New Task
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} onRetry={retry} onDismiss={dismissError} />
        </div>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-6">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              loading={session.loading || loading}
              tasks={tasks.filter((task) => task.status === status)}
            />
          ))}
        </div>
      </DndContext>

      {modalOpen && (
        <TaskModal onClose={() => setModalOpen(false)} onCreate={createTask} />
      )}
    </div>
  )
}
