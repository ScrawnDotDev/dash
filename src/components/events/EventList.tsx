import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { getFilteredEvents } from "@/lib/scrawn-server"
import { useCachedData } from "@/lib/useCache"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EventListProps {
  apiKeyId?: string
  userId?: string
  eventType?: string
  mode?: string
  model?: string
  compact?: boolean
  showViewMore?: boolean
  pageSize?: number
  title?: string
}

export function EventList({
  apiKeyId,
  userId,
  eventType,
  mode,
  model,
  compact,
  showViewMore,
  pageSize = 8,
  title,
}: EventListProps) {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)

  const { data, loading, error } = useCachedData(
    `events-list:${apiKeyId ?? ""}:${userId ?? ""}:${eventType ?? ""}:${mode ?? ""}:${model ?? ""}:${page}`,
    () => getFilteredEvents({ data: { apiKeyId, userId, eventType, mode, model, limit: pageSize, offset: page * pageSize } }),
    30000
  )

  const events = (data as { rows: Array<Record<string, unknown>>; total: number } | null)?.rows ?? []
  const total = (data as { rows: Array<Record<string, unknown>>; total: number } | null)?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  if (compact && !loading && !error && events.length === 0) return null

  return (
    <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title ?? "Recent Events"}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && !data ? (
          <div className={`w-full rounded-none border-2 border-black dark:border-white ${compact ? "h-[160px]" : "h-[300px]"}`} />
        ) : error ? (
          <p className="font-mono text-xs font-bold text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="font-mono text-xs font-bold text-red-500 uppercase">No Events Yet</p>
        ) : (
          <div className="flex flex-col">
            {events.map((evt, i) => (
              <div
                key={evt.eventId as string}
                className={`flex items-center justify-between py-2 text-xs ${i > 0 ? "border-t-2 border-black dark:border-white" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-black uppercase truncate dark:text-white">
                    {String(evt.eventType ?? "")}
                  </span>
                  <span className="text-gray-400 font-mono truncate max-w-[120px]">
                    {String(evt.userId ?? "").slice(0, 16)}...
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-black text-black dark:text-white">
                    {Number(evt.debitAmount ?? 0).toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">
                    {String(evt.ingestedTimestamp ?? "").slice(0, 10)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            {!compact && <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />}
            <div className={compact ? "ml-auto" : ""}>
              {showViewMore && (
                <button
                  onClick={() => navigate({ to: "/dashboard/events" })}
                  className="font-mono text-xs font-bold text-black underline underline-offset-2 hover:text-yellow-600 dark:text-white dark:hover:text-yellow-400"
                >
                  View More →
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
