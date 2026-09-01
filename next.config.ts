import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
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
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.posthog.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
              "worker-src 'self' blob: https://*.posthog.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://www.gravatar.com https://secure.gravatar.com",
              "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://*.posthog.com https://cdn.jsdelivr.net https://www.google-analytics.com https://vitals.vercel-insights.com",
              "manifest-src 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
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
          { key: 'Service-Worker-Allowed', value: '/admin/' },
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
    ]
  },
}

const withPayloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })

/**
 * Payload's withPayload injects Critical-CH: Sec-CH-Prefers-Color-Scheme which forces
 * Chrome to re-request the document on first paint — a large LCP hit in Lighthouse.
 * Keep Accept-CH (optional later hints) but drop Critical-CH + its Vary-only entry.
 */
export default {
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
