'use client'

import React from 'react'

export const WorkspaceSwitcher = () => {
  const env = process.env.NODE_ENV === 'production' ? 'Production' : 'Development'

  return (
    <div className="xe-workspace">
      <div className="xe-workspace__label">Workspace</div>
      <button type="button" className="xe-workspace__btn" aria-label="Workspace switcher">
        <span className="xe-workspace__avatar">XV</span>
        <span className="xe-workspace__meta">
          <span className="xe-workspace__name">Xelarvis Technologies</span>
          <span className="xe-workspace__env">{env}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default WorkspaceSwitcher
