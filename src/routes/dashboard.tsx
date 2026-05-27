import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import type { AggregationRow } from "@scrawn/core"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import {
  getAiTokenUsage,
  getDashboardSummary,
  getPaymentHistory,
  getUsageOverTime,
} from "@/lib/scrawn-server"
import { UsageOverTime } from "@/components/analytics/usage-over-time"
// import { TopUsers } from "@/components/analytics/top-users"
// import { EventDistribution } from "@/components/analytics/event-distribution"
import { AiTokenUsage } from "@/components/analytics/ai-token-usage"
import { PaymentHistory } from "@/components/analytics/payment-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/dashboard")({ component: Dashboard })

function Dashboard() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [summary, setSummary] = useState<{
    totalRevenue: string
    totalEvents: string
    totalCredits: string
  } | null>(null)
  const [usageOverTime, setUsageOverTime] = useState<Array<AggregationRow>>([])
  // const [topUsers, setTopUsers] = useState<Array<AggregationRow>>([])
  // const [eventDist, setEventDist] = useState<Array<AggregationRow>>([])
  const [aiToken, setAiToken] = useState<{
    input: Array<AggregationRow>
    output: Array<AggregationRow>
  }>({ input: [], output: [] })
  const [paymentHist, setPaymentHist] = useState<Array<AggregationRow>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      Promise.all([
        getDashboardSummary(),
        getUsageOverTime(),
        // getTopUsers(),
        // getEventTypeDistribution(),
        getAiTokenUsage(),
        getPaymentHistory(),
      ]).then(([s, u, a, p]) => {
        setSummary(s)
        setUsageOverTime(u)
        // setTopUsers(t)
        // setEventDist(e)
        setAiToken(a)
        setPaymentHist(p)
        setLoading(false)
      })
    }
  }, [session])

  if (isPending) return null

  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  // return <h1>YES</h1>
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{session.user.name}</p>
          <Button
            variant="ghost"
            onClick={async () => {
              await authClient.signOut()
              navigate({ to: "/sign-in" })
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-4 w-24" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ${(Number(summary?.totalRevenue ?? 0) / 100).toFixed(2)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Events</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {Number(summary?.totalEvents ?? 0).toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Credits</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ${(Number(summary?.totalCredits ?? 0) / 100).toFixed(2)}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-[260px] w-full" />
      ) : (
        <UsageOverTime data={usageOverTime} />
      )}

      {/* <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-[310px] w-full" />
            <Skeleton className="h-[310px] w-full" />
          </>
        ) : (
          <>
            <TopUsers data={topUsers} />
            <EventDistribution data={eventDist} />
          </>
        )}
      </div>*/}

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
