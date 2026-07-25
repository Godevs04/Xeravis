import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { cn } from '@/lib/utils'

type IndustryCardProps = {
  title: string
  summary: string
  href: string
  className?: string
}

export function IndustryCard({ title, summary, href, className }: IndustryCardProps) {
  return (
    <Link href={href} className={cn('block h-full', className)}>
      <SpotlightCard className="flex h-full min-h-[220px] flex-col justify-between p-7 lg:p-8">
        <div>
          <h3 className="font-display text-primary text-xl font-semibold tracking-tight transition-colors group-hover:text-[color:var(--color-accent)]">
            {title}
          </h3>
          <p className="text-secondary mt-4 text-sm leading-relaxed">{summary}</p>
        </div>
        <span className="text-accent mt-8 inline-flex items-center gap-2 text-sm font-semibold">
          Explore industry
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </SpotlightCard>
    </Link>
  )
}
