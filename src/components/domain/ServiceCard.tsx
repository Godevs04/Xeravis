import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { getLucideIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

type ServiceCardProps = {
  title: string
  summary: string
  href: string
  icon?: string | null
  className?: string
}

export function ServiceCard({ title, summary, href, icon, className }: ServiceCardProps) {
  const Icon = getLucideIcon(icon)

  return (
    <Link
      href={href}
      className={cn(
        'group hover:border-accent/35 relative block overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-hover)] sm:p-7',
        className,
      )}
    >
      <div
        aria-hidden
        className="bg-accent/0 group-hover:bg-accent/25 pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full blur-3xl transition-colors duration-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--mx, 50%) var(--my, 20%), rgba(109,94,249,0.12), transparent 40%)',
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="text-accent grid h-12 w-12 place-items-center rounded-2xl border border-white/70 bg-white/70 shadow-[var(--shadow-light)] transition-transform duration-300 group-hover:scale-105 dark:border-white/10 dark:bg-white/5">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <ArrowUpRight className="text-muted group-hover:text-accent h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="font-display text-primary text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-secondary mt-3 flex-1 text-sm leading-relaxed">{summary}</p>
        <span className="text-accent mt-6 inline-flex items-center gap-1.5 text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Learn more
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
