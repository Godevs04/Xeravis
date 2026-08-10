import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
  className?: string
  flush?: boolean
}

export function PageContainer({ children, className = '', flush = false }: PageContainerProps) {
  return (
    <div className={`xe-page${flush ? 'is-flush' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

export default PageContainer
