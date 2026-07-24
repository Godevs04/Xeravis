import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

export type TimelineItem = {
  title: string
  description?: string | null
  date?: string | null
}

type TimelineProps = {
  items: TimelineItem[]
  className?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function Timeline({
  items,
  className,
  emptyTitle = 'No milestones yet',
  emptyDescription = 'Timeline entries will appear here when published in the CMS.',
}: TimelineProps) {
  if (!items.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className={className} />
  }

  return (
    <ol
      className={cn('border-border relative space-y-0 border-l', className)}
      aria-label="Timeline"
    >
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative pb-10 pl-8 last:pb-0">
          <span
            className="border-accent bg-background absolute top-1.5 -left-1.5 h-3 w-3 rounded-full border-2"
            aria-hidden
          />
          {item.date ? (
            <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
              {item.date}
            </p>
          ) : null}
          <h3 className={cn('text-primary text-base font-semibold', item.date && 'mt-1')}>
            {item.title}
          </h3>
          {item.description ? (
            <p className="text-secondary mt-2 max-w-2xl text-sm leading-relaxed">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
