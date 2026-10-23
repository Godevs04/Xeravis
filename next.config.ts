import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const isProd = process.env.NODE_ENV === 'production'
// HSTS is only safe once the site is served over https (never on localhost).
const hsts =
  isProd && siteUrl.startsWith('https://')
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []
// React Refresh needs eval in development only.
const devEval = isProd ? '' : " 'unsafe-eval'"

const ANALYTICS = [
  'https://*.posthog.com',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://www.clarity.ms',
  'https://*.clarity.ms',
]
const SENTRY = [
  'https://*.ingest.sentry.io',
  'https://*.ingest.us.sentry.io',
  'https://*.ingest.de.sentry.io',
]
const CALCOM = ['https://app.cal.com', 'https://cal.com']
const TURNSTILE = ['https://challenges.cloudflare.com']
const MAPS = ['https://www.google.com', 'https://maps.google.com']

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval} blob: https://cdn.jsdelivr.net ${[...ANALYTICS, ...CALCOM, ...TURNSTILE].join(' ')}`,
  "script-src-attr 'none'",
  "worker-src 'self' blob: https://*.posthog.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://www.gravatar.com https://secure.gravatar.com https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://app.cal.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
  `connect-src 'self' https://cdn.jsdelivr.net https://vitals.vercel-insights.com ${[...ANALYTICS, ...SENTRY, ...CALCOM, ...TURNSTILE].join(' ')}`,
  `frame-src 'self' ${[...CALCOM, ...TURNSTILE, ...MAPS].join(' ')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'self'",
  ...(isProd && siteUrl.startsWith('https://') ? ['upgrade-insecure-requests'] : []),
  // Sentry's security endpoint (Project settings > Security Headers) or any CSP report collector.
  ...(process.env.CSP_REPORT_URI ? [`report-uri ${process.env.CSP_REPORT_URI}`] : []),
].join('; ')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/brand/**' },
      { pathname: '/icons/**' },
      { pathname: '/XELlogo512.png' },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      {
        protocol: 'https',
        hostname: new URL(siteUrl).hostname,
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...hsts,
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/admin/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/admin' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
      },
      {
        source: '/admin/manifest.webmanifest',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(dirname),
  },
  async redirects() {
    return [
      { source: '/research', destination: '/ai-research-lab', permanent: true },
      { source: '/approach', destination: '/about/our-approach', permanent: true },
      { source: '/blog', destination: '/insights/blogs', permanent: true },
      { source: '/careers/sr', destination: '/careers/sr-developer-engineer', permanent: true },
    ]
  },
}

const withPayloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })

/**
 * Payload's withPayload injects Critical-CH: Sec-CH-Prefers-Color-Scheme which forces
 * Chrome to re-request the document on first paint — a large LCP hit in Lighthouse.
 * Keep Accept-CH (optional later hints) but drop Critical-CH + its Vary-only entry.
 */
const config = {
  ...withPayloadConfig,
  async headers() {
    const entries =
      typeof withPayloadConfig.headers === 'function' ? await withPayloadConfig.headers() : []

    return entries
      .map((entry) => ({
        ...entry,
        headers: (entry.headers || []).filter((header) => {
          if (header.key === 'Critical-CH') return false
          if (header.key === 'Accept-CH' && header.value.includes('Sec-CH-Prefers-Color-Scheme')) {
            return false
          }
          if (header.key === 'Vary' && header.value === 'Sec-CH-Prefers-Color-Scheme') {
            return false
          }
          return true
        }),
      }))
      .filter((entry) => (entry.headers || []).length > 0)
  },
}

// Source maps are uploaded to Sentry only when an auth token is configured (CI / Vercel).
export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(config, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      sourcemaps: { deleteSourcemapsAfterUpload: true },
    })
  : config
