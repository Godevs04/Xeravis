'use client'

import React, { useEffect, useState } from 'react'

/** Breadcrumb from URL — quiet on the home dashboard */
export const HeaderChip = () => {
  const [crumb, setCrumb] = useState('')

  useEffect(() => {
    const update = () => {
      const path = window.location.pathname.replace(/^\/admin\/?/, '')
      if (!path || path === '/') {
        setCrumb('')
        return
      }
      const parts = path.split('/').filter(Boolean)
      const pretty = parts
        .map((p) => p.replace(/-/g, ' '))
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' / ')
      setCrumb(pretty)
    }
    update()
    const id = window.setInterval(update, 800)
    return () => window.clearInterval(id)
  }, [])

  if (!crumb) return null

  return (
    <div className="xe-header-chip xe-header-chip--breadcrumb" title={crumb}>
      <span className="xe-header-chip__dot" aria-hidden />
      <strong>{crumb}</strong>
    </div>
  )
}

export default HeaderChip
