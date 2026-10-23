'use client'

import { useEffect, useState } from 'react'

import { isAnalyticsAllowed } from '@/lib/analytics-client'
import {
  ATTRIBUTION_FIELDS,
  ATTRIBUTION_PREFIX,
  ATTRIBUTION_STORAGE_KEY,
  type Attribution,
} from '@/lib/attribution'

function readStored(): Attribution {
  try {
    return JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}') as Attribution
  } catch {
    return {}
  }
}

/**
 * Hidden inputs carrying first-touch attribution into a lead form. Without analytics consent
 * only the landing page is sent; campaign parameters and referrer need consent.
 */
export function AttributionFields() {
  const [values, setValues] = useState<Attribution>({})

  useEffect(() => {
    const stored = readStored()
    setValues(isAnalyticsAllowed() ? stored : { landingPage: stored.landingPage })
  }, [])

  return (
    <>
      {ATTRIBUTION_FIELDS.map((field) =>
        values[field] ? (
          <input
            key={field}
            type="hidden"
            name={`${ATTRIBUTION_PREFIX}${field}`}
            value={values[field]}
          />
        ) : null,
      )}
    </>
  )
}
