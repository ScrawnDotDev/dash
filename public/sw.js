const CACHE = "scrawn-v1"

const API_PATTERNS = [/\/api\//, /\/scrawn\./]

function isApiRequest(url) {
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

async function findCachedNavigation(cache) {
  const candidates = ["/dashboard", "/", "/sign-in"]
  for (const url of candidates) {
    const res = await cache.match(url)
    if (res) return res
  }
  const all = await cache.keys()
  for (const req of all) {
    if (req.mode === "navigate") {
      const res = await cache.match(req)
      if (res) return res
    }
  }
  return null
}

self.addEventListener("fetch", (e) => {
  if (isApiRequest(e.request.url)) return
  e.respondWith(handleNavigationOrAsset(e))
})

async function handleNavigationOrAsset(e) {
  const cache = await caches.open(CACHE)

  if (e.request.mode === "navigate") {
    const cached = await cache.match(e.request)
    if (cached) return cached

    try {
      const res = await fetch(e.request)
      if (res.ok) cache.put(e.request, res.clone())
      return res
    } catch {
      const fallback = await findCachedNavigation(cache)
      if (fallback) return fallback

      return new Response(
        "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>Offline</title><meta name='viewport' content='width=device-width,initial-scale=1'><style>body{background:#000;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:2rem;text-align:center}p{color:#999}</style></head><body><div><h1>You're offline</h1><p>No cached data available. Connect to the internet and reload.</p></div></body></html>",
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      )
    }
  }

  const cached = await cache.match(e.request)
  const fetchPromise = fetch(e.request)
    .then((res) => {
      if (res.ok) cache.put(e.request, res.clone())
      return res
    })
    .catch(() => cached)

  return cached || fetchPromise
}
