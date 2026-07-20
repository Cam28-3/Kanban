const LABEL_PALETTE = [
  'bg-rose-400/15 text-rose-300',
  'bg-orange-400/15 text-orange-300',
  'bg-lime-400/15 text-lime-300',
  'bg-cyan-400/15 text-cyan-300',
  'bg-sky-400/15 text-sky-300',
  'bg-fuchsia-400/15 text-fuchsia-300',
]

export function getLabelColor(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % LABEL_PALETTE.length
  return LABEL_PALETTE[index]
}
