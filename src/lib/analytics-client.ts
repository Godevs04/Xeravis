'use client'

import type { PostHog } from 'posthog-js'

export const CONSENT_KEY = 'xe-cookie-consent'
export const CONSENT_EVENT = 'xe-consent-change'

type SentryClient = typeof import('@sentry/nextjs')

let allowed = false
let client: Promise<PostHog | null> | null = null
let sentry: Promise<SentryClient | null> | null = null

export function hasStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function storeConsent() {
  try {
    window.localStorage.setItem(CONSENT_KEY, 'accepted')
  } catch {
    // Storage can be blocked; consent then lasts for this page view only.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/** Marks analytics as allowed for this page view (consent given, or no banner configured). */
export function allowAnalytics() {
  allowed = true
  void loadSentry()
}

export function isAnalyticsAllowed() {
  return allowed
}

/** Loads Sentry error monitoring after consent, only when `NEXT_PUBLIC_SENTRY_DSN` is set. */
function loadSentry(): Promise<SentryClient | null> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return Promise.resolve(null)
  sentry ??= Promise.all([import('@sentry/nextjs'), import('@/lib/sentry-options')])
    .then(([Sentry, { sentryOptions }]) => {
      Sentry.init(sentryOptions(dsn))
      return Sentry
    })
    .catch(() => null)
  return sentry
}

/** Loads and initialises PostHog on first use; `posthog-js` stays out of the initial bundle. */
export function loadPosthog(): Promise<PostHog | null> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (!token || !host) return Promise.resolve(null)
  client ??= import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        capture_exceptions: true,
        disable_session_recording: true,
        disable_surveys: true,
        debug: process.env.NODE_ENV === 'development',
      })
      return posthog
    })
    .catch(() => null)
  return client
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!allowed) return
  void loadPosthog().then((posthog) => posthog?.capture(event, properties))
}

export function reportError(error: unknown) {
  if (!allowed) return
  void loadSentry().then((Sentry) => Sentry?.captureException(error))
  void loadPosthog().then((posthog) => posthog?.captureException(error))
}
