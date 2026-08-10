import React from 'react'

type SectionProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function Section({ title, description, children, className = '', actions }: SectionProps) {
  return (
    <section className={`xe-section${className ? ` ${className}` : ''}`}>
      {(title || description || actions) && (
        <div className="xe-page__header" style={{ marginBottom: 0 }}>
          <div className="xe-page__header-copy">
            {title ? <h2 className="xe-section__title">{title}</h2> : null}
            {description ? <p className="xe-section__desc">{description}</p> : null}
          </div>
          {actions ? <div className="xe-page__actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}

export default Section
