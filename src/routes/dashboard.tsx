import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { getBackendConfig } from "@/lib/scrawn-server"

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
    <div className="flex min-h-svh">
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
  )
}
