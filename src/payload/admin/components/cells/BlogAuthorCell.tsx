'use client'

import type { DefaultCellComponentProps } from 'payload'
import React from 'react'

/** Author relationship cell — shows name or email. */
export function BlogAuthorCell(props: DefaultCellComponentProps) {
  const { cellData } = props
  let label = '—'
  if (cellData && typeof cellData === 'object') {
    const rec = cellData as { name?: string; email?: string }
    label = rec.name || rec.email || '—'
  } else if (typeof cellData === 'string' && cellData) {
    label = cellData
  }
  return <span className="xe-cell-author">{label}</span>
}

export default BlogAuthorCell
