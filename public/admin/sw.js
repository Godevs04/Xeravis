/* Xelarvis CMS Service Worker — scope /admin */
const CACHE = 'xelarvis-admin-v4'
const OFFLINE_URL = '/admin/offline.html'
const PRECACHE = [
  OFFLINE_URL,
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
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('xelarvis-admin-') && key !== CACHE)
              .map((key) => caches.delete(key)),
          ),
        ),
      self.registration.navigationPreload?.enable(),
    ]).then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Admin pages are per-user and change constantly, so navigations are never cached: network only, offline page as the fallback.
async function navigate(event) {
  try {
    const preloaded = await event.preloadResponse
    if (preloaded) return preloaded
    return await fetch(event.request)
  } catch {
    const offline = await caches.match(OFFLINE_URL)
    return offline || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      event.respondWith(navigate(event))
    }
    return
  }

  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/admin/manifest.webmanifest' ||
    url.pathname === OFFLINE_URL
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
