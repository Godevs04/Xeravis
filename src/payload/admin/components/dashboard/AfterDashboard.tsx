import React from 'react'

/** Quiet footer — no competing card block */
export const AfterDashboard = () => {
  return (
    <div className="xe-shortcuts-panel">
      <div className="xe-shortcuts-panel__row">
        <span>
          <kbd className="xe-kbd">⌘K</kbd> Search
        </span>
        <span>
          <kbd className="xe-kbd">⌘S</kbd> Save
        </span>
      </div>
    </div>
  )
}

export default AfterDashboard
