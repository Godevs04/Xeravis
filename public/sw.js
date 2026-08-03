/* Xelarvis Website Service Worker */
const CACHE = 'xelarvis-site-v3'
const PRECACHE = [
  '/',
  '/manifest.webmanifest',
  '/icons/site-192.png',
  '/icons/site-512.png',
  '/icons/site-maskable-512.png',
  '/icons/apple-touch-180.png',
  '/icons/icon.svg',
  '/icons/favicon-32.png',
  '/offline',
]

self.addEventListener('install', (event) => {
  // Do NOT skipWaiting here — waiting SW activates after client confirms update.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => undefined)))),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

function networkFirst(request, fallbackUrls) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, copy))
      }
      return response
    })
    .catch(async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      for (const url of fallbackUrls || []) {
        const fallback = await caches.match(url)
        if (fallback) return fallback
      }
      return Response.error()
    })
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const network = fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(() => cached)
    return cached || network
  })
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return

  // Network-first for navigations, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, ['/', '/offline']))
    return
  }

  // Hashed Next bundles + fonts: network-first so deploys are not stuck on stale JS/CSS
  if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(?:js|css|woff2)$/)) {
    event.respondWith(networkFirst(request))
    return
  }

  // Icons / images / manifest: stale-while-revalidate
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|ico)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request))
  }
})
