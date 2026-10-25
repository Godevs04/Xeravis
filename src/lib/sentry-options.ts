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
  }
}
