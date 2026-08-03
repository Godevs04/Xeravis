import React from 'react'

export const Logo = () => {
  return (
    <div className="xe-logo" aria-label="Xelarvis">
      <span className="xe-logo__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/xel-mark.png" alt="" width={28} height={28} />
      </span>
      <span className="xe-logo__text">
        <span className="xe-logo__title">Xelarvis</span>
        <span className="xe-logo__subtitle">Enterprise CMS</span>
      </span>
    </div>
  )
}

export default Logo
