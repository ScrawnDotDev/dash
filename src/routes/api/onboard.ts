import { createFileRoute } from "@tanstack/react-router"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userOrganizationLinks } from "@/db/schema"
import { eq } from "drizzle-orm"

export const Route = createFileRoute("/api/onboard")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json()

        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          })
        }

        const existing = await db
          .select()
          .from(userOrganizationLinks)
          .where(eq(userOrganizationLinks.userId, session.user.id))
          .limit(1)

        if (existing.length > 0) {
          return new Response(JSON.stringify({ error: "Already onboarded" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
        }

        const backendUrl = process.env.CLOUD_BACKEND_URL || "http://localhost:8070"

        const orgResponse = await fetch(`${backendUrl}/api/v1/organizations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: body.name }),
        })

        if (!orgResponse.ok) {
          return new Response(JSON.stringify({ error: "Failed to create organization" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        }

        const org = await orgResponse.json()

        await db.insert(userOrganizationLinks).values({
          id: crypto.randomUUID(),
          userId: session.user.id,
          organizationId: org.id,
          organizationName: org.name,
        })

        return new Response(JSON.stringify({ organizationId: org.id }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      },
    },
  },
})
