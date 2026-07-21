import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

type IndustryCardProps = {
  title: string
  summary: string
  href: string
  className?: string
}

export function IndustryCard({ title, summary, href, className }: IndustryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col justify-between border border-border bg-background p-8 transition-colors hover:border-accent/40 lg:p-10',
        className,
      )}
    >
      <div>
        <h3 className="text-xl font-semibold text-primary transition-colors group-hover:text-accent">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-secondary">{summary}</p>
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Explore industry
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}
