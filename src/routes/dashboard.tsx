import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { getBackendConfig } from "@/lib/scrawn-server"
import { RefreshContext, useIsRefreshing } from "@/lib/useCache"

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout })

const navItems = [
  { path: "/dashboard", label: "Overview", icon: "□" },
  { path: "/dashboard/api-keys", label: "API Keys", icon: "🔑" },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙" },
  { path: "/dashboard/webhooks", label: "Webhooks", icon: "↗" },
]

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session, isPending } = authClient.useSession()
  const [refreshVersion, setRefreshVersion] = useState(0)
  const refreshing = useIsRefreshing()

  useEffect(() => {
    if (!session || isPending) return
    getBackendConfig().then((res) => {
      if (!res.configured) {
        navigate({ to: "/onboarding", replace: true })
      }
    })
  }, [session, isPending])

  if (isPending) return null
  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  return (
    <RefreshContext.Provider value={{ version: refreshVersion, triggerRefresh: () => setRefreshVersion((v) => v + 1) }}>
      <div className="relative flex min-h-svh">
        {refreshing && (
          <div className="fixed left-0 top-0 z-50 h-0.5 w-full overflow-hidden bg-transparent">
            <div className="h-full w-full animate-pulse bg-yellow-500" style={{ animationDuration: "1.5s" }} />
          </div>
        )}
        <aside className="flex w-56 flex-col border-r border-gray-800 bg-black p-4">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-lg font-bold">Scrawn</span>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setRefreshVersion((v) => v + 1)}
            disabled={refreshing}
            className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Refresh All
          </button>
          <div className="mt-auto border-t border-gray-800 pt-4">
            <p className="truncate text-xs text-gray-500">{session.user?.email}</p>
            <button
              onClick={() => authClient.signOut().then(() => navigate({ to: "/sign-in" }))}
              className="mt-2 text-xs text-gray-500 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </RefreshContext.Provider>
  )
}
