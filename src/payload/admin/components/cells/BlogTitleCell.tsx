'use client'

import type { DefaultCellComponentProps } from 'payload'
import Link from 'next/link'
import React from 'react'

type CoverDoc = { url?: string | null; alt?: string | null } | string | null | undefined

/** Title cell with optional cover thumbnail for blogs list. */
export function BlogTitleCell(props: DefaultCellComponentProps) {
  const { cellData, rowData, collectionSlug } = props
  const title = typeof cellData === 'string' ? cellData : String(cellData ?? '')
  const id = rowData?.id
  const cover = rowData?.cover as CoverDoc
  const url = cover && typeof cover === 'object' && typeof cover.url === 'string' ? cover.url : null
  const href = collectionSlug && id ? `/admin/collections/${collectionSlug}/${id}` : undefined

  const inner = (
    <span className="xe-cell-title">
      <span className="xe-cell-title__thumb" aria-hidden>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" width={40} height={40} />
        ) : (
          <span className="xe-cell-title__placeholder">
            {title.slice(0, 1).toUpperCase() || 'B'}
          </span>
        )}
      </span>
      <span className="xe-cell-title__text">{title || 'Untitled'}</span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} scroll={false} className="xe-cell-title__link">
      {inner}
    </Link>
  )
}

export default BlogTitleCell
