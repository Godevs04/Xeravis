import React from 'react'

export const AfterDashboard = () => {
  return (
    <div
      style={{
        marginTop: 8,
        padding: '18px 20px',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,.08)',
        background: 'linear-gradient(180deg, rgba(37,99,235,.08), transparent)',
        color: '#a1a1aa',
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <strong style={{ color: '#fafafa', fontWeight: 650 }}>Keyboard shortcuts</strong>
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <span>
          <kbd
            style={{
              padding: '2px 6px',
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,.1)',
              background: '#18181b',
            }}
          >
            ⌘K
          </kbd>{' '}
          Command palette
        </span>
        <span>
          <kbd
            style={{
              padding: '2px 6px',
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,.1)',
              background: '#18181b',
            }}
          >
            ⌘S
          </kbd>{' '}
          Save document
        </span>
        <span>
          <kbd
            style={{
              padding: '2px 6px',
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,.1)',
              background: '#18181b',
            }}
          >
            ⌘N
          </kbd>{' '}
          New in collection
        </span>
      </div>
    </div>
  )
}

export default AfterDashboard
