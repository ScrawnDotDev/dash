import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { getBackendConfig, submitOnboarding } from "@/lib/scrawn-server"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  EyeOff,
  Lock,
  Key,
  Coins,
  Globe,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

export const Route = createFileRoute("/onboarding")({ component: Onboarding })

const stepDetails = [
  {
    tag: "// STEP 01 - PRODUCTION AUTH",
    title: "LIVE API KEY",
    desc: "Your DodoPayments Live API Key connects Scrawn to the production environment to authenticate secure billing and transaction operations.",
  },
  {
    tag: "// STEP 02 - SANDBOX ENVIRONMENT",
    title: "TEST API KEY",
    desc: "Your DodoPayments Test API Key is used to mock checkout states, run sandbox webhooks, and simulate user pricing upgrades during local development.",
  },
  {
    tag: "// STEP 03 - RESOURCE DEFINITION",
    title: "PRODUCT ID",
    desc: "The unique identifier associated with your Scrawn usage subscriptions and pricing plans in your DodoPayments dashboard.",
  },
  {
    tag: "// STEP 04 - INTEGRITY VERIFICATION",
    title: "WEBHOOK SECRET",
    desc: "The secret webhook verification token used to sign, validate, and securely receive metered events dispatched from DodoPayments.",
  },
  {
    tag: "// STEP 05 - SETTLEMENT CONFIG",
    title: "BASE CURRENCY",
    desc: "Select the default base currency. All system revenue analytics, metered logs, and usage graphs will process and display values in this currency.",
  },
  {
    tag: "// STEP 06 - REDIRECT GATEWAY",
    title: "REDIRECT URL",
    desc: "The default endpoint URL where customers will be redirected back to after completing checkout or managing their subscriptions.",
  },
]

