import { createFileRoute } from "@tanstack/react-router"
import {
  getAiTokenUsage,
  getDashboardSummary,
  getPaymentHistory,
  getRecentEvents,
  getUsageOverTime,
  listDeliveries,
} from "@/lib/scrawn-server"
import { useCachedData, TTL } from "@/lib/useCache"
import { UsageOverTime } from "@/components/analytics/usage-over-time"
import { AiTokenUsage } from "@/components/analytics/ai-token-usage"
import { PaymentHistory } from "@/components/analytics/payment-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})

function DashboardHome() {
  const summary = useCachedData(
    "summary",
    getDashboardSummary,
    TTL.DASHBOARD_SUMMARY
  )
  const usage = useCachedData(
    "usage-over-time",
    getUsageOverTime,
    TTL.USAGE_OVER_TIME
  )
  const ai = useCachedData(
    "ai-token-usage",
    getAiTokenUsage,
    TTL.AI_TOKEN_USAGE
  )
  const payments = useCachedData(
    "payment-history",
    getPaymentHistory,
    TTL.PAYMENT_HISTORY
  )
  const recentEvents = useCachedData(
    "recent-events",
    getRecentEvents,
    TTL.DASHBOARD_SUMMARY
  )
  const recentDeliveries = useCachedData(
    "recent-deliveries",
    () => listDeliveries({ data: { limit: 8 } }),
    TTL.WEBHOOK_DELIVERIES
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-black tracking-widest text-black uppercase dark:text-white">
          Overview
        </h1>
      </div>

      {summary.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[110px] w-full border-2 border-black dark:border-white rounded-none" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-xs">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-black text-black dark:text-white">
                {Number(summary.data?.totalRevenue ?? 0).toLocaleString()}
              </p>
              <p className="mt-1 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Smallest Currency Unit
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-xs">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-black text-black dark:text-white">
                {Number(summary.data?.totalEvents ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-xs">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-black text-black dark:text-white">
                {Number(summary.data?.totalCredits ?? 0).toLocaleString()}
              </p>
              <p className="mt-1 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Smallest Currency Unit
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {usage.loading ? (
        <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
      ) : (
        <UsageOverTime data={usage.data ?? []} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEvents.loading ? (
              <Skeleton className="h-[200px] w-full rounded-none" />
            ) : !recentEvents.data || (recentEvents.data as unknown as Array<Record<string, unknown>>).length === 0 ? (
              <p className="font-mono text-xs font-bold text-red-500 uppercase">
                No Events Yet
              </p>
            ) : (
              <div className="flex flex-col">
                {(recentEvents.data as unknown as Array<Record<string, unknown>>).slice(0, 8).reverse().map((evt, i) => (
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
          </CardContent>
        </Card>

        {ai.loading ? (
          <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
        ) : (
          <AiTokenUsage data={ai.data ?? { input: [], output: [] }} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDeliveries.loading ? (
              <Skeleton className="h-[200px] w-full rounded-none" />
            ) : !recentDeliveries.data || (Array.isArray(recentDeliveries.data) && recentDeliveries.data.length === 0) ? (
              <p className="font-mono text-xs font-bold text-red-500 uppercase">
                No Deliveries Yet
              </p>
            ) : (
              <div className="flex flex-col">
                {(Array.isArray(recentDeliveries.data) ? recentDeliveries.data : (recentDeliveries.data as { deliveries: Array<Record<string, unknown>> }).deliveries ?? []).slice(0, 8).map((d, i) => (
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
          </CardContent>
        </Card>

        {payments.loading ? (
          <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
        ) : (
          <PaymentHistory data={payments.data ?? []} />
        )}
      </div>
    </div>
  )
}
