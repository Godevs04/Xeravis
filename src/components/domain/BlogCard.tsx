import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type BlogCardProps = {
  title: string
  excerpt: string
  href: string
  publishedAt?: string | null
  className?: string
}

export function BlogCard({ title, excerpt, href, publishedAt, className }: BlogCardProps) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <Link href={href} className={cn('group block py-8 lg:py-10', className)}>
      <div className="flex items-start justify-between gap-6 border-b border-border pb-8 transition-colors group-hover:border-accent/30 lg:pb-10">
        <div className="space-y-3">
          {dateLabel && <p className="text-xs font-medium uppercase tracking-wide text-muted">{dateLabel}</p>}
          <h3 className="text-xl font-semibold text-primary transition-colors group-hover:text-accent">{title}</h3>
          <p className="max-w-2xl text-sm leading-relaxed text-secondary">{excerpt}</p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
    </Link>
  )
}
