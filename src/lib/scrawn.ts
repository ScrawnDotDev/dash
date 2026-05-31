import { scrawn } from "@scrawn/core"
import { Analytics } from "@scrawn/analytics"

export const biller = scrawn({
  apiKey: process.env.SCRAWN_KEY as `scrn_${string}`,
  baseURL: process.env.SCRAWN_BASE_URL || "http://localhost:8069",
  secure: false,
})

/** Create a fresh Analytics instance per call so builders don't share state */
export function createAnalytics(): Analytics {
  return new Analytics(biller)
}
