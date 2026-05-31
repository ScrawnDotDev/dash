import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  getAiTokenUsage,
  getDashboardSummary,
  getPaymentHistory,
  getUsageOverTime,
} from "@/lib/scrawn-server"
import { useCachedData, TTL } from "@/lib/useCache"
import { UsageOverTime } from "@/components/analytics/usage-over-time"
import { AiTokenUsage } from "@/components/analytics/ai-token-usage"
import { PaymentHistory } from "@/components/analytics/payment-history"
import { EventList } from "@/components/events/EventList"
import { WebhookList } from "@/components/webhooks/WebhookList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})

function DashboardHome() {
  const [mode, setMode] = useState<string | undefined>(undefined)

  const summary = useCachedData(
    `summary:${mode ?? "all"}`,
    () => getDashboardSummary({ data: { mode } }),
    TTL.DASHBOARD_SUMMARY
  )
  const usage = useCachedData(
    `usage-over-time:${mode ?? "all"}`,
    () => getUsageOverTime({ data: { mode } }),
    TTL.USAGE_OVER_TIME
  )
  const ai = useCachedData(
    `ai-token-usage:${mode ?? "all"}`,
    () => getAiTokenUsage({ data: { mode } }),
    TTL.AI_TOKEN_USAGE
  )
  const payments = useCachedData(
    `payment-history:${mode ?? "all"}`,
    () => getPaymentHistory({ data: { mode } }),
    TTL.PAYMENT_HISTORY
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-black tracking-widest text-black uppercase dark:text-white">
          Overview
        </h1>
        <div className="flex border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          {(["all", "test", "production"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m === "all" ? undefined : m)}
              className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-colors ${
                (mode ?? "all") === m
                  ? "bg-yellow-400 text-black dark:bg-yellow-500"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
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
        <EventList compact showViewMore mode={mode} />
        {ai.loading ? (
          <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
        ) : (
          <AiTokenUsage data={ai.data ?? { input: [], output: [] }} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebhookList compact role={mode} />
        {payments.loading ? (
          <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
        ) : (
          <PaymentHistory data={payments.data ?? []} />
        )}
      </div>
    </div>
  )
}
