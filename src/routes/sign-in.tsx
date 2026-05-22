import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export const Route = createFileRoute("/sign-in")({ component: SignIn })

function SignIn() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!session || isPending) return

    fetch("/api/user-org")
      .then((res) => res.json())
      .then((data) => {
        navigate({
          to: data.hasOrg ? "/dashboard" : "/onboarding",
          replace: true,
        })
      })
      .catch(() => {
        navigate({ to: "/onboarding", replace: true })
      })
  }, [session, isPending, navigate])

  if (isPending || session) return null

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-medium">Sign In</h1>
        <Button
          onClick={() => authClient.signIn.social({ provider: "github" })}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  )
}
