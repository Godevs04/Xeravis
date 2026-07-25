import React from 'react'

export const AfterDashboard = () => {
  return (
    <div className="xe-shortcuts-panel">
      <strong className="xe-shortcuts-panel__title">Keyboard shortcuts</strong>
      <div className="xe-shortcuts-panel__row">
        <span>
          <kbd className="xe-kbd">⌘K</kbd> Command palette
        </span>
        <span>
          <kbd className="xe-kbd">⌘S</kbd> Save document
        </span>
        <span>
          <kbd className="xe-kbd">⌘N</kbd> New in collection
        </span>
      </div>
    </div>
  )
}

export default AfterDashboard
