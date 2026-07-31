import Link from 'next/link'
import { ArrowUpRight, Briefcase, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

type JobCardProps = {
  title: string
  department: string
  location: string
  type: string
  href: string
  experienceRequired?: string | null
  workMode?: string | null
  openings?: number | null
  className?: string
}

export function JobCard({
  title,
  department,
  location,
  type,
  href,
  experienceRequired,
  workMode,
  openings,
  className,
}: JobCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col gap-4 overflow-hidden rounded-[22px] border border-[color:var(--glass-border)]',
        'bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-light)] backdrop-blur-xl',
        'transition-[transform,border-color,box-shadow,background] duration-300',
        'hover:-translate-y-1 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--glass-bg-strong)] hover:shadow-[var(--shadow-hover)]',
        'sm:flex-row sm:items-center sm:justify-between sm:p-7',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(13,148,136,0.28), transparent 70%)',
        }}
      />

      <div className="relative min-w-0">
        <p className="text-[11px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
          {department}
        </p>
        <h3 className="font-display mt-2 text-xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          {title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[color:var(--color-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[color:var(--color-accent)]" />
            {location}
          </span>
          <span className="capitalize">{type.replace('-', ' ')}</span>
          {workMode ? <span className="capitalize">{workMode}</span> : null}
          {experienceRequired ? (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[color:var(--color-accent)]" />
              {experienceRequired}
            </span>
          ) : null}
          {openings ? (
            <span className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--color-hover)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-primary)]">
              {openings} opening{openings > 1 ? 's' : ''}
            </span>
          ) : null}
        </div>
      </div>

      <span className="relative inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)]">
        View Details
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
