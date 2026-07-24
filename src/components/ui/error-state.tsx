import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  retryLabel = 'Try again',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-6 py-16 text-center',
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="mb-4 h-8 w-8 text-[var(--color-danger)]" strokeWidth={1.5} />
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-secondary">{description}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
