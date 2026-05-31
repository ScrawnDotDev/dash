import {
  createFileRoute,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, Key, Webhook, Settings, LogOut, RefreshCw } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { getBackendConfig } from "@/lib/scrawn-server"
import {
  RefreshContext,
  useIsRefreshing,
  useOnlineStatus,
  hasAnyCachedData,
} from "@/lib/useCache"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
})

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { path: "/dashboard/webhooks", label: "Webhooks", icon: Webhook },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
]

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending } = authClient.useSession()
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const refreshing = useIsRefreshing()
  const online = useOnlineStatus()

  const triggerRefresh = useMemo(() => () => setRefreshVersion((v) => v + 1), [])
  const refreshValue = useMemo(
    () => ({ version: refreshVersion, triggerRefresh }),
    [refreshVersion, triggerRefresh],
  )

  useEffect(() => {
    if (!session || isPending) return
    getBackendConfig()
      .then((res) => {
        if (!res.configured) {
          navigate({ to: "/onboarding", replace: true })
        }
      })
      .catch(() => {})
  }, [session, isPending])

  // Re-fetch all data when browser comes back online
  useEffect(() => {
    window.addEventListener("online", triggerRefresh)
    return () => window.removeEventListener("online", triggerRefresh)
  }, [triggerRefresh])

  if (isPending) return null
  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  return (
    <RefreshContext.Provider value={refreshValue}>
      <div className="relative flex h-svh">
        {refreshing && (
          <div className="fixed top-0 left-0 z-50 h-0.5 w-full overflow-hidden bg-transparent">
            <div
              className="h-full w-full animate-pulse bg-yellow-500"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
        )}
        <motion.aside
          initial={{ width: "4rem" }}
          animate={{ width: expanded ? "14rem" : "4rem" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          className="sticky top-0 z-40 flex h-svh flex-col overflow-y-auto overflow-x-hidden border-r-2 border-black bg-white dark:border-white dark:bg-black"
        >
          <div className="flex h-16 shrink-0 items-center px-4">
            <img
              src="/Scrawn_Logo.png"
              alt="Scrawn Logo"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <motion.span
              initial={{ opacity: 0, display: "none" }}
              animate={{
                opacity: expanded ? 1 : 0,
                display: expanded ? "block" : "none",
              }}
              transition={{ duration: 0.2 }}
              className="ml-3 font-mono text-xl font-black tracking-widest text-black uppercase dark:text-white"
            >
              SCRAWN
            </motion.span>
          </div>
          <nav className="mt-4 flex flex-col gap-2 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className={`group flex h-10 shrink-0 items-center overflow-hidden rounded-none text-left text-sm font-medium transition-all ${
                    isActive
                      ? "border-2 border-black bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "border-2 border-transparent text-gray-500 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
                  }`}
                >
                  <div className="flex w-11 shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <motion.span
                    initial={{ opacity: 0, display: "none" }}
                    animate={{
                      opacity: expanded ? 1 : 0,
                      display: expanded ? "block" : "none",
                    }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </button>
              )
            })}
          </nav>
          
          <div className="mt-auto p-2">
            <motion.div
              initial={{ opacity: 0, display: "none" }}
              animate={{
                opacity: expanded ? 1 : 0,
                display: expanded ? "block" : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-2 truncate px-2 text-[10px] font-bold text-gray-500">
                {session.user?.email}
              </p>
            </motion.div>
            
            <button
              onClick={() => setRefreshVersion((v) => v + 1)}
              disabled={refreshing}
              className="group flex h-10 w-full shrink-0 items-center overflow-hidden border-2 border-black bg-white text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-none"
            >
              <div className="flex w-11 shrink-0 items-center justify-center">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-red-500" : ""}`} />
              </div>
              <motion.span
                initial={{ opacity: 0, display: "none" }}
                animate={{
                  opacity: expanded ? 1 : 0,
                  display: expanded ? "block" : "none",
                }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                REFRESH
              </motion.span>
            </button>

            <button
              onClick={() =>
                authClient.signOut().then(() => navigate({ to: "/sign-in" }))
              }
              className="mt-2 group flex h-10 w-full shrink-0 items-center overflow-hidden border-2 border-black bg-red-500 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-none"
            >
              <div className="flex w-11 shrink-0 items-center justify-center">
                <LogOut className="h-4 w-4" />
              </div>
              <motion.span
                initial={{ opacity: 0, display: "none" }}
                animate={{
                  opacity: expanded ? 1 : 0,
                  display: expanded ? "block" : "none",
                }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                NUKE SESSION
              </motion.span>
            </button>
          </div>
        </motion.aside>
        <main className="relative flex-1 overflow-auto p-6">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/potentialbackground.png')] bg-[length:1200px_auto] bg-top opacity-90 md:bg-cover md:bg-center md:bg-no-repeat dark:opacity-10" />
          {/* Decorative Crosshairs */}
          <div className="pointer-events-none absolute top-10 left-10 z-0 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
            +
          </div>
          <div className="pointer-events-none absolute top-10 right-10 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
            +
          </div>

          <div className="relative z-10">
            {!online && (
              <div className="mb-4 flex items-center gap-3 border-2 border-black bg-red-500 px-4 py-2.5 font-mono text-xs font-black text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span>
                  {hasAnyCachedData()
                    ? "Offline — Using Cache — Reconnecting..."
                    : "Offline — No Cache"}
                </span>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </RefreshContext.Provider>
  )
}
