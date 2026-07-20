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
