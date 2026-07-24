'use client'

import React from 'react'

import { CommandPalette } from './CommandPalette'

const STORAGE_KEY = 'payload-theme'

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const root = document.documentElement
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const theme = stored === 'dark' || stored === 'light' ? stored : 'light'
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme
    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, 'light')
    }

    const onSave = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        const saveBtn =
          document.querySelector<HTMLButtonElement>('button[type="submit"].form-submit') ||
          document.querySelector<HTMLButtonElement>(
            '.doc-controls__controls .btn--style-primary',
          ) ||
          document.querySelector<HTMLButtonElement>('button.form-submit')
        if (saveBtn && !saveBtn.disabled) {
          e.preventDefault()
          saveBtn.click()
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        const path = window.location.pathname
        const match = path.match(/\/admin\/collections\/([^/]+)/)
        if (match?.[1] && !path.endsWith('/create')) {
          e.preventDefault()
          window.location.href = `/admin/collections/${match[1]}/create`
        }
      }
    }

    const storedDensity = window.localStorage.getItem('xe-list-density')
    if (storedDensity === 'compact' || storedDensity === 'comfortable') {
      root.setAttribute('data-xe-list', storedDensity)
    } else {
      root.setAttribute('data-xe-list', 'comfortable')
    }

    window.addEventListener('keydown', onSave)
    return () => window.removeEventListener('keydown', onSave)
  }, [])

  return (
    <>
      {children}
      <CommandPalette />
    </>
  )
}

export default AdminProvider
