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
