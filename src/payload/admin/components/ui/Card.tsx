import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
  title?: React.ReactNode
  /** When false, disables hover lift */
  interactive?: boolean
  as?: 'div' | 'section' | 'article'
}

export function Card({
  children,
  className = '',
  title,
  interactive = true,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag className={`xe-card${interactive ? '' : 'is-static'}${className ? ` ${className}` : ''}`}>
      {title ? <h3 className="xe-card__title">{title}</h3> : null}
      {children}
    </Tag>
  )
}

export default Card
