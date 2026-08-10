import React from 'react'

type LoadingStateProps = {
  title?: React.ReactNode
  className?: string
}

export function LoadingState({ title = 'Loading…', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`xe-loading${className ? ` ${className}` : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="xe-loading__spinner" aria-hidden />
      <p className="xe-loading__title">{title}</p>
    </div>
  )
}

export default LoadingState
