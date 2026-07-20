// Labels are free text the user types in (not a shared "labels" table), so
// there's no stored color to look up. Instead, every label gets a color
// deterministically derived from its own text: the same label string always
// produces the same color, without needing a database record for it.
const LABEL_PALETTE = [
  'bg-rose-400/15 text-rose-300',
  'bg-orange-400/15 text-orange-300',
  'bg-lime-400/15 text-lime-300',
  'bg-cyan-400/15 text-cyan-300',
  'bg-sky-400/15 text-sky-300',
  'bg-fuchsia-400/15 text-fuchsia-300',
]

// Pseudocode:
//   hash = djb2-style running hash of every character in the label
//   index = hash mod (number of colors in the palette)
//   return the Tailwind classes at that index
//
// This is a standard string hash (djb2 variant), not cryptographic — it
// just needs to spread different labels across the palette fairly evenly.
export function getLabelColor(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i)
    hash |= 0 // keep it a 32-bit int so it doesn't grow unbounded
  }
  const index = Math.abs(hash) % LABEL_PALETTE.length
  return LABEL_PALETTE[index]
}
