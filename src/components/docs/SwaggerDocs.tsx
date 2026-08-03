'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const SWAGGER_UI_CSS = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css'
const SWAGGER_UI_BUNDLE =
  'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js'

declare global {
  interface Window {
    SwaggerUIBundle?: (options: Record<string, unknown>) => unknown
  }
}

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

export function SwaggerDocs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    const boot = async () => {
      loadStylesheet(SWAGGER_UI_CSS)
      await loadScript(SWAGGER_UI_BUNDLE)
      if (cancelled || !containerRef.current || !window.SwaggerUIBundle) return

      window.SwaggerUIBundle({
        url: '/api/openapi',
        domNode: containerRef.current,
        deepLinking: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
        tryItOutEnabled: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
      })
    }

    void boot()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1b1b1b]">
      <header className="border-b border-black/10 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-teal-700 uppercase">
              Developer
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              API documentation
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/65">
              OpenAPI 3 for first-party routes. Payload REST and GraphQL are linked as related
              surfaces. Spec JSON:{' '}
              <Link className="font-medium text-teal-700 underline" href="/api/openapi">
                /api/openapi
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/api/graphql-playground"
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 font-medium hover:border-teal-600"
            >
              GraphQL Playground
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 font-medium hover:border-teal-600"
            >
              CMS Admin
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-2 py-4 sm:px-4">
        <div
          ref={containerRef}
          className="swagger-ui-wrap overflow-hidden rounded-xl bg-white shadow-sm"
        />
      </div>
    </div>
  )
}
