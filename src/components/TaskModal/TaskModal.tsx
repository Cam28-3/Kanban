// "New Task" form, shown as a modal over the board. Manages its own local
// form state and only reports out to the parent (via onCreate) once, on
// submit — the parent then does the actual Supabase insert (see
// useTasks.createTask) and this modal doesn't know or care that it's
// talking to a database.
import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import type { Priority, TeamMember } from '../../types/task'
import { getLabelColor } from '../../utils/labelColor'

interface TaskModalProps {
  onClose: () => void
  teamMembers: TeamMember[]
  onCreate: (input: {
    title: string
    description?: string
    priority: Priority
    due_date: string | null
    labels: string[]
    assignee_ids: string[]
  }) => Promise<void>
}

export function TaskModal({ onClose, onCreate, teamMembers }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [labels, setLabels] = useState<string[]>([])
  const [labelInput, setLabelInput] = useState('')
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Assignees are toggled on/off by clicking their chip: present in the
  // list -> remove it, absent -> add it. This is how one task can have
  // multiple (or zero) assignees.
  function toggleAssignee(memberId: string) {
    setAssigneeIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  // Turns whatever's currently typed in the label input into a chip, then
  // clears the input. Ignores empty/duplicate values.
  function addLabel() {
    const value = labelInput.trim()
    if (value && !labels.includes(value)) {
      setLabels([...labels, value])
    }
    setLabelInput('')
  }

  // Enter or comma commits the current text as a new label chip (like a
  // typical email "To:" field). Backspace on an empty input deletes the
  // most recently added chip, so the input behaves like a normal tag field.
  function handleLabelKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addLabel()
    } else if (event.key === 'Backspace' && !labelInput && labels.length > 0) {
      setLabels(labels.slice(0, -1))
    }
  }

  function removeLabel(label: string) {
    setLabels(labels.filter((l) => l !== label))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim() || submitting) return

    setSubmitting(true)
    await onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || null,
      labels,
      assignee_ids: assigneeIds,
    })
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-card border border-white/5 bg-surface p-6 shadow-card-hover">
        <h2 className="font-display text-lg font-bold text-ink">New Task</h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="font-body text-xs font-medium text-ink-muted">
              Title
            </label>
            <input
              id="title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-canvas px-3 py-2 font-body text-sm text-ink focus:border-accent focus:outline-none"
              placeholder="Write the launch checklist"
            />
          </div>

          <div>
            <label htmlFor="description" className="font-body text-xs font-medium text-ink-muted">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-canvas px-3 py-2 font-body text-sm text-ink focus:border-accent focus:outline-none"
              placeholder="Optional details"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="priority" className="font-body text-xs font-medium text-ink-muted">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-canvas px-3 py-2 font-body text-sm text-ink focus:border-accent focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="due_date" className="font-body text-xs font-medium text-ink-muted">
                Due date
              </label>
              <input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-canvas px-3 py-2 font-body text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="labels" className="font-body text-xs font-medium text-ink-muted">
              Labels
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-canvas px-2 py-1.5 focus-within:border-accent">
              {labels.map((label) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 font-mono text-[11px] font-bold ${getLabelColor(label)}`}
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="opacity-70 hover:opacity-100"
                    aria-label={`Remove ${label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="labels"
                value={labelInput}
                onChange={(event) => setLabelInput(event.target.value)}
                onKeyDown={handleLabelKeyDown}
                onBlur={addLabel} // also commit on blur, so clicking away doesn't silently drop text
                className="min-w-[6rem] flex-1 bg-transparent px-1 py-0.5 font-body text-sm text-ink focus:outline-none"
                placeholder={labels.length === 0 ? 'Type a label, press Enter' : ''}
              />
            </div>
          </div>

          {/* Only shown once at least one team member exists — no point offering an
              empty picker. If it's empty, users are expected to add a member first
              via the "+" button in the board header (see Team/TeamRoster.tsx). */}
          {teamMembers.length > 0 && (
            <div>
              <span className="font-body text-xs font-medium text-ink-muted">Assignees</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {teamMembers.map((member) => {
                  const selected = assigneeIds.includes(member.id)
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleAssignee(member.id)}
                      className={`flex items-center gap-1.5 rounded-pill border px-2 py-1 font-body text-xs transition-colors ${
                        selected
                          ? 'border-accent bg-accent/10 text-ink'
                          : 'border-white/10 text-ink-muted hover:border-white/20'
                      }`}
                    >
                      <Avatar name={member.name} color={member.color} />
                      {member.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || submitting}>
              {submitting ? 'Creating…' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
