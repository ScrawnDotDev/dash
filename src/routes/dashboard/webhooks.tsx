import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listDeliveries } from "@/lib/scrawn-server"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/dashboard/webhooks")({ component: WebhooksPage })

function WebhooksPage() {
  const [deliveries, setDeliveries] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listDeliveries({ data: { limit: 50 } })
      .then((d) => setDeliveries(((d as { deliveries: Array<Record<string, unknown>> }).deliveries ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${d.status === "delivered" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm font-medium">{String(d.eventType ?? "")}</span>
                    <span className="text-xs text-gray-500">{String(d.resource ?? "")}.{String(d.action ?? "")}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {String(d.eventId ?? "")}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{new Date(String(d.createdAt ?? "")).toLocaleString()}</p>
                  {d.responseStatus != null && <p>Status: {Number(d.responseStatus)}</p>}
                </div>
              </CardContent>
              {d.error != null && (
                <div className="border-t border-gray-800 px-4 py-2">
                  <p className="text-xs text-red-400">Error: {String(d.error)}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
