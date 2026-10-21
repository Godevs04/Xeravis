'use client'

import { Search } from 'lucide-react'
import React from 'react'

export const CommandAction = () => {
  return (
    <button
      type="button"
      className="xe-action-btn"
      onClick={() => window.dispatchEvent(new CustomEvent('xe-open-command'))}
      aria-label="Open command palette"
    >
      <Search size={15} aria-hidden />
      <span className="xe-action-btn__label">Search</span>
      <kbd>⌘K</kbd>
    </button>
  )
}

export default CommandAction
