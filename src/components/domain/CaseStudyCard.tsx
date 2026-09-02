import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { cn } from '@/lib/utils'

type CaseStudyCardProps = {
  title: string
  client: string
  outcome: string
  href: string
  className?: string
}

export function CaseStudyCard({ title, client, outcome, href, className }: CaseStudyCardProps) {
  return (
    <Link href={href} className={cn('block h-full', className)}>
      <SpotlightCard className="flex h-full min-h-[280px] flex-col p-8 lg:p-10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">{client}</p>
          <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            Representative
          </span>
        </div>
        <h3 className="font-display text-primary mt-5 text-2xl font-semibold tracking-tight lg:text-3xl">
          {title}
        </h3>
        <p className="text-secondary mt-4 max-w-xl flex-1 text-sm leading-relaxed lg:text-base">
          {outcome}
        </p>
        <span className="text-accent mt-8 inline-flex items-center gap-2 text-sm font-semibold">
          Read case study
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </SpotlightCard>
    </Link>
  )
}
