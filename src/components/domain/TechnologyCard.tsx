import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type TechnologyCardProps = {
  name: string
  category?: string | null
  description?: string | null
  href?: string | null
  className?: string
}

export function TechnologyCard({ name, category, description, href, className }: TechnologyCardProps) {
  const content = (
    <>
      {category ? <Badge variant="outline">{category}</Badge> : null}
      <h3 className="mt-3 text-base font-semibold text-primary group-hover:text-accent">{name}</h3>
      {description ? <p className="mt-2 text-sm leading-relaxed text-secondary">{description}</p> : null}
    </>
  )

  const classes = cn(
    'group block rounded-[var(--radius-card)] border border-border bg-background p-5 transition-colors hover:border-accent/40 dark:bg-surface',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return <div className={classes}>{content}</div>
}
