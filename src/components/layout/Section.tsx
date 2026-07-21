import * as React from 'react'

import { cn } from '@/lib/utils'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  surface?: boolean
}

export function Section({ className, surface = false, ...props }: SectionProps) {
  return (
    <section
      className={cn('py-20 lg:py-28', surface && 'bg-surface', className)}
      {...props}
    />
  )
}
