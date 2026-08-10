import React from 'react'

type PageHeaderProps = {
  title: React.ReactNode
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`xe-page__header${className ? ` ${className}` : ''}`}>
      <div className="xe-page__header-copy">
        {eyebrow ? <div className="xe-page__eyebrow">{eyebrow}</div> : null}
        <h1 className="xe-page__title">{title}</h1>
        {description ? <p className="xe-page__desc">{description}</p> : null}
      </div>
      {actions ? <div className="xe-page__actions">{actions}</div> : null}
    </header>
  )
}

export default PageHeader
