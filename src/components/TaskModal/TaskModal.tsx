import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Button } from '../ui/Button'
import type { Priority } from '../../types/task'
import { getLabelColor } from '../../utils/labelColor'

interface TaskModalProps {
  onClose: () => void
  onCreate: (input: {
    title: string
    description?: string
    priority: Priority
    due_date: string | null
    labels: string[]
  }) => Promise<void>
}

export function TaskModal({ onClose, onCreate }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [labels, setLabels] = useState<string[]>([])
  const [labelInput, setLabelInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function addLabel() {
    const value = labelInput.trim()
    if (value && !labels.includes(value)) {
      setLabels([...labels, value])
    }
    setLabelInput('')
  }

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
                onBlur={addLabel}
                className="min-w-[6rem] flex-1 bg-transparent px-1 py-0.5 font-body text-sm text-ink focus:outline-none"
                placeholder={labels.length === 0 ? 'Type a label, press Enter' : ''}
              />
            </div>
          </div>

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
