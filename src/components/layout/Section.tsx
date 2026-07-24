import * as React from 'react'

import { cn } from '@/lib/utils'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  surface?: boolean
}

export function Section({ className, surface = false, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'section-y relative',
        surface &&
          'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgba(109,94,249,0.08),transparent_70%)]',
        className,
      )}
      {...props}
    />
  )
}
