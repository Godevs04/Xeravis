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
        'group flex flex-col gap-4 border-b border-border py-8 transition-colors hover:border-accent/30 lg:flex-row lg:items-center lg:justify-between lg:py-10',
        className,
      )}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{department}</p>
        <h3 className="mt-2 text-xl font-semibold text-primary transition-colors group-hover:text-accent">{title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          <span className="capitalize">{type.replace('-', ' ')}</span>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
    </Link>
  )
}
