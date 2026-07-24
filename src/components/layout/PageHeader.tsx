import type { ReactNode } from 'react'

import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/layout/Container'
import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types'

type PageHeaderProps = {
  title: string
  description?: string | null
  eyebrow?: string | null
  breadcrumbs?: BreadcrumbItem[]
  className?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <header className={cn('border-b border-border bg-surface/60 pt-24 lg:pt-28', className)}>
      <Container className="pb-12 pt-8 md:pb-16">
        {breadcrumbs?.length ? <Breadcrumb items={breadcrumbs} className="mb-6" /> : null}
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
        ) : null}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Heading level="h1">{title}</Heading>
            {description ? (
              <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </Container>
    </header>
  )
}
