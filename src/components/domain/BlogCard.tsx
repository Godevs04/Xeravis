import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

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
    <Link
      href={href}
      className={cn(
        'group hover:border-accent/35 relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-hover)] sm:p-7',
        featured && 'sm:col-span-2 lg:min-h-[280px]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(109,94,249,0.14),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex flex-1 flex-col">
        <div className="mb-5 flex items-center justify-between gap-3">
          {dateLabel ? (
            <p className="text-muted text-xs font-medium tracking-wide">{dateLabel}</p>
          ) : (
            <span />
          )}
          <ArrowUpRight className="text-muted group-hover:text-accent h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3
          className={cn(
            'font-display text-primary font-semibold tracking-tight transition-colors group-hover:text-white',
            featured ? 'text-2xl sm:text-3xl' : 'text-xl',
          )}
        >
          {title}
        </h3>
        <p className="text-secondary mt-3 flex-1 text-sm leading-relaxed">{excerpt}</p>
        <span className="text-accent mt-6 text-sm font-semibold">Read article</span>
      </div>
    </Link>
  )
}
