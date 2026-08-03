/* Xelarvis CMS Service Worker — scope /admin/ */
const CACHE = 'xelarvis-admin-v3'
const PRECACHE = [
  '/admin',
  '/admin/manifest.webmanifest',
  '/icons/admin-192.png',
  '/icons/admin-512.png',
  '/icons/admin-maskable-512.png',
]

self.addEventListener('install', (event) => {
  // Wait for explicit SKIP_WAITING from the client update UX.
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

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith('/admin')) return
  if (url.pathname.startsWith('/api')) return

  // Admin is API-heavy — only cache navigations lightly; never treat as full offline CMS.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, ['/admin']))
    return
  }

  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|ico)$/)
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
