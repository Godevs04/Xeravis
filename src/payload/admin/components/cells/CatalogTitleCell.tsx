'use client'

import type { DefaultCellComponentProps } from 'payload'
import Link from 'next/link'
import React from 'react'

import { saveMainScroll } from '@/payload/admin/components/layout/mainScroll'
import { saveSidebarScroll } from '@/payload/admin/components/nav/sidebar/sidebarScroll'

function subtitleFromRow(row: Record<string, unknown> | undefined): string {
  if (!row) return ''
  if (typeof row.slug === 'string' && row.slug) return `/${row.slug}`
  if (typeof row.role === 'string' && row.role) return row.role
  if (typeof row.company === 'string' && row.company) return row.company
  if (typeof row.group === 'string' && row.group) return row.group
  if (typeof row.authorRole === 'string' && row.authorRole) return row.authorRole
  return ''
}

/**
 * Shared Insights/catalog title cell — primary label + optional subtitle.
 * Works for title, name, question, authorName fields.
 */
export function CatalogTitleCell(props: DefaultCellComponentProps) {
  const { cellData, rowData, collectionSlug } = props
  const title = typeof cellData === 'string' ? cellData : String(cellData ?? '')
  const subtitle = subtitleFromRow(rowData as Record<string, unknown> | undefined)
  const id = rowData?.id
  const href = collectionSlug && id ? `/admin/collections/${collectionSlug}/${id}` : undefined

  const cover = rowData?.cover as { url?: string } | string | null | undefined
  const logo = rowData?.logo as { url?: string } | string | null | undefined
  const photo = rowData?.photo as { url?: string } | string | null | undefined
  const avatar = rowData?.avatar as { url?: string } | string | null | undefined
  const media =
    (cover && typeof cover === 'object' && cover.url) ||
    (logo && typeof logo === 'object' && logo.url) ||
    (photo && typeof photo === 'object' && photo.url) ||
    (avatar && typeof avatar === 'object' && avatar.url) ||
    null

  const inner = (
    <span className="xe-cell-catalog">
      <span className="xe-cell-catalog__mark" aria-hidden>
        {media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media} alt="" width={36} height={36} />
        ) : (
          title.slice(0, 1).toUpperCase() || '·'
        )}
      </span>
      <span className="xe-cell-catalog__copy">
        <span className="xe-cell-catalog__title">{title || 'Untitled'}</span>
        {subtitle ? <span className="xe-cell-catalog__slug">{subtitle}</span> : null}
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link
      href={href}
      scroll={false}
      className="xe-cell-catalog__link"
      onClick={() => {
        saveSidebarScroll()
        saveMainScroll()
      }}
    >
      {inner}
    </Link>
  )
}

export default CatalogTitleCell
