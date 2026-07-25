import type { ReactNode } from 'react'

import { AnimateIn } from '@/components/motion/AnimateIn'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string | null
  align?: 'left' | 'center'
  className?: string
  action?: ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        centered && 'items-center text-center lg:flex-col lg:items-center',
        className,
      )}
    >
      <AnimateIn className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow ? (
          <p className="text-accent mb-3 text-[11px] font-bold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-[-0.04em] text-balance">
          {title}
        </h2>
        {description ? (
          <p className="text-secondary mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
            {description}
          </p>
        ) : null}
      </AnimateIn>
      {action ? <AnimateIn delay={0.08}>{action}</AnimateIn> : null}
    </div>
  )
}
