import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { cn } from '@/lib/utils'

type BlogCardProps = {
  title: string
  excerpt: string
  href: string
  publishedAt?: string | null
  className?: string
  featured?: boolean
}

export function BlogCard({
  title,
  excerpt,
  href,
  publishedAt,
  className,
  featured = false,
}: BlogCardProps) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <Link href={href} className={cn('block h-full', featured && 'sm:col-span-2', className)}>
      <SpotlightCard
        className={cn('flex h-full flex-col p-6 sm:p-7', featured && 'lg:min-h-[300px] lg:p-9')}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          {dateLabel ? (
            <p className="text-muted text-xs font-medium tracking-wide">{dateLabel}</p>
          ) : (
            <span className="text-accent text-[10px] font-bold tracking-[0.16em] uppercase">
              Insight
            </span>
          )}
          <ArrowUpRight className="text-muted group-hover:text-accent h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3
          className={cn(
            'font-display text-primary font-semibold tracking-tight',
            featured ? 'text-2xl sm:text-3xl' : 'text-xl',
          )}
        >
          {title}
        </h3>
        <p className="text-secondary mt-3 flex-1 text-sm leading-relaxed">{excerpt}</p>
        <span className="text-accent mt-6 text-sm font-semibold">Read article</span>
      </SpotlightCard>
    </Link>
  )
}
