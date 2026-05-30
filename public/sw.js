const CACHE = "scrawn-v1"

const API_PATTERNS = [/\/api\//, /\/scrawn\./]

function isApiRequest(url: string): boolean {
  return API_PATTERNS.some((p) => p.test(url))
}

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ),
    ])
  )
})

self.addEventListener("fetch", (e) => {
  if (isApiRequest(e.request.url)) return

  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then((cached) => {
        const fetchPromise = fetch(e.request)
          .then((res) => {
            if (res.ok) cache.put(e.request, res.clone())
            return res
          })
          .catch(() => cached)

        return cached || fetchPromise
      })
    )
  )
})
