import { count as analyticsCount, desc, sum } from "@scrawn/analytics"
import { createServerFn } from "@tanstack/react-start"
import { analytics } from "./scrawn"
import { db } from "./db"
import { user } from "@/db/schema"
import { count } from "drizzle-orm"

const SCRAWN_HTTP_URL = process.env.SCRAWN_HTTP_URL || "http://localhost:8070"
const SCRAWN_KEY = process.env.SCRAWN_KEY as string

function validator<T>(): { (): T; (value: unknown): T } {
  return ((input: unknown) => input as T) as { (): T; (value: unknown): T }
}

export const checkUsersExist = createServerFn({ method: "GET" }).handler(async () => {
  const [result] = await db.select({ count: count() }).from(user)
  return { exists: (result?.count ?? 0) > 0 }
})

export const createAdminUser = createServerFn({ method: "POST" })
  .inputValidator(validator<{ name: string; email: string; password: string }>())
  .handler(async (ctx) => {
    const existing = await db.select({ count: count() }).from(user)
    if ((existing[0]?.count ?? 0) > 0) {
      return { error: "An admin user already exists" }
    }
    const { auth } = await import("./auth")
    await auth.api.signUpEmail({ body: { name: ctx.data.name, email: ctx.data.email, password: ctx.data.password } })
    return { success: true }
  })

export const getBackendConfig = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(`${SCRAWN_HTTP_URL}/api/v1/internals/config`, {
    headers: { Authorization: `Bearer ${SCRAWN_KEY}` },
  })
  if (!res.ok) return { configured: false }
  return res.json() as Promise<{ configured: boolean; dodo_product_id?: string }>
})

