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

export function TechnologyCard({
  name,
  category,
  description,
  href,
  className,
}: TechnologyCardProps) {
  const content = (
    <>
      {category ? <Badge variant="outline">{category}</Badge> : null}
      <h3 className="text-primary group-hover:text-accent mt-3 text-base font-semibold">{name}</h3>
      {description ? (
        <p className="text-secondary mt-2 text-sm leading-relaxed">{description}</p>
      ) : null}
    </>
  )

  const classes = cn(
    'group block rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-medium)]',
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
