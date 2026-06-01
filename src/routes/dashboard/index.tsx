import { createFileRoute } from "@tanstack/react-router"
import { getDashboardSummary, getPaymentHistory, getUsageOverTime } from "@/lib/scrawn-server"
import { useCachedData, TTL } from "@/lib/useCache"
import { useMode } from "@/lib/ModeContext"
import { UsageOverTime } from "@/components/analytics/usage-over-time"
import { PaymentHistory } from "@/components/analytics/payment-history"
import { EventList } from "@/components/events/EventList"
import { WebhookList } from "@/components/webhooks/WebhookList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})

// Helper to provide premium 3D stacked shadow borders
function StackedWrapper({ children, className = "", stretch = false }: { children: React.ReactNode; className?: string; stretch?: boolean }) {
  return (
    <div className={`relative ${stretch ? "flex flex-col h-full" : ""} ${className}`}>
      {/* Offset background panel */}
      <div className={`absolute border-2 border-black bg-neutral-100 dark:border-white dark:bg-black ${
        stretch 
          ? "-right-1.5 bottom-1.5 left-1.5 top-1.5" 
          : "-right-1.5 -bottom-1.5 left-1.5 top-1.5 h-full w-full"
      }`} />
      <div className={`relative z-10 ${
        stretch 
          ? "flex flex-col flex-1 h-full [&>*]:h-full [&>*]:flex [&>*]:flex-col [&>*]:flex-1" 
          : ""
      }`}>
        {children}
      </div>
    </div>
  )
}

function DashboardHome() {
  const { mode, setMode } = useMode()

  const modeParam = mode === "all" ? undefined : mode

  const summary = useCachedData(
    `summary:${mode}`,
    () => getDashboardSummary({ data: { mode: modeParam } }),
    TTL.DASHBOARD_SUMMARY
  )
  const usage = useCachedData(
    `usage-over-time:${mode}`,
    () => getUsageOverTime({ data: { mode: modeParam } }),
    TTL.USAGE_OVER_TIME
  )
  const payments = useCachedData(
    `payment-history:${mode}`,
    () => getPaymentHistory({ data: { mode: modeParam } }),
    TTL.PAYMENT_HISTORY
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="w-max border border-black bg-yellow-400 px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black tracking-widest dark:border-white dark:bg-yellow-500">
            // METRIC DATA CENTER
          </div>
          <h1 className="font-mono text-2xl font-black tracking-widest text-black uppercase dark:text-white">
            Overview
          </h1>
        </div>
        
        {/* Selection Segments */}
        <div className="flex border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] self-start sm:self-auto">
          {(["all", "test", "production"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-colors ${
                mode === m
                  ? "bg-black text-white dark:bg-white dark:text-black"
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
            <StackedWrapper stretch key={i}>
              <Skeleton className="h-[110px] w-full border-2 border-black dark:border-white rounded-none" />
            </StackedWrapper>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StackedWrapper stretch>
            <Card className="border-t-4 border-t-yellow-400 border-x-2 border-b-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader className="pb-2 flex-row justify-between items-start">
                <CardTitle className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">Total Revenue</CardTitle>
                <span className="font-mono text-xs text-neutral-400 font-bold">+</span>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-black text-black dark:text-white tabular-nums">
                  {Number(summary.data?.totalRevenue ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
                  Smallest Currency Unit
                </p>
              </CardContent>
            </Card>
          </StackedWrapper>

          <StackedWrapper stretch>
            <Card className="border-t-4 border-t-[#ff00ff] border-x-2 border-b-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader className="pb-2 flex-row justify-between items-start">
                <CardTitle className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">Total Events</CardTitle>
                <span className="font-mono text-xs text-neutral-400 font-bold">+</span>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-black text-black dark:text-white tabular-nums">
                  {Number(summary.data?.totalEvents ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
                  Metered SDK Events
                </p>
              </CardContent>
            </Card>
          </StackedWrapper>

          <StackedWrapper stretch>
            <Card className="border-t-4 border-t-[#38bdf8] border-x-2 border-b-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader className="pb-2 flex-row justify-between items-start">
                <CardTitle className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">Total Credits</CardTitle>
                <span className="font-mono text-xs text-neutral-400 font-bold">+</span>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-black text-black dark:text-white tabular-nums">
                  {Number(summary.data?.totalCredits ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
                  Smallest Currency Unit
                </p>
              </CardContent>
            </Card>
          </StackedWrapper>
        </div>
      )}

      {usage.loading ? (
        <StackedWrapper>
          <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
        </StackedWrapper>
      ) : (
        <StackedWrapper>
          <UsageOverTime data={usage.data ?? []} />
        </StackedWrapper>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StackedWrapper stretch>
          <EventList compact showViewMore mode={modeParam} />
        </StackedWrapper>
        <StackedWrapper stretch>
          <WebhookList compact role={modeParam} />
        </StackedWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div />
        {payments.loading ? (
          <StackedWrapper stretch>
            <Skeleton className="h-[300px] w-full border-2 border-black dark:border-white rounded-none" />
          </StackedWrapper>
        ) : (
          <StackedWrapper stretch>
            <PaymentHistory data={payments.data ?? []} />
          </StackedWrapper>
        )}
      </div>
    </div>
  )
}