export const submitOnboarding = createServerFn({ method: "POST" })
  .inputValidator(
    validator<{
      dodoLiveApiKey: string
      dodoTestApiKey: string
      dodoProductId: string
      dodoWebhookSecret: string
      currency: string
      redirectUrl: string
    }>()
  )
  .handler(async (ctx) => {
    const res = await fetch(`${SCRAWN_HTTP_URL}/api/v1/internals/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SCRAWN_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crons: ["0 0 * * *"],
        webhookUrl: "",
        ...ctx.data,
      }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { error: body.error || "Failed to save configuration" }
    }
    return { success: true }
  })

export const getUsageOverTime = createServerFn({ method: "GET" }).handler(
  async () => {
    const f = analytics.query.sdkEvent.fields
    const result = await analytics.query.sdkEvent
      .aggregate(sum(f.debitAmount))
      .groupBy(f.reportedTimestamp)
      .orderBy(desc(f.reportedTimestamp))
      .limit(30)
      .execute()
    return result.rows
      .reverse()
      .map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  }
)

export const getTopUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    const f = analytics.query.sdkEvent.fields
    const result = await analytics.query.sdkEvent
      .aggregate(sum(f.debitAmount))
      .groupBy(f.userId)
      .orderBy(desc(f.debitAmount))
      .limit(10)
      .execute()
    return result.rows.map((r) => ({
      groupValue: r.groupValue,
      aggValue: r.aggValue,
    }))
  }
)

export const getEventTypeDistribution = createServerFn({
  method: "GET",
}).handler(async () => {
  const f = analytics.query.sdkEvent.fields
  const result = await analytics.query.sdkEvent
    .aggregate(analyticsCount())
    .groupBy(f.eventType)
    .execute()
  return result.rows.map((r) => ({
    groupValue: r.groupValue,
    aggValue: r.aggValue,
  }))
})

export const getAiTokenUsage = createServerFn({ method: "GET" }).handler(
  async () => {
    const f = analytics.query.aiToken.fields
    const input = await analytics.query.aiToken
      .aggregate(sum(f.inputDebitAmount))
      .groupBy(f.model)
      .execute()
    const output = await analytics.query.aiToken
      .aggregate(sum(f.outputDebitAmount))
      .groupBy(f.model)
      .execute()
    return {
      input: input.rows.map((r) => ({
        groupValue: r.groupValue,
        aggValue: r.aggValue,
      })),
      output: output.rows.map((r) => ({
        groupValue: r.groupValue,
        aggValue: r.aggValue,
      })),
    }
  }
)

export const getPaymentHistory = createServerFn({ method: "GET" }).handler(
  async () => {
    const f = analytics.query.payment.fields
    const result = await analytics.query.payment
      .aggregate(sum(f.creditAmount))
      .groupBy(f.reportedTimestamp)
      .orderBy(desc(f.reportedTimestamp))
      .limit(30)
      .execute()
    return result.rows
      .reverse()
      .map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  }
)

export const getDashboardSummary = createServerFn({ method: "GET" }).handler(
  async () => {
    const sf = analytics.query.sdkEvent.fields
    const pf = analytics.query.payment.fields

    const [totalDebit, eventCount, totalCredits] = await Promise.all([
      analytics.query.sdkEvent.aggregate(sum(sf.debitAmount)).execute(),
      analytics.query.sdkEvent.aggregate(analyticsCount()).execute(),
      analytics.query.payment.aggregate(sum(pf.creditAmount)).execute(),
    ])

    return {
      totalRevenue: totalDebit.rows[0]?.aggValue ?? "0",
      totalEvents: eventCount.rows[0]?.aggValue ?? "0",
      totalCredits: totalCredits.rows[0]?.aggValue ?? "0",
    }
  }
)

async function apiGet(path: string) {
  const res = await fetch(`${SCRAWN_HTTP_URL}${path}`, {
    headers: { Authorization: `Bearer ${SCRAWN_KEY}` },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${SCRAWN_HTTP_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SCRAWN_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

async function apiDelete(path: string) {
  const res = await fetch(`${SCRAWN_HTTP_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${SCRAWN_KEY}` },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

// API Keys
export const listApiKeys = createServerFn({ method: "GET" }).handler(async () => apiGet("/api/v1/api-keys"))

export const createApiKey = createServerFn({ method: "POST" })
  .inputValidator(validator<{ name: string; role: "test" | "production"; expiresIn: number; webhookUrl?: string }>())
  .handler(async (ctx) => apiPost("/api/v1/api-keys", ctx.data))

export const revokeApiKey = createServerFn({ method: "POST" })
  .inputValidator(validator<{ id: string }>())
  .handler(async (ctx) => apiDelete(`/api/v1/api-keys/${ctx.data.id}`))

// Tags
export const listTags = createServerFn({ method: "GET" }).handler(async () => apiGet("/api/v1/tags"))

export const createTag = createServerFn({ method: "POST" })
  .inputValidator(validator<{ key: string; amount: number }>())
  .handler(async (ctx) => apiPost("/api/v1/tags", ctx.data))

export const deleteTag = createServerFn({ method: "POST" })
  .inputValidator(validator<{ key: string }>())
  .handler(async (ctx) => apiDelete(`/api/v1/tags/${ctx.data.key}`))

// Expressions
export const listExpressions = createServerFn({ method: "GET" }).handler(async () => apiGet("/api/v1/expressions"))

export const createExpression = createServerFn({ method: "POST" })
  .inputValidator(validator<{ key: string; expr: string }>())
  .handler(async (ctx) => apiPost("/api/v1/expressions", ctx.data))

export const deleteExpression = createServerFn({ method: "POST" })
  .inputValidator(validator<{ key: string }>())
  .handler(async (ctx) => apiDelete(`/api/v1/expressions/${ctx.data.key}`))

// Webhook deliveries
export const listDeliveries = createServerFn({ method: "GET" })
  .inputValidator(validator<{ apiKeyId?: string; limit?: number; offset?: number }>())
  .handler(async (ctx) => {
    const params = new URLSearchParams()
    if (ctx.data.apiKeyId) params.set("apiKeyId", ctx.data.apiKeyId)
    if (ctx.data.limit) params.set("limit", String(ctx.data.limit))
    if (ctx.data.offset) params.set("offset", String(ctx.data.offset))
    return apiGet(`/api/v1/internals/webhook-deliveries?${params}`)
  })

// Send test webhook
export const sendTestWebhook = createServerFn({ method: "POST" })
  .inputValidator(validator<{ apiKeyId: string }>())
  .handler(async (ctx) => apiPost("/api/v1/internals/webhook-endpoint/send-test", ctx.data))

// Set webhook URL for an API key (dashboard key can set for any key)
export const setWebhookUrl = createServerFn({ method: "POST" })
  .inputValidator(validator<{ apiKeyId: string; url: string }>())
  .handler(async (ctx) => apiPost("/api/v1/internals/webhook-endpoint", ctx.data))
