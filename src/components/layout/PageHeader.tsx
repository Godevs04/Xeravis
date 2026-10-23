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
    <header className={cn('border-border bg-surface/60 border-b pt-24 lg:pt-28', className)}>
      <Container className="pt-8 pb-12 md:pb-16">
        {breadcrumbs?.length ? <Breadcrumb items={breadcrumbs} className="mb-6" /> : null}
        {eyebrow ? (
          <p className="text-muted mb-3 text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Heading level="h1">{title}</Heading>
            {description ? (
              <p className="text-secondary mt-4 text-base leading-relaxed md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </Container>
    </header>
  )
}
