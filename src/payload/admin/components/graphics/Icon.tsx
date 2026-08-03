import React from 'react'

export const Icon = () => {
  return (
    <div className="xe-logo xe-logo--icon" aria-label="Xelarvis">
      <span className="xe-logo__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/xel-mark.png" alt="" width={14} height={14} />
      </span>
    </div>
  )
}

export default Icon
