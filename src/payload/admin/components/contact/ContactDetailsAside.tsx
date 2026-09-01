'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

function FieldValue({ path, fallback = '—' }: { path: string; fallback?: string }) {
  const { value } = useField<string>({ path })
  const text = typeof value === 'string' && value.trim() ? value.trim() : fallback
  return <>{text}</>
}

/** Live contact preview + tips — sidebar rail for Contact Details global. */
export function ContactDetailsAside() {
  return (
    <div className="xe-contact-aside">
      <section className="xe-contact-preview" aria-label="Contact preview">
        <header className="xe-contact-preview__head">
          <h3>Contact Preview</h3>
          <p>How this appears on the public site</p>
        </header>
        <div className="xe-contact-preview__card">
          <div className="xe-contact-preview__row">
            <span className="xe-contact-preview__label">Email</span>
            <strong>
              <FieldValue path="email" fallback="Add an email" />
            </strong>
          </div>
          <div className="xe-contact-preview__row">
            <span className="xe-contact-preview__label">Phone</span>
            <strong>
              <FieldValue path="phone" fallback="Add a phone" />
            </strong>
          </div>
          <div className="xe-contact-preview__row">
            <span className="xe-contact-preview__label">WhatsApp</span>
            <strong>
              <FieldValue path="whatsapp" fallback="Optional" />
            </strong>
          </div>
          <div className="xe-contact-preview__row xe-contact-preview__row--block">
            <span className="xe-contact-preview__label">Hours</span>
            <strong>
              <FieldValue path="hours" fallback="Set business hours" />
            </strong>
          </div>
        </div>
      </section>

      <section className="xe-contact-tips" aria-label="Tips">
        <h3>Tips</h3>
        <ul>
          <li>Use a monitored inbox — lead replies show in Sales CRM.</li>
          <li>Prefer a Maps embed URL over raw iframe HTML.</li>
          <li>Keep hours short (one or two lines) for mobile footers.</li>
          <li>Save publishes to the Contact page after revalidation.</li>
        </ul>
      </section>
    </div>
  )
}

export default ContactDetailsAside
