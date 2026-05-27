import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/sign-in")({ component: SignIn })

function SignIn() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isPending) return null

  if (session) {
    navigate({ to: "/dashboard", replace: true })
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "sign-up") {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (signUpError) {
          setError(
            signUpError.message || signUpError.code || "Something went wrong"
          )
          return
        }
        setMode("sign-in")
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        })
        if (signInError) {
          setError(
            signInError.message || signInError.code || "Something went wrong"
          )
          return
        }
      }
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
        <h1 className="text-2xl font-medium">
          {mode === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>

        {mode === "sign-up" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
            required
          />
        )}

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
          {loading
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign In"
              : "Sign Up"}
        </Button>

        <p className="text-center text-sm text-gray-400">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("sign-up")
                  setError("")
                }}
                className="text-white underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("sign-in")
                  setError("")
                }}
                className="text-white underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}
