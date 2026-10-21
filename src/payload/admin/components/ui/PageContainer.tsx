import { clsx } from 'clsx'
import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
  className?: string
  flush?: boolean
}

export function PageContainer({ children, className = '', flush = false }: PageContainerProps) {
  return <div className={clsx('xe-page', flush && 'is-flush', className)}>{children}</div>
}

export default PageContainer
