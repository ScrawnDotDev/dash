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
            <Skeleton key={i} className="h-[100px] w-full border-2 border-black dark:border-white rounded-none" />
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
            </CardContent>
          </Card>
          <Card className="bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-yellow-500 dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-black/70 text-xs dark:text-black/70">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-black text-black dark:text-black">
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
        {ai.loading && payments.loading ? (
          <>
            <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
            <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
          </>
        ) : (
          <>
            <AiTokenUsage data={ai.data ?? { input: [], output: [] }} />
            <PaymentHistory data={payments.data ?? []} />
          </>
        )}
      </div>
    </div>
  )
}
