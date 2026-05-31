import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null
  if (session) {
    navigate({ to: "/dashboard", replace: true })
    return null
  }
  navigate({ to: "/sign-in", replace: true })
  return null
}
