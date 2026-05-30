import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { getBackendConfig, submitOnboarding } from "@/lib/scrawn-server"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/onboarding")({ component: Onboarding })

function Onboarding() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [dodoLiveApiKey, setDodoLiveApiKey] = useState("")
  const [dodoTestApiKey, setDodoTestApiKey] = useState("")
  const [dodoProductId, setDodoProductId] = useState("")
  const [dodoWebhookSecret, setDodoWebhookSecret] = useState("")
  const [currency, setCurrency] = useState("usd")
  const [redirectUrl, setRedirectUrl] = useState("http://localhost:3000")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session || isPending) return
    getBackendConfig().then((res) => {
      if (res.configured) {
        navigate({ to: "/dashboard", replace: true })
      }
    })
  }, [session, isPending])

  if (isPending) return null
  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await submitOnboarding({
      data: { dodoLiveApiKey, dodoTestApiKey, dodoProductId, dodoWebhookSecret, currency, redirectUrl },
    })
    if (res.error) {
      setError(res.error)
      setLoading(false)
      return
    }
    navigate({ to: "/dashboard", replace: true })
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="mb-2 text-3xl font-medium">Configure Scrawn</h1>
      <p className="mb-8 text-sm text-gray-400">
        Connect your Dodo Payments account to get started.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium">Dodo Live API Key</label>
        <input
          type="password" value={dodoLiveApiKey} onChange={(e) => setDodoLiveApiKey(e.target.value)}
          placeholder="scrn_live_..." required
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        />

        <label className="text-sm font-medium">Dodo Test API Key</label>
        <input
          type="password" value={dodoTestApiKey} onChange={(e) => setDodoTestApiKey(e.target.value)}
          placeholder="scrn_test_..." required
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        />

        <label className="text-sm font-medium">Dodo Product ID</label>
        <input
          type="text" value={dodoProductId} onChange={(e) => setDodoProductId(e.target.value)}
          placeholder="pdt_..." required
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        />

        <label className="text-sm font-medium">Dodo Webhook Secret</label>
        <input
          type="password" value={dodoWebhookSecret} onChange={(e) => setDodoWebhookSecret(e.target.value)}
          placeholder="whsec_..." required
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        />

        <label className="text-sm font-medium">Currency</label>
        <select
          value={currency} onChange={(e) => setCurrency(e.target.value)}
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
          <option value="inr">INR</option>
          <option value="jpy">JPY</option>
        </select>

        <label className="text-sm font-medium">Redirect URL</label>
        <input
          type="url" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)}
          placeholder="https://app.scrawn.dev" required
          className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Saving..." : "Save & Continue"}
        </Button>
      </form>
    </div>
  )
}
