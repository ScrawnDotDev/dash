import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["user:email"],
      mapProfileToUser(profile) {
        return {
          email: profile.email || `${profile.login}@github.com`,
          name: profile.name || profile.login,
          image: profile.avatar_url,
        }
      },
    },
  },
  plugins: [tanstackStartCookies()],
})
