import React, { type ReactNode } from 'react'

type SidebarSectionProps = {
  label?: string
  children: ReactNode
  className?: string
}

/** Section with optional uppercase label + 32px separation. */
export function SidebarSection({ label, children, className }: SidebarSectionProps) {
  return (
    <section className={`xe-sb-section${className ? ` ${className}` : ''}`}>
      {label ? <h2 className="xe-sb-section__label">{label}</h2> : null}
      <div className="xe-sb-section__body">{children}</div>
    </section>
  )
}
