import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

type JobCardProps = {
  title: string
  department: string
  location: string
  type: string
  href: string
  className?: string
}

export function JobCard({ title, department, location, type, href, className }: JobCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group hover:border-accent/35 flex flex-col gap-4 rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] sm:flex-row sm:items-center sm:justify-between sm:p-7',
        className,
      )}
    >
      <div>
        <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">{department}</p>
        <h3 className="font-display text-primary mt-2 text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <div className="text-secondary mt-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          <span className="capitalize">{type.replace('-', ' ')}</span>
        </div>
      </div>
      <span className="text-accent inline-flex items-center gap-2 text-sm font-semibold">
        View role
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
