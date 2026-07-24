import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-semibold tracking-tight text-primary text-balance', {
  variants: {
    level: {
      display: 'text-[length:var(--text-display-xl)] leading-[1.1]',
      h1: 'text-[length:var(--text-h1)] leading-[1.15]',
      h2: 'text-[length:var(--text-h2)] leading-[1.2]',
      h3: 'text-[length:var(--text-h3)] leading-[1.2]',
      h4: 'text-[length:var(--text-h4)] leading-[1.25]',
      h5: 'text-[length:var(--text-h5)] leading-[1.3]',
      h6: 'text-[length:var(--text-h6)] leading-[1.35]',
    },
  },
  defaultVariants: {
    level: 'h2',
  },
})

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag
}

export function Heading({ className, level, as, ...props }: HeadingProps) {
  const tagMap: Record<NonNullable<typeof level>, HeadingTag> = {
    display: 'h1',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
  }
  const Comp = as ?? tagMap[level ?? 'h2']
  return <Comp className={cn(headingVariants({ level }), className)} {...props} />
}

export { headingVariants }
