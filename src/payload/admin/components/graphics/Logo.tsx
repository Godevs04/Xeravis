import React from 'react'

const Mark = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 17.5L12 4.5L19 17.5H5Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.2 14.2H14.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const Logo = () => {
  return (
    <div className="xe-logo" aria-label="Xelarvis">
      <span className="xe-logo__mark">
        <Mark />
      </span>
      <span className="xe-logo__text">
        <span className="xe-logo__title">Xelarvis</span>
        <span className="xe-logo__subtitle">Enterprise CMS</span>
      </span>
    </div>
  )
}

export default Logo
