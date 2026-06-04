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
  const [dodoLiveProductId, setDodoLiveProductId] = useState("")
  const [dodoTestProductId, setDodoTestProductId] = useState("")
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
      data: {
        dodoLiveApiKey,
        dodoTestApiKey,
        dodoLiveProductId,
        dodoTestProductId,
        dodoWebhookSecret,
        currency,
        redirectUrl,
      },
    })
    if (res.error) {
      setError(res.error)
      setLoading(false)
      return
    }
    navigate({ to: "/dashboard", replace: true })
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/potentialbackground.png')] bg-[length:1200px_auto] bg-top opacity-90 md:bg-cover md:bg-center md:bg-no-repeat dark:opacity-10" />
      <div className="pointer-events-none absolute top-10 left-10 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>
      <div className="pointer-events-none absolute top-10 right-10 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>
      <div className="pointer-events-none absolute bottom-10 left-10 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>
      <div className="pointer-events-none absolute right-10 bottom-10 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>

      <div className="z-10 w-full max-w-lg border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <h1 className="mb-2 w-max border-2 border-black bg-yellow-400 px-4 py-2 font-mono text-3xl font-black tracking-widest text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-500">
          CONFIGURE SCRAWN
        </h1>
        <p className="mb-8 text-xs text-gray-500">
          CONNECT YOUR DODO PAYMENTS ACCOUNT /// GET PAID.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-black dark:text-white">
            DODO LIVE API KEY
          </label>
          <input
            type="password"
            value={dodoLiveApiKey}
            onChange={(e) => setDodoLiveApiKey(e.target.value)}
            placeholder="scrn_live_..."
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            DODO TEST API KEY
          </label>
          <input
            type="password"
            value={dodoTestApiKey}
            onChange={(e) => setDodoTestApiKey(e.target.value)}
            placeholder="scrn_test_..."
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            DODO LIVE PRODUCT ID
          </label>
          <input
            type="text"
            value={dodoLiveProductId}
            onChange={(e) => setDodoLiveProductId(e.target.value)}
            placeholder="pdt_..."
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            DODO TEST PRODUCT ID
          </label>
          <input
            type="text"
            value={dodoTestProductId}
            onChange={(e) => setDodoTestProductId(e.target.value)}
            placeholder="pdt_..."
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            DODO WEBHOOK SECRET
          </label>
          <input
            type="password"
            value={dodoWebhookSecret}
            onChange={(e) => setDodoWebhookSecret(e.target.value)}
            placeholder="whsec_..."
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            CURRENCY
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="inr">INR</option>
            <option value="jpy">JPY</option>
          </select>

          <label className="mt-2 text-sm font-medium text-black dark:text-white">
            REDIRECT URL
          </label>
          <input
            type="url"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://app.scrawn.dev"
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />

          {error && (
            <p className="w-max bg-black px-2 py-1 font-mono text-sm font-bold text-red-600">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="mt-6 border-4 bg-[#ff00ff] py-6 text-xl hover:bg-black hover:text-[#ff00ff]"
          >
            {loading ? "SAVING..." : "SAVE & CONTINUE"}
          </Button>
        </form>
      </div>
    </div>
  )
}
