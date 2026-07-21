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
        'group block border-b border-border py-8 transition-colors hover:border-accent/30 lg:py-10',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-4">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <div>
            <h3 className="text-xl font-semibold text-primary transition-colors group-hover:text-accent">{title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary">{summary}</p>
          </div>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
    </Link>
  )
}
