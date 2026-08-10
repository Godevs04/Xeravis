import React from 'react'

type StatCardProps = {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, hint, className = '' }: StatCardProps) {
  return (
    <div className={`xe-card xe-stat${className ? ` ${className}` : ''}`}>
      <div className="xe-stat__label">{label}</div>
      <div className="xe-stat__value">{value}</div>
      {hint ? <div className="xe-stat__hint">{hint}</div> : null}
    </div>
  )
}

export default StatCard
