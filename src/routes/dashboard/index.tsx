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

export const Route = createFileRoute("/dashboard/")({ component: DashboardHome })

function DashboardHome() {
  const summary = useCachedData("summary", getDashboardSummary, TTL.DASHBOARD_SUMMARY)
  const usage = useCachedData("usage-over-time", getUsageOverTime, TTL.USAGE_OVER_TIME)
  const ai = useCachedData("ai-token-usage", getAiTokenUsage, TTL.AI_TOKEN_USAGE)
  const payments = useCachedData("payment-history", getPaymentHistory, TTL.PAYMENT_HISTORY)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Dashboard</h1>

      {summary.loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">
                ${Number(summary.data?.totalRevenue ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">
                {Number(summary.data?.totalEvents ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">
                ${Number(summary.data?.totalCredits ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {usage.loading ? (
        <Skeleton className="h-[260px] w-full" />
      ) : (
        <UsageOverTime data={usage.data ?? []} />
      )}

      <div className="grid grid-cols-2 gap-4">
        {ai.loading && payments.loading ? (
          <>
            <Skeleton className="h-[310px] w-full" />
            <Skeleton className="h-[310px] w-full" />
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
