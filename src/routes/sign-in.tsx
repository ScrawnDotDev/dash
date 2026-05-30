import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { checkUsersExist, createAdminUser } from "@/lib/scrawn-server"

export const Route = createFileRoute("/sign-in")({ component: SignIn })

function SignIn() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [mode, setMode] = useState<"loading" | "sign-in" | "setup">("loading")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkUsersExist().then((res) => {
      setMode(res.exists ? "sign-in" : "setup")
    })
  }, [])

  if (isPending) return null
  if (session) {
    navigate({ to: "/dashboard", replace: true })
    return null
  }
  if (mode === "loading") return null

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error: signInError } = await authClient.signIn.email({ email, password })
    if (signInError) {
      setError(signInError.message || signInError.code || "Invalid credentials")
      setLoading(false)
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await createAdminUser({ data: { name, email, password } })
    if (res.error) {
      setError(res.error)
      setLoading(false)
      return
    }
    const { error: signInError } = await authClient.signIn.email({ email, password })
    if (signInError) {
      setError(signInError.message || "Account created but sign-in failed")
      setLoading(false)
      return
    }
  }

  if (mode === "setup") {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <form onSubmit={handleSetup} className="flex w-full max-w-sm flex-col gap-4">
          <h1 className="text-2xl font-medium">Create Admin</h1>
          <p className="text-sm text-gray-400">First-time setup — create the admin account.</p>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name" required
            className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required
            className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required minLength={8}
            className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin & Sign In"}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <form
        onSubmit={handleSignIn}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-medium">Sign In</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
          required
          minLength={8}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
