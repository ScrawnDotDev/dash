import { Scrawn } from "@scrawn/core"
import { Analytics } from "@scrawn/analytics"

export const biller = new Scrawn({
  apiKey: process.env.SCRAWN_KEY as `scrn_${string}`,
  baseURL: process.env.SCRAWN_BASE_URL || "http://localhost:8069",
  secure: false,
})

export const analytics = new Analytics(biller)
