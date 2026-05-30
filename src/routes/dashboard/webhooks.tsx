import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listDeliveries } from "@/lib/scrawn-server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard/webhooks")({ component: WebhooksPage })

function WebhooksPage() {
  const [deliveries, setDeliveries] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    listDeliveries({ data: { limit: 50 } })
      .then((d) => setDeliveries(((d as { deliveries: Array<Record<string, unknown>> }).deliveries ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Webhook Deliveries</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-sm text-gray-500">No webhook deliveries yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {deliveries.map((d: Record<string, unknown>) => (
            <Card key={d.id as string}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${d.status === "delivered" ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-sm font-medium">{String(d.eventType ?? "")}</span>
                      <span className="text-xs text-gray-500">{String(d.resource ?? "")}.{String(d.action ?? "")}</span>
                      <span className={`rounded px-1.5 py-0.5 text-xs ${d.apiKeyRole === "production" ? "bg-yellow-900 text-yellow-400" : "bg-blue-900 text-blue-400"}`}>
                        {String(d.apiKeyRole ?? "")}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                      <p>ID: {String(d.eventId ?? "")}</p>
                      {!!d.endpointUrl && <p>Endpoint: <code className="text-gray-300">{String(d.endpointUrl)}</code></p>}
                      {!!d.apiKeyName && <p>API Key: <span className="text-gray-300">{String(d.apiKeyName)}</span></p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs text-gray-500">{new Date(String(d.createdAt ?? "")).toLocaleString()}</p>
                    {d.responseStatus != null && (
                      <span className={`rounded px-1.5 py-0.5 text-xs ${Number(d.responseStatus) < 300 ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                        {Number(d.responseStatus)}
                      </span>
                    )}
                  </div>
                </div>

                {d.error != null && (
                  <div className="mt-2 rounded bg-red-950 px-3 py-1.5">
                    <p className="text-xs text-red-400">Error: {String(d.error)}</p>
                  </div>
                )}

                {!!d.requestBody && (
                  <div className="mt-2">
                    <Button size="sm" variant="secondary" onClick={() => toggleExpand(d.id as string)}>
                      {expanded.has(d.id as string) ? "Hide" : "Show"} Body
                    </Button>
                    {expanded.has(d.id as string) && (
                      <pre className="mt-2 overflow-x-auto rounded bg-gray-950 p-3 text-xs text-gray-300">
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
