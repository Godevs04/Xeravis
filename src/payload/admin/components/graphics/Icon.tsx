import React from 'react'

export const Icon = () => {
  return (
    <div className="xe-logo xe-logo--icon" aria-label="Xelarvis">
      <span className="xe-logo__mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 17.5L12 4.5L19 17.5H5Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.2 14.2H14.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  )
}

export default Icon
