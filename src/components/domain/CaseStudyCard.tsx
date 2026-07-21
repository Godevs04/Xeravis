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
        'group block border border-border p-8 transition-colors hover:border-accent/40 lg:p-10',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{client}</p>
      <h3 className="mt-3 text-xl font-semibold text-primary transition-colors group-hover:text-accent">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-secondary">{outcome}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Read case study
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
