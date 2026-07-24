import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

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
    <Link
      href={href}
      className={cn(
        'group hover:border-accent/35 relative block overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-8 shadow-[var(--shadow-medium)] backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-hover)] lg:p-10',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(109,94,249,0.16),transparent_55%)] opacity-70"
      />
      <div className="relative">
        <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">{client}</p>
        <h3 className="font-display text-primary mt-4 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-secondary mt-4 max-w-xl text-sm leading-relaxed">{outcome}</p>
        <span className="text-accent mt-10 inline-flex items-center gap-2 text-sm font-semibold">
          Read case study
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
