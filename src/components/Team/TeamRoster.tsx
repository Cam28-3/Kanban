// Compact "who's on this board" widget shown in the header: a stack of
// existing member avatars plus a "+" button. Clicking "+" doesn't add a
// member itself — it just asks the parent (Board.tsx) to open
// AddMemberModal, which does the actual creation.
import type { TeamMember } from '../../types/task'
import { Avatar } from '../ui/Avatar'

interface TeamRosterProps {
  members: TeamMember[]
  onAddClick: () => void
}

export function TeamRoster({ members, onAddClick }: TeamRosterProps) {
  return (
    <div className="flex items-center gap-2 rounded-card border border-white/5 bg-surface px-3 py-2 shadow-card">
      {members.length > 0 && (
        <div className="flex -space-x-2">
          {members.map((member) => (
            <Avatar key={member.id} name={member.name} color={member.color} ringed />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onAddClick}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 font-body text-xs text-ink-faint transition-colors hover:border-accent hover:text-accent"
        aria-label="Add team member"
      >
        +
      </button>
    </div>
  )
}
