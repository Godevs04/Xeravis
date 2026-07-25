'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { getLucideIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

type ServiceCardProps = {
  title: string
  summary: string
  href: string
  icon?: string | null
  className?: string
  metric?: string
  chips?: string[]
}

export function ServiceCard({
  title,
  summary,
  href,
  icon,
  className,
  metric = 'Enterprise-ready',
  chips = ['Cloud', 'Secure', 'Scale'],
}: ServiceCardProps) {
  const Icon = getLucideIcon(icon)

  return (
    <Link href={href} className={cn('block h-full', className)}>
      <SpotlightCard className="flex h-full min-h-[280px] flex-col p-6 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="text-accent grid h-12 w-12 place-items-center rounded-2xl border border-white/70 bg-white/75 shadow-[var(--shadow-light)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 dark:border-white/10 dark:bg-white/5">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="text-muted rounded-full border border-[color:var(--glass-border-soft)] bg-white/60 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase backdrop-blur-md dark:bg-white/5">
            {metric}
          </span>
        </div>

        <h3 className="font-display text-primary text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-secondary mt-3 flex-1 text-sm leading-relaxed">{summary}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[color:var(--glass-border-soft)] bg-white/50 px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--color-secondary)] dark:bg-white/5"
            >
              {chip}
            </span>
          ))}
        </div>

        <span className="text-accent mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-0.5">
          Explore
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </SpotlightCard>
    </Link>
  )
}
