import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import type { AggregationRow } from "@scrawn/core"
import {
  getAiTokenUsage,
  getDashboardSummary,
  getPaymentHistory,
  getUsageOverTime,
} from "@/lib/scrawn-server"
import { UsageOverTime } from "@/components/analytics/usage-over-time"
import { AiTokenUsage } from "@/components/analytics/ai-token-usage"
import { PaymentHistory } from "@/components/analytics/payment-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/dashboard/")({ component: DashboardHome })

function DashboardHome() {
  const [summary, setSummary] = useState<{
    totalRevenue: string
    totalEvents: string
    totalCredits: string
  } | null>(null)
  const [usageOverTime, setUsageOverTime] = useState<Array<AggregationRow>>([])
  const [aiToken, setAiToken] = useState<{
    input: Array<AggregationRow>
    output: Array<AggregationRow>
  }>({ input: [], output: [] })
  const [paymentHist, setPaymentHist] = useState<Array<AggregationRow>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getUsageOverTime(),
      getAiTokenUsage(),
      getPaymentHistory(),
    ])
      .then(([s, u, a, p]) => {
        setSummary(s)
        setUsageOverTime(u)
        setAiToken(a)
        setPaymentHist(p)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Dashboard</h1>

      {loading ? (
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
                ${Number(summary?.totalRevenue ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">
                {Number(summary?.totalEvents ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium">
                ${Number(summary?.totalCredits ?? 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-[260px] w-full" />
      ) : (
        <UsageOverTime data={usageOverTime} />
      )}

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-[310px] w-full" />
            <Skeleton className="h-[310px] w-full" />
          </>
        ) : (
          <>
            <AiTokenUsage data={aiToken} />
            <PaymentHistory data={paymentHist} />
          </>
        )}
      </div>
    </div>
  )
}
