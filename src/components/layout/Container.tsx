import * as React from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = React.HTMLAttributes<HTMLDivElement>

export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('container-x', className)} {...props} />
}
