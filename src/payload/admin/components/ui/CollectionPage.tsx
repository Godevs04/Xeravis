import React from 'react'

/** CSS-class contract for Payload collection list pages (styled via collection-list-os.scss). */
export function CollectionPageShell({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`xe-collection-page${className ? ` ${className}` : ''}`}>{children}</div>
}

export function CollectionHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="xe-collection-header">
      <div className="xe-collection-header__copy">
        <h1 className="xe-collection-header__title">{title}</h1>
        {description ? <p className="xe-collection-header__desc">{description}</p> : null}
      </div>
      {actions ? <div className="xe-collection-header__actions">{actions}</div> : null}
    </header>
  )
}

export function CollectionToolbar({ children }: { children: React.ReactNode }) {
  return <div className="xe-collection-toolbar">{children}</div>
}

export function PrimaryButton({
  children,
  href,
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}) {
  const cls = `xe-primary-btn${className ? ` ${className}` : ''}`
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}

export function CollectionEmptyState({
  title = 'No results yet',
  description = 'Create your first item to get started.',
  action,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="xe-collection-empty">
      <div className="xe-collection-empty__icon" aria-hidden>
        ◇
      </div>
      <h3 className="xe-collection-empty__title">{title}</h3>
      <p className="xe-collection-empty__desc">{description}</p>
      {action ? <div className="xe-collection-empty__actions">{action}</div> : null}
    </div>
  )
}
