import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react"

const CACHE_PREFIX = "scrawn:cache:"

export const TTL = {
  DASHBOARD_SUMMARY: 5 * 60 * 1000,
  USAGE_OVER_TIME: 5 * 60 * 1000,
  AI_TOKEN_USAGE: 5 * 60 * 1000,
  PAYMENT_HISTORY: 5 * 60 * 1000,
  API_KEYS: 60 * 1000,
  TAGS: 2 * 60 * 1000,
  EXPRESSIONS: 2 * 60 * 1000,
  WEBHOOK_DELIVERIES: 30 * 1000,
  BACKEND_CONFIG: 5 * 60 * 1000,
} as const

interface StoredEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

function getFromCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    return (JSON.parse(raw) as StoredEntry<T>).data
  } catch {
    return null
  }
}

function isCacheFresh(key: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return false
    const entry: StoredEntry<unknown> = JSON.parse(raw)
    return Date.now() - entry.timestamp < entry.ttl
  } catch {
    return false
  }
}

function setInCache<T>(key: string, data: T, ttl: number): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now(), ttl })
    )
  } catch {}
}

export function invalidateCache(key: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(CACHE_PREFIX + key)
  } catch {}
}

// ── Global refresh context ──────────────────────────────────────────

export interface RefreshContextType {
  version: number
  triggerRefresh: () => void
}

export const RefreshContext = createContext<RefreshContextType>({
  version: 0,
  triggerRefresh: () => {},
})

// ── Refreshing tracker (for the loading bar) ────────────────────────

let activeRefreshes = 0
const refreshListeners = new Set<(v: boolean) => void>()

export function startBackgroundRefresh() {
  activeRefreshes++
  if (activeRefreshes === 1) {
    for (const cb of refreshListeners) cb(true)
  }
}

export function endBackgroundRefresh() {
  activeRefreshes--
  if (activeRefreshes <= 0) {
    activeRefreshes = 0
    for (const cb of refreshListeners) cb(false)
  }
}

export function useIsRefreshing(): boolean {
  const [refreshing, setRefreshing] = useState(activeRefreshes > 0)
  useEffect(() => {
    refreshListeners.add(setRefreshing)
    return () => {
      refreshListeners.delete(setRefreshing)
    }
  }, [])
  return refreshing
}

// ── useCachedData hook ──────────────────────────────────────────────

interface CachedDataResult<T> {
  data: T | null
  loading: boolean
  refreshing: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60000
): CachedDataResult<T> {
  const [data, setData] = useState<T | null>(() => getFromCache<T>(key))
  const [loading, setLoading] = useState(!data)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchId = useRef(0)
  const ctx = useContext(RefreshContext)

  const doFetch = useCallback(
    async (background: boolean) => {
      const id = ++fetchId.current
      if (background) {
        setRefreshing(true)
        startBackgroundRefresh()
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const result = await fetcher()
        if (id !== fetchId.current) return
        setData(result)
        setInCache(key, result, ttl)
      } catch (err) {
        if (id !== fetchId.current) return
        setError(err instanceof Error ? err.message : "Request failed")
      } finally {
        if (id !== fetchId.current) return
        setLoading(false)
        setRefreshing(false)
        endBackgroundRefresh()
      }
    },
    [key, fetcher, ttl]
  )

  // Hydrate from cache on mount; fetch if missing or stale
  useEffect(() => {
    const cached = getFromCache<T>(key)
    if (cached !== null && isCacheFresh(key)) {
      setData(cached)
      setLoading(false)
      return
    }
    if (cached !== null) {
      setData(cached)
      setLoading(false)
      doFetch(true)
    } else {
      doFetch(false)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for global refresh
  useEffect(() => {
    if (ctx.version > 0) {
      doFetch(true)
    }
  }, [ctx.version]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-poll at TTL interval
  useEffect(() => {
    const interval = setInterval(() => doFetch(true), ttl)
    return () => clearInterval(interval)
  }, [ttl, key]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(async () => {
    invalidateCache(key)
    await doFetch(false)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, refreshing, error, refresh }
}
