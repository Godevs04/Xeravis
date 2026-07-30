'use client'

import React from 'react'

import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const NAV_KEY = 'xe-nav-collapsed'

function toggleNav() {
  const root = document.documentElement
  const next = root.getAttribute('data-xe-nav') === 'collapsed' ? 'expanded' : 'collapsed'
  root.setAttribute('data-xe-nav', next)
  window.localStorage.setItem(NAV_KEY, next === 'collapsed' ? '1' : '0')
}

/** Top of sidebar: collapse + workspace only */
export const BeforeNav = () => {
  return (
    <div className="xe-before-nav">
      <div className="xe-nav-collapse">
        <button
          type="button"
          className="xe-nav-collapse__btn"
          aria-label="Collapse sidebar"
          title="Collapse sidebar (⌘B)"
          onClick={toggleNav}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6h16M4 12h10M4 18h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <WorkspaceSwitcher />
    </div>
  )
}

export default BeforeNav
