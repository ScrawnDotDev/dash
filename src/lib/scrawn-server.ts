import { count, desc, sum } from "@scrawn/analytics"
import { createServerFn } from "@tanstack/react-start"
import { analytics, biller } from "./scrawn"

function validator<T>(): { (): T; (value: unknown): T } {
  return ((input: unknown) => input as T) as { (): T; (value: unknown): T }
}

export const trackUsage = createServerFn({ method: "POST" })
  .inputValidator(validator<{ userId: string; debitAmount: number }>())
  .handler(async (ctx) => {
    await biller.basicUsageEventConsumer({
      userId: ctx.data.userId,
      debitAmount: ctx.data.debitAmount,
    })
    return { ok: true }
  })

export const getPaymentLink = createServerFn({ method: "POST" })
  .inputValidator(validator<{ userId: string }>())
  .handler(async (ctx) => {
    const link = await biller.collectPayment(ctx.data.userId)
    return { link }
  })

export const getUsageOverTime = createServerFn({ method: "GET" })
  .handler(async () => {
    const f = analytics.query.sdkEvent.fields
    const result = await analytics.query.sdkEvent
      .aggregate(sum(f.debitAmount))
      .groupBy(f.reportedTimestamp)
      .orderBy(desc(f.reportedTimestamp))
      .limit(30)
      .execute()
    return result.rows.reverse().map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  })

export const getTopUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    const f = analytics.query.sdkEvent.fields
    const result = await analytics.query.sdkEvent
      .aggregate(sum(f.debitAmount))
      .groupBy(f.userId)
      .orderBy(desc(f.debitAmount))
      .limit(10)
      .execute()
    return result.rows.map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  })

export const getEventTypeDistribution = createServerFn({ method: "GET" })
  .handler(async () => {
    const f = analytics.query.sdkEvent.fields
    const result = await analytics.query.sdkEvent
      .aggregate(count())
      .groupBy(f.eventType)
      .execute()
    return result.rows.map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  })

export const getAiTokenUsage = createServerFn({ method: "GET" })
  .handler(async () => {
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
      input: input.rows.map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue })),
      output: output.rows.map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue })),
    }
  })

export const getPaymentHistory = createServerFn({ method: "GET" })
  .handler(async () => {
    const f = analytics.query.payment.fields
    const result = await analytics.query.payment
      .aggregate(sum(f.creditAmount))
      .groupBy(f.reportedTimestamp)
      .orderBy(desc(f.reportedTimestamp))
      .limit(30)
      .execute()
    return result.rows.reverse().map((r) => ({ groupValue: r.groupValue, aggValue: r.aggValue }))
  })

export const getDashboardSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    const sf = analytics.query.sdkEvent.fields
    const pf = analytics.query.payment.fields

    const [totalDebit, eventCount, totalCredits] = await Promise.all([
      analytics.query.sdkEvent.aggregate(sum(sf.debitAmount)).execute(),
      analytics.query.sdkEvent.aggregate(count()).execute(),
      analytics.query.payment.aggregate(sum(pf.creditAmount)).execute(),
    ])

    return {
      totalRevenue: totalDebit.rows[0]?.aggValue ?? "0",
      totalEvents: eventCount.rows[0]?.aggValue ?? "0",
      totalCredits: totalCredits.rows[0]?.aggValue ?? "0",
    }
  })
