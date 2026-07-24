import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  href?: string
  className?: string
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface/50 px-6 py-16 text-center',
        className,
      )}
      role="status"
    >
      <div className="mb-4 text-muted">{icon ?? <Inbox className="h-8 w-8" strokeWidth={1.5} />}</div>
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-secondary">{description}</p> : null}
      {actionLabel && (onAction || href) ? (
        <div className="mt-6">
          {href ? (
            <Button asChild variant="outline">
              <a href={href}>{actionLabel}</a>
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}
