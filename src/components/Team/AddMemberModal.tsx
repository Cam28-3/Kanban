// "Add Team Member" form: just a name and a color swatch picker (the
// swatch preview reuses the real Avatar component so what you pick is
// exactly what the member will look like everywhere else in the app).
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import type { AvatarColor } from '../../types/task'

// Every AvatarColor value, offered as clickable swatches.
const COLOR_OPTIONS: AvatarColor[] = [
  'rose',
  'orange',
  'amber',
  'lime',
  'emerald',
  'cyan',
  'sky',
  'violet',
  'fuchsia',
]

interface AddMemberModalProps {
  onClose: () => void
  onAdd: (name: string, color: AvatarColor) => Promise<void>
}

export function AddMemberModal({ onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<AvatarColor>('sky')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || submitting) return

    setSubmitting(true)
    await onAdd(name.trim(), color)
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-card border border-white/5 bg-surface p-6 shadow-card-hover">
        <h2 className="font-display text-lg font-bold text-ink">Add Team Member</h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="member-name" className="font-body text-xs font-medium text-ink-muted">
              Name
            </label>
            <input
              id="member-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-canvas px-3 py-2 font-body text-sm text-ink focus:border-accent focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="font-body text-xs font-medium text-ink-muted">Color (optional)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setColor(option)}
                  className={`rounded-full transition-all ${
                    color === option ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''
                  }`}
                  aria-label={option}
                >
                  <Avatar name={name || '?'} color={option} size="md" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || submitting}>
              {submitting ? 'Adding…' : 'Add Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
