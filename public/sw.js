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

async function handleFetch(e) {
  if (isApiRequest(e.request.url)) return

  const cache = await caches.open(CACHE)

  // Navigation: try network first, fall back to cached /dashboard HTML
  if (e.request.mode === "navigate") {
    try {
      const res = await fetch(e.request)
      if (res.ok) cache.put(e.request, res.clone())
      return res
    } catch {
      const fallback = await cache.match("/dashboard")
      if (fallback) return fallback
      return cache.match(e.request)
    }
  }

  // Static assets: serve from cache if available, update in background
  const cached = await cache.match(e.request)
  const fetchPromise = fetch(e.request)
    .then((res) => {
      if (res.ok) cache.put(e.request, res.clone())
      return res
    })
    .catch(() => cached)

  return cached || fetchPromise
}

self.addEventListener("fetch", (e) => {
  e.respondWith(handleFetch(e))
})
