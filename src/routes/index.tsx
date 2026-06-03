import { createFileRoute, useNavigate } from "@tanstack/react-router"
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
        content: "/og.svg",
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
        content: "/og.svg",
      },
    ],
  }),
  component: Home,
})

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
