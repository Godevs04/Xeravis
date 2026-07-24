'use client'

import React from 'react'

export const NavSearchTrigger = () => {
  return (
    <div className="xe-search-trigger">
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('xe-open-command'))
        }}
        aria-label="Open command palette"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>Quick search…</span>
        <kbd>⌘K</kbd>
      </button>
    </div>
  )
}

export default NavSearchTrigger
