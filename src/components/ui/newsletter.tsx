import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/utils'

type NewsletterProps = {
  title?: string
  description?: string
  className?: string
}

export function Newsletter({
  title = 'Stay informed',
  description = 'Product updates, engineering notes, and enterprise insights — no spam.',
  className,
}: NewsletterProps) {
  return (
    <div className={cn('rounded-[var(--radius-card)] border border-border bg-surface p-8 md:p-10', className)}>
      <Heading level="h3">{title}</Heading>
      {description ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary">{description}</p> : null}
      <div className="mt-6">
        <NewsletterForm />
      </div>
    </div>
  )
}
