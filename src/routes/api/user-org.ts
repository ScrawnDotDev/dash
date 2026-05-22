import { createFileRoute } from "@tanstack/react-router"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userOrganizationLinks } from "@/db/schema"
import { eq } from "drizzle-orm"

export const Route = createFileRoute("/api/user-org")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) {
          return new Response(JSON.stringify({ hasOrg: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        }

        const existing = await db
          .select()
          .from(userOrganizationLinks)
          .where(eq(userOrganizationLinks.userId, session.user.id))
          .limit(1)

        return new Response(
          JSON.stringify({
            hasOrg: existing.length > 0,
            organization: existing[0] || null,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      },
    },
  },
})
