'use client'

import type { DefaultCellComponentProps } from 'payload'
import Link from 'next/link'
import React from 'react'

/** Client logo + name cell for Insights Clients list. */
export function ClientLogoCell(props: DefaultCellComponentProps) {
  const { cellData, rowData, collectionSlug } = props
  const name = typeof cellData === 'string' ? cellData : String(cellData ?? '')
  const logo = rowData?.logo as { url?: string } | string | null | undefined
  const url = logo && typeof logo === 'object' && typeof logo.url === 'string' ? logo.url : null
  const id = rowData?.id
  const href = collectionSlug && id ? `/admin/collections/${collectionSlug}/${id}` : undefined

  const inner = (
    <span className="xe-cell-client">
      <span className="xe-cell-client__logo" aria-hidden>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" width={48} height={32} />
        ) : (
          <span>{name.slice(0, 1).toUpperCase() || 'C'}</span>
        )}
      </span>
      <span className="xe-cell-client__name">{name || 'Untitled'}</span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} scroll={false} className="xe-cell-client__link">
      {inner}
    </Link>
  )
}

export default ClientLogoCell
