import { useState, useEffect } from "react"
import { listDeliveries } from "@/lib/scrawn-server"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WebhookListProps {
  apiKeyId?: string
  eventType?: string
  status?: string
  compact?: boolean
  pageSize?: number
  title?: string
}

export function WebhookList({
  apiKeyId,
  eventType,
  status,
  compact,
  pageSize = 8,
  title,
}: WebhookListProps) {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<{ deliveries: Array<Record<string, unknown>> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    listDeliveries({ data: { apiKeyId, eventType, status, limit: pageSize, offset: page * pageSize } })
      .then((res) => {
        if (!cancelled) {
          setData(res as unknown as { deliveries: Array<Record<string, unknown>> })
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load deliveries")
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [apiKeyId, eventType, status, page, pageSize])

  const deliveries = data?.deliveries ?? []

  if (compact && !loading && !error && deliveries.length === 0) return null

  return (
    <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title ?? "Recent Webhooks"}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className={`w-full rounded-none ${compact ? "h-[160px]" : "h-[300px]"}`} />
        ) : error ? (
          <p className="font-mono text-xs font-bold text-red-500">{error}</p>
        ) : deliveries.length === 0 ? (
          <p className="font-mono text-xs font-bold text-red-500 uppercase">No Deliveries Yet</p>
        ) : (
          <div className="flex flex-col">
            {deliveries.map((d, i) => (
              <div
                key={d.id as string}
                className={`flex items-center justify-between py-2 text-xs ${i > 0 ? "border-t-2 border-black dark:border-white" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 ${d.status === "delivered" ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
                  />
                  <span className="font-mono font-bold text-black uppercase truncate dark:text-white">
                    {String(d.eventType ?? "")}
                  </span>
                  <span className="text-gray-400 font-mono truncate max-w-[100px]">
                    {String(d.apiKeyName ?? "")}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {d.responseStatus != null && (
                    <span
                      className={`font-mono font-black text-xs ${Number(d.responseStatus) < 300 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      HTTP {String(d.responseStatus)}
                    </span>
                  )}
                  <span className="text-gray-400 font-mono text-[10px]">
                    {new Date(String(d.createdAt ?? "")).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && deliveries.length > 0 && !compact && (
          <div className="mt-3">
            <Pagination currentPage={page + 1} totalPages={Math.max(1, Math.ceil(deliveries.length / pageSize))} onPageChange={(p) => setPage(p - 1)} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
