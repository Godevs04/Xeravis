/* Xelarvis CMS Service Worker — scope /admin/ */
const CACHE = 'xelarvis-admin-v2'
const PRECACHE = [
  '/admin',
  '/admin/manifest.webmanifest',
  '/icons/admin-192.png',
  '/icons/admin-512.png',
  '/icons/admin-maskable-512.png',
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
  if (!url.pathname.startsWith('/admin')) return
  if (url.pathname.startsWith('/api')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/admin'))),
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
