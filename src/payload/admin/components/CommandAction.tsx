'use client'

import React from 'react'

export const CommandAction = () => {
  return (
    <button
      type="button"
      className="xe-action-btn"
      onClick={() => window.dispatchEvent(new CustomEvent('xe-open-command'))}
      aria-label="Open command palette"
    >
      Search
      <kbd>⌘K</kbd>
    </button>
  )
}

export default CommandAction
