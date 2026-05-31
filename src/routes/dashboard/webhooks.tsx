import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listDeliveries } from "@/lib/scrawn-server"
import { useCachedData, TTL } from "@/lib/useCache"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard/webhooks")({
  component: WebhooksPage,
})

function WebhooksPage() {
  const {
    data: deliveriesData,
    loading,
    refresh,
  } = useCachedData(
    "webhook-deliveries",
    () => listDeliveries({ data: { limit: 50 } }),
    TTL.WEBHOOK_DELIVERIES
  )
  const deliveries =
    (deliveriesData as { deliveries: Array<Record<string, unknown>> } | null)
      ?.deliveries ?? []
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="w-max border-2 border-black bg-white px-4 py-2 font-mono text-3xl font-black tracking-widest text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          WEBHOOKS
        </h1>
        <Button
          size="sm"
          variant="secondary"
          onClick={refresh}
          disabled={loading}
        >
          REFRESH
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">
          LOADING LOGS ///
        </p>
      ) : deliveries.length === 0 ? (
        <p className="font-mono text-sm font-bold text-red-500 uppercase">
          NO DELIVERIES LOGGED /// IS IT PLUGGED IN?
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {deliveries.map((d: Record<string, unknown>) => (
            <Card
              key={d.id as string}
              className="border-2 border-black bg-white p-0 dark:border-white dark:bg-black"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between border-b-2 border-black pb-3 dark:border-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-3 w-3 ${d.status === "delivered" ? "bg-green-500" : "animate-pulse bg-red-500"}`}
                      />
                      <span className="font-mono text-base font-black text-black uppercase dark:text-white">
                        {String(d.eventType ?? "")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {String(d.resource ?? "")}.{String(d.action ?? "")}
                      </span>
                      <span
                        className={`border-2 border-black px-1.5 py-0.5 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${d.apiKeyRole === "production" ? "bg-yellow-400 text-black dark:bg-yellow-500" : "bg-blue-400 text-black dark:bg-blue-500"}`}
                      >
                        {String(d.apiKeyRole ?? "")}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      <p>ID: {String(d.eventId ?? "")}</p>
                      {!!d.endpointUrl && (
                        <p>
                          ENDPOINT:{" "}
                          <code className="font-bold break-all text-black dark:text-white">
                            {String(d.endpointUrl)}
                          </code>
                        </p>
                      )}
                      {!!d.apiKeyName && (
                        <p>
                          KEY:{" "}
                          <span className="font-bold text-black dark:text-white">
                            {String(d.apiKeyName)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-gray-500">
                      {new Date(String(d.createdAt ?? "")).toLocaleString()}
                    </p>
                    {d.responseStatus != null && (
                      <span
                        className={`border-2 border-black px-2 py-1 font-mono text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${Number(d.responseStatus) < 300 ? "bg-green-500 text-white" : "animate-pulse bg-red-500 text-white"}`}
                      >
                        HTTP {Number(d.responseStatus)}
                      </span>
                    )}
                  </div>
                </div>

                {d.error != null && (
                  <div className="mt-3 border-2 border-black bg-red-500 px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white">
                    <p className="font-mono text-xs font-bold text-white uppercase">
                      ERROR /// {String(d.error)}
                    </p>
                  </div>
                )}

                {!!d.requestBody && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleExpand(d.id as string)}
                    >
                      {expanded.has(d.id as string) ? "HIDE" : "SHOW"} PAYLOAD
                    </Button>
                    {expanded.has(d.id as string) && (
                      <pre className="mt-2 overflow-x-auto border-2 border-black bg-gray-100 p-3 font-mono text-xs text-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:border-white dark:bg-gray-900 dark:text-white dark:shadow-[inset_4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                        {JSON.stringify(d.requestBody, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
