// Loading placeholder shown inside a Column while the guest session is
// bootstrapping and the initial task fetch is in flight. Three fading
// pulsing bars stand in for "some cards are about to appear here".
// aria-hidden because it's purely decorative — screen readers shouldn't
// announce it as content.
export function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-card border border-ink/5 bg-surface"
          style={{ opacity: 1 - i * 0.2 }}
        />
      ))}
    </div>
  )
}
