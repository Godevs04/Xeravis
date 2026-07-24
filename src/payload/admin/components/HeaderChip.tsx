'use client'

import React from 'react'

export const HeaderChip = () => {
  return (
    <div className="xe-header-chip" aria-label="Workspace">
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: '#16a34a',
          boxShadow: '0 0 8px rgba(22,163,74,.7)',
        }}
      />
      <strong>Xelarvis</strong>
      <span>· Enterprise</span>
    </div>
  )
}

export default HeaderChip
