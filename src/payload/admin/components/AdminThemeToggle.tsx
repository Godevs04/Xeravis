'use client'

import React from 'react'

const STORAGE_KEY = 'payload-theme'

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export const AdminThemeToggle = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const next = stored === 'dark' || stored === 'light' ? stored : 'light'
    applyTheme(next)
    setTheme(next)
    setMounted(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue)
        setTheme(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="xe-action-btn xe-theme-toggle"
        aria-label="Toggle theme"
        disabled
      >
        Theme
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="xe-action-btn xe-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="xe-theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default AdminThemeToggle
