/* Xelarvis Website Service Worker */
const CACHE = 'xelarvis-site-v2'
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
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => undefined))))
      .then(() => self.skipWaiting()),
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

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return

  // Network-first for navigations, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/') || caches.match('/offline')),
        ),
    )
    return
  }

  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.match(/\.(?:js|css|png|jpg|jpeg|svg|webp|woff2|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (!response || response.status !== 200) return response
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
  }
})
