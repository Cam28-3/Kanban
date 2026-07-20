// Small round avatar used everywhere a TeamMember is shown: the header
// TeamRoster, the assignee picker in TaskModal, and stacked on TaskCard.
// There are no uploaded profile pictures — it's just the member's initials
// on a solid color background.
import type { AvatarColor } from '../../types/task'

// Maps each semantic AvatarColor name (stored in the database) to an
// actual Tailwind background class.
const AVATAR_COLORS: Record<AvatarColor, string> = {
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  lime: 'bg-lime-500',
  emerald: 'bg-emerald-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  fuchsia: 'bg-fuchsia-500',
}

// "Jane Doe" -> "JD", "Cher" -> "C", "" -> "?"
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return initials || '?'
}

interface AvatarProps {
  name: string
  color: AvatarColor
  size?: 'sm' | 'md'
  // Adds a ring matching the card/panel background behind it, so avatars
  // stacked with negative margin (see TaskCard, TeamRoster) look visually
  // separated instead of overlapping into a blob.
  ringed?: boolean
}

export function Avatar({ name, color, size = 'sm', ringed = false }: AvatarProps) {
  const sizeClasses = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs'

  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white ${sizeClasses} ${AVATAR_COLORS[color]} ${ringed ? 'ring-2 ring-surface' : ''}`}
    >
      {getInitials(name)}
    </span>
  )
}
