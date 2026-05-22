import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export const Route = createFileRoute("/onboarding")({ component: Onboarding })

function Onboarding() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isPending) return null

  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (res.status === 400) {
        navigate({ to: "/dashboard", replace: true })
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Something went wrong")
        return
      }

      navigate({ to: "/dashboard" })
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-medium">Welcome!</h1>
        <p className="text-sm text-gray-400">
          Enter your organization name to get started.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization name"
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !name}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create organization"}
        </button>
      </form>
    </div>
  )
}
