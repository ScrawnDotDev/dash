import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Scrawn — Open Source Usage-Based Billing & AI Token Metering Engine",
      },
      {
        name: "description",
        content: "Deploy Scrawn, the open-source usage-based billing engine and metered API token billing console. Easily track developer API events and integrate payment systems.",
      },
      {
        name: "og:title",
        content: "Scrawn — Open Source Usage-Based Billing & AI Token Metering Engine",
      },
      {
        name: "og:description",
        content: "Deploy Scrawn, the open-source usage-based billing engine and metered API token billing console. Easily track developer API events and integrate payment systems.",
      },
      {
        name: "og:image",
        content: "/og.jpg",
      },
      {
        name: "twitter:title",
        content: "Scrawn — Open Source Usage-Based Billing & AI Token Metering Engine",
      },
      {
        name: "twitter:description",
        content: "Deploy Scrawn, the open-source usage-based billing engine and metered API token billing console. Easily track developer API events and integrate payment systems.",
      },
      {
        name: "twitter:image",
        content: "/og.jpg",
      },
    ],
  }),
  component: Home,
})

function Home() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    navigate({ to: session ? "/dashboard" : "/sign-in", replace: true })
  }, [session, isPending, navigate])

  return null
}
