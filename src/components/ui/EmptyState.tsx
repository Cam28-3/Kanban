interface EmptyStateProps {
  label?: string
}

export function EmptyState({ label = 'No tasks yet' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ink/10 px-4 py-8 text-center">
      <p className="font-body text-sm text-ink-faint">{label}</p>
    </div>
  )
}
