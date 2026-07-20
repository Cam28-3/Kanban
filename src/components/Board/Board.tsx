// Top-level board screen. This is the main orchestrator: it owns the
// DndContext that makes drag-and-drop work, wires together the three data
// hooks (session, tasks, team members), and renders the header, the four
// columns, and both modals.
import { useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import confetti from 'canvas-confetti'
import { useGuestSession } from '../../hooks/useGuestSession'
import { useTasks } from '../../hooks/useTasks'
import { useTeamMembers } from '../../hooks/useTeamMembers'
import { STATUS_ORDER } from '../../types/task'
import type { Status } from '../../types/task'
import { Column } from './Column'
import { BoardStats } from './BoardStats'
import { TaskModal } from '../TaskModal/TaskModal'
import { TeamRoster } from '../Team/TeamRoster'
import { AddMemberModal } from '../Team/AddMemberModal'
import { Button } from '../ui/Button'
import { ErrorBanner } from '../ui/ErrorBanner'

export function Board() {
  const session = useGuestSession()
  const { tasks, loading, error, createTask, moveTask, deleteTask, retry, dismissError } = useTasks(
    session.session?.user.id,
  )
  const { members, addMember } = useTeamMembers(session.session?.user.id)
  const [modalOpen, setModalOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)

  // Full-page error state: the guest session itself failed to bootstrap
  // (e.g. Anonymous Sign-ins disabled in Supabase). Nothing else can work
  // without a session, so this replaces the whole board rather than showing
  // an empty one.
  if (session.error) {
    return (
      <div className="mx-auto mt-16 max-w-md px-4">
        <ErrorBanner message={`Couldn't start your session: ${session.error}`} onRetry={() => location.reload()} />
      </div>
    )
  }

  // Fires whenever a drag gesture ends anywhere in the DndContext below.
  //
  // Pseudocode:
  //   if the card wasn't dropped on any column -> do nothing (snaps back)
  //   look up which task was dragged, by id
  //   if its status actually changed:
  //     persist the move (optimistic update, see useTasks.moveTask)
  //     if it landed in "Done" -> fire a confetti burst positioned over
  //       that column (using the column's own on-screen rect, converted
  //       to the 0-1 fractional coordinates canvas-confetti expects)
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) {
      return
    }

    const nextStatus = over.id as Status
    const task = tasks.find((t) => t.id === active.id)
    if (task && task.status !== nextStatus) {
      moveTask(task.id, nextStatus)

      if (nextStatus === 'done') {
        const rect = over.rect
        confetti({
          particleCount: 90,
          spread: 65,
          startVelocity: 35,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ['#6366f1', '#34d399', '#fbbf24', '#a78bfa'], // app's own accent/status palette
        })
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Cam's Kanban</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">Guest Demo</p>
        </div>
        <div className="flex items-center gap-4">
          <BoardStats tasks={tasks} />
          <TeamRoster members={members} onAddClick={() => setAddMemberOpen(true)} />
          <Button onClick={() => setModalOpen(true)} disabled={session.loading}>
            New Task
          </Button>
        </div>
      </header>

      {/* Inline, dismissible error banner for task fetch/write failures
          (distinct from the full-page one above, which is session-level). */}
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} onRetry={retry} onDismiss={dismissError} />
        </div>
      )}

      {/* DndContext is @dnd-kit's provider — it listens for drag gestures
          anywhere inside it and calls handleDragEnd when one finishes.
          Each Column below registers itself as a drop target (useDroppable
          with id = its status), and each TaskCard registers as draggable
          (useDraggable with id = its task id) — that's how handleDragEnd
          knows both "which task" and "which column" from the event. */}
      <DndContext onDragEnd={handleDragEnd}>
        {/* items-start stops CSS Grid's default row-stretch behavior, so
            each column's height matches its own content instead of all four
            being forced to match the tallest one. */}
        <div className="grid grid-cols-4 items-start gap-6">
          {STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              loading={session.loading || loading}
              tasks={tasks.filter((task) => task.status === status)}
              teamMembers={members}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      {modalOpen && (
        <TaskModal
          onClose={() => setModalOpen(false)}
          onCreate={createTask}
          teamMembers={members}
        />
      )}

      {addMemberOpen && (
        <AddMemberModal onClose={() => setAddMemberOpen(false)} onAdd={addMember} />
      )}
    </div>
  )
}
