import React from 'react'

type EmptyStateProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`xe-empty${className ? ` ${className}` : ''}`}>
      <h3 className="xe-empty__title">{title}</h3>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  )
}

export default EmptyState
