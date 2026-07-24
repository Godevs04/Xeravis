import * as React from 'react'

import { cn } from '@/lib/utils'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  surface?: boolean
}

export function Section({ className, surface = false, ...props }: SectionProps) {
  return (
    <section className={cn('section-y', surface && 'bg-surface', className)} {...props} />
  )
}
