// Reusable error message bar. Used two ways in Board.tsx:
//   - full-page, when the guest session itself fails to bootstrap
//   - inline/dismissible, when a task fetch or write fails
// `onRetry` and `onDismiss` are both optional so callers only show the
// buttons that make sense for their situation.
import { Button } from './Button'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-3">
      <p className="font-body text-sm text-danger">{message}</p>
      <div className="flex shrink-0 items-center gap-2">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} className="!py-1 !text-xs">
            Retry
          </Button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs font-medium text-danger/70 hover:text-danger"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}
