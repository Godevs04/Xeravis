'use client'

import type { DefaultCellComponentProps } from 'payload'
import Link from 'next/link'
import React from 'react'

/**
 * Shared catalog title cell — title + slug subtitle.
 * Used by Website list pages (Pages, Services, Solutions, Industries, Technologies).
 */
export function CatalogTitleCell(props: DefaultCellComponentProps) {
  const { cellData, rowData, collectionSlug } = props
  const title = typeof cellData === 'string' ? cellData : String(cellData ?? '')
  const slug = typeof rowData?.slug === 'string' ? rowData.slug : ''
  const id = rowData?.id
  const href = collectionSlug && id ? `/admin/collections/${collectionSlug}/${id}` : undefined

  const inner = (
    <span className="xe-cell-catalog">
      <span className="xe-cell-catalog__mark" aria-hidden>
        {title.slice(0, 1).toUpperCase() || '·'}
      </span>
      <span className="xe-cell-catalog__copy">
        <span className="xe-cell-catalog__title">{title || 'Untitled'}</span>
        {slug ? <span className="xe-cell-catalog__slug">/{slug}</span> : null}
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} scroll={false} className="xe-cell-catalog__link">
      {inner}
    </Link>
  )
}

export default CatalogTitleCell
