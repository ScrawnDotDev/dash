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
    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })
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
    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })
    if (signInError) {
      setError(signInError.message || "Account created but sign-in failed")
      setLoading(false)
      return
    }
  }

  if (mode === "setup") {
    return (
    <div className="relative flex min-h-svh items-center justify-center p-6">
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

        <form
          onSubmit={handleSetup}
          className="z-10 flex w-full max-w-sm flex-col gap-4 border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        >
          <h1 className="w-max border-2 border-black bg-yellow-400 px-4 py-2 font-mono text-3xl font-black tracking-widest text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-500">
            CREATE ADMIN
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            FIRST-TIME SETUP /// GET IN THERE.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="NAME"
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL"
            required
            className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            required
            minLength={8}
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
            className="mt-4 border-4 bg-[#ff00ff] py-6 text-xl hover:bg-black hover:text-[#ff00ff]"
          >
            {loading ? "CREATING..." : "SETUP ADMIN"}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center p-6">
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

      <form
        onSubmit={handleSignIn}
        className="z-10 flex w-full max-w-sm flex-col gap-4 border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
      >
        <h1 className="mb-4 w-max border-2 border-black bg-yellow-400 px-4 py-2 font-mono text-3xl font-black tracking-widest text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-500">
          SIGN IN
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL"
          className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PASSWORD"
          className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
          required
          minLength={8}
        />
        {error && (
          <p className="w-max bg-black px-2 py-1 font-mono text-sm font-bold text-red-600">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="mt-4 border-4 bg-black py-6 text-xl text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
        >
          {loading ? "SIGNING IN..." : "ENTER"}
        </Button>
      </form>
    </div>
  )
}
