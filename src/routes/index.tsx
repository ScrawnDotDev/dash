import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-medium">Scrawn</h1>
      <p className="text-sm text-gray-400">Usage-based billing for AI applications</p>
      <Button onClick={() => navigate({ to: "/sign-in" })}>
        Sign In
      </Button>
    </div>
  )
}
