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
        'group flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#0D9488]/35 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] sm:flex-row sm:items-center sm:justify-between sm:p-7',
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
          {department}
        </p>
        <h3 className="font-display mt-2 text-xl font-semibold tracking-tight text-[#0F172A]">
          {title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          <span className="capitalize">{type.replace('-', ' ')}</span>
          {workMode ? <span className="capitalize">{workMode}</span> : null}
          {experienceRequired ? (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {experienceRequired}
            </span>
          ) : null}
          {openings ? (
            <span>
              {openings} opening{openings > 1 ? 's' : ''}
            </span>
          ) : null}
        </div>
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488]">
        View Details
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