function Onboarding() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [step, setStep] = useState(0)
  const [dodoLiveApiKey, setDodoLiveApiKey] = useState("")
  const [dodoTestApiKey, setDodoTestApiKey] = useState("")
  const [dodoProductId, setDodoProductId] = useState("")
  const [dodoWebhookSecret, setDodoWebhookSecret] = useState("")
  const [currency, setCurrency] = useState("usd")
  const [redirectUrl, setRedirectUrl] = useState("http://localhost:3000")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [showLiveApiKey, setShowLiveApiKey] = useState(false)
  const [showTestApiKey, setShowTestApiKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  useEffect(() => {
    if (!session || isPending) return
    getBackendConfig().then((res) => {
      if (res.configured) {
        navigate({ to: "/dashboard", replace: true })
      }
    })
  }, [session, isPending, navigate])

  if (isPending) return null
  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  const currentDetails = stepDetails[step]

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (step < 5) {
      setStep(step + 1)
    } else {
      handleFinalSubmit()
    }
  }

  async function handleFinalSubmit() {
    setLoading(true)
    setError("")
    const res = await submitOnboarding({
      data: {
        dodoLiveApiKey,
        dodoTestApiKey,
        dodoProductId,
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
    <div className="relative flex min-h-svh flex-col justify-between overflow-x-hidden bg-white text-black selection:bg-yellow-400 selection:text-black dark:bg-black dark:text-white dark:selection:bg-yellow-400 dark:selection:text-black">
      {/* Background blueprint grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/potentialbackground.png')] bg-[length:1000px_auto] bg-top opacity-[0.03] md:bg-cover md:bg-center md:bg-no-repeat dark:opacity-[0.06] dark:invert" />

      {/* Decorative Crosshairs */}
      <div className="pointer-events-none absolute top-10 left-10 z-0 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>
      <div className="pointer-events-none absolute bottom-10 left-10 z-0 hidden font-mono text-xl font-black text-gray-200 md:block dark:text-gray-800">
        +
      </div>

      {/* Main split-screen container */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-12 px-6 py-12 lg:flex-row lg:items-stretch lg:justify-between">
        
        {/* Left Column: Visual schematic & Step information */}
        <div className="flex w-full flex-col justify-center items-start lg:w-[50%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start"
            >
              <div className="mb-4 inline-flex border-2 border-black bg-yellow-400 px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] dark:border-white dark:bg-yellow-500">
                {currentDetails.tag}
              </div>

              <h1 className="text-5xl font-mono font-black uppercase leading-[0.9] tracking-tighter text-black dark:text-white sm:text-6xl xl:text-7xl">
                {currentDetails.title.split(" ").slice(0, -1).join(" ")}{" "}
                <br />
                <span className="text-[#ff00ff]">
                  {currentDetails.title.split(" ").slice(-1)[0]}
                </span>
              </h1>

              <p className="mt-6 font-mono text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-md">
                {currentDetails.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Setup Form Card */}
        <div className="relative flex w-full max-w-md flex-col justify-center items-center lg:w-[45%]">
          {/* Stacked background offset card */}
          <div className="absolute -right-3 bottom-3 left-3 top-3 border-2 border-black bg-neutral-100 dark:border-white dark:bg-neutral-900" />
          
          {/* Foreground Form Card */}
          <div className="relative z-10 w-full border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            
            <form
              key="wizard-form"
              onSubmit={handleNext}
              className="flex flex-col gap-6"
            >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      <span>Configuration Progress</span>
                      <span>Step {step + 1} of 6</span>
                    </div>
                    <div className="w-full h-3 border-2 border-black bg-neutral-100 dark:border-white dark:bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#ff00ff] border-r-2 border-black dark:border-white"
                        animate={{ width: `${((step + 1) / 6) * 100}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>

                  {/* Conditional Active Step Inputs */}
                  <div className="min-h-[120px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <motion.div
                          key="step0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Dodo Live API Key
                          </label>
                          <div className="relative flex items-center">
                            <Key className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <input
                              type={showLiveApiKey ? "text" : "password"}
                              value={dodoLiveApiKey}
                              onChange={(e) => setDodoLiveApiKey(e.target.value)}
                              placeholder="XCmeKyWvG1-TTc3w.UZwYsW1fCkxnnMc5N-3GT70L-qBXZ26BwdnmBp3T9Hf3GLz5"
                              required
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-10 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:bg-yellow-50/10 dark:focus:bg-zinc-950 focus:translate-x-[1px] focus:translate-y-[1px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLiveApiKey(!showLiveApiKey)}
                              className="absolute right-3 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                            >
                              {showLiveApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Dodo Test API Key
                          </label>
                          <div className="relative flex items-center">
                            <Key className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <input
                              type={showTestApiKey ? "text" : "password"}
                              value={dodoTestApiKey}
                              onChange={(e) => setDodoTestApiKey(e.target.value)}
                              placeholder="XCmeKyWvG1-TTc3w.UZwYsW1fCkxnnMc5N-3GT70L-qBXZ26BwdnmBp3T9Hf3GLz5"
                              required
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-10 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:bg-yellow-50/10 dark:focus:bg-zinc-950 focus:translate-x-[1px] focus:translate-y-[1px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowTestApiKey(!showTestApiKey)}
                              className="absolute right-3 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                            >
                              {showTestApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Dodo Product ID
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <input
                              type="text"
                              value={dodoProductId}
                              onChange={(e) => setDodoProductId(e.target.value)}
                              placeholder="pdt_..."
                              required
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-4 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:bg-yellow-50/10 dark:focus:bg-zinc-950 focus:translate-x-[1px] focus:translate-y-[1px]"
                            />
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Dodo Webhook Secret
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <input
                              type={showWebhookSecret ? "text" : "password"}
                              value={dodoWebhookSecret}
                              onChange={(e) => setDodoWebhookSecret(e.target.value)}
                              placeholder="whsec_..."
                              required
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-10 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:bg-yellow-50/10 dark:focus:bg-zinc-950 focus:translate-x-[1px] focus:translate-y-[1px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                              className="absolute right-3 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                            >
                              {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Currency
                          </label>
                          <div className="relative flex items-center">
                            <Coins className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <select
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-4 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:translate-x-[1px] focus:translate-y-[1px]"
                            >
                              <option value="usd">USD</option>
                              <option value="eur">EUR</option>
                              <option value="gbp">GBP</option>
                              <option value="inr">INR</option>
                              <option value="jpy">JPY</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {step === 5 && (
                        <motion.div
                          key="step5"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1.5"
                        >
                          <label className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            Redirect URL
                          </label>
                          <div className="relative flex items-center">
                            <Globe className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
                            <input
                              type="url"
                              value={redirectUrl}
                              onChange={(e) => setRedirectUrl(e.target.value)}
                              placeholder="https://app.scrawn.dev"
                              required
                              className="w-full border-2 border-black bg-white dark:bg-black dark:border-white pl-10 pr-4 py-2.5 text-sm font-mono text-black dark:text-white transition-all outline-none focus:bg-yellow-50/10 dark:focus:bg-zinc-950 focus:translate-x-[1px] focus:translate-y-[1px]"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {error && (
                    <div className="border border-red-500 bg-red-50 dark:bg-red-950/20 p-3 flex gap-2.5 items-start">
                      <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                        Error: {error}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {step > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={loading}
                        className="h-12 w-12 border-2 border-black dark:border-white flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="fuchsia"
                      className="h-12 flex-1 text-sm font-mono font-black tracking-widest uppercase border-2 border-black dark:border-white flex gap-2 items-center justify-center cursor-pointer"
                    >
                      {loading ? (
                        "Processing..."
                      ) : step < 5 ? (
                        <>
                          Continue <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete Setup <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
          </div>
        </div>
      </main>
      
      {/* Empty space matching height at bottom */}
      <div className="py-6 shrink-0" />
    </div>
  )
}
