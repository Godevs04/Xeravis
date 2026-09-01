'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

type PreviewKind = 'announcement' | 'cookie'

function useString(path: string) {
  const { value } = useField<string | boolean>({ path })
  if (typeof value === 'boolean') return value ? 'on' : 'off'
  return typeof value === 'string' ? value : ''
}

function useBool(path: string) {
  const { value } = useField<boolean>({ path })
  return Boolean(value)
}

/** Live preview rail for Announcement Bar / Cookie Banner globals. */
export function MarketingPreviewAside({ kind }: { kind: PreviewKind }) {
  const enabled = useBool('enabled')
  const message = useString('message')
  const ctaLabel = useString(kind === 'announcement' ? 'ctaLabel' : 'acceptLabel')
  const link = useString(kind === 'announcement' ? 'ctaLink' : 'policyHref')

  return (
    <div className="xe-settings-aside">
      <section className="xe-settings-preview" aria-label="Live preview">
        <header className="xe-settings-preview__head">
          <h3>Preview</h3>
          <p>{kind === 'announcement' ? 'Site announcement bar' : 'Cookie consent banner'}</p>
        </header>

        {kind === 'announcement' ? (
          <div className={`xe-preview-announce${enabled ? 'is-on' : ''}`}>
            <span className="xe-preview-announce__msg">
              {message || 'Your announcement message appears here'}
            </span>
            {ctaLabel ? <span className="xe-preview-announce__cta">{ctaLabel}</span> : null}
          </div>
        ) : (
          <div className={`xe-preview-cookie${enabled ? 'is-on' : ''}`}>
            <p>{message || 'Cookie message appears here'}</p>
            <div className="xe-preview-cookie__actions">
              <span className="xe-preview-cookie__accept">{ctaLabel || 'Accept'}</span>
              <span className="xe-preview-cookie__policy">{link || '/privacy-policy'}</span>
            </div>
          </div>
        )}

        <p className="xe-settings-preview__status">
          Status:{' '}
          <strong className={enabled ? 'is-on' : 'is-off'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </strong>
        </p>
      </section>

      <section className="xe-settings-tips" aria-label="Tips">
        <h3>Tips</h3>
        <ul>
          {kind === 'announcement' ? (
            <>
              <li>Keep messages under 120 characters for mobile.</li>
              <li>Set an expiry so campaigns turn off automatically.</li>
              <li>Use a clear CTA when linking to a campaign page.</li>
            </>
          ) : (
            <>
              <li>Link Accept to your privacy policy path.</li>
              <li>Keep the message short and plain-language.</li>
              <li>Disable on staging if you are not testing consent.</li>
            </>
          )}
        </ul>
      </section>
    </div>
  )
}

export function AnnouncementPreviewAside() {
  return <MarketingPreviewAside kind="announcement" />
}

export function CookiePreviewAside() {
  return <MarketingPreviewAside kind="cookie" />
}

export default MarketingPreviewAside
