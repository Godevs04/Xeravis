import type { HTMLAttributes } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type SectionWrapperProps = HTMLAttributes<HTMLElement> & {
  contained?: boolean
  padY?: boolean
  surface?: boolean
}

export function SectionWrapper({
  className,
  children,
  contained = true,
  padY = true,
  surface = false,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      className={cn(padY && 'section-y', surface && 'bg-surface', className)}
      {...props}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}
