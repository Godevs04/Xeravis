import type { ErrorEvent, EventHint } from '@sentry/nextjs'

/** Expected auth failures (e.g. Payload's UnauthorizedError after an admin session expires). */
function isAuthError(error: unknown) {
  const status = (error as { status?: unknown } | null)?.status
  return status === 401 || status === 403
}

/** Shared Sentry init options; Sentry stays off unless a DSN is configured. */
export function sentryOptions(dsn: string | undefined) {
  const configuredRate = process.env.SENTRY_TRACES_SAMPLE_RATE
  const release = process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA
  return {
    dsn,
    enabled: Boolean(dsn),
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV,
    // Omitted when unset so the release injected by withSentryConfig at build time still applies.
    ...(release ? { release } : {}),
    tracesSampleRate: configuredRate
      ? Number(configuredRate)
      : process.env.NODE_ENV === 'development'
        ? 1.0
        : 0.1,
    sendDefaultPii: false,
    beforeSend(event: ErrorEvent, hint: EventHint) {
      return isAuthError(hint.originalException) ? null : event
    },
  }
}
