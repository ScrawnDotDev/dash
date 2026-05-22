import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard")({ component: Dashboard })

function Dashboard() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <p className="text-sm text-gray-400">Welcome, {session.user.name}!</p>
      <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
    </div>
  )
}
