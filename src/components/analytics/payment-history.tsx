"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import type { AggregationRow } from "@scrawn/core"
import type { ChartConfig } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  amount: {
    label: "Payments",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function PaymentHistory({ data }: { data: Array<AggregationRow> }) {
  const chartData = data
    .filter((d) => d.groupValue != null)
    .map((d) => ({
      date: d.groupValue!,
      amount: Number(d.aggValue),
    }))

  if (!chartData.length) {
    return (
      <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            PAYMENT HISTORY
          </CardTitle>
          <CardDescription>
            CREDITS COLLECTED (SMALLEST CURRENCY UNIT)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            NO DATA LOGGED /// SECURE THE BAG
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          PAYMENT HISTORY
        </CardTitle>
        <CardDescription>CREDITS COLLECTED (SMALLEST CURRENCY UNIT)</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeDasharray="3 3"
              className="opacity-20"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v?.slice(0, 10) ?? ""}
              className="fill-current text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                />
              }
            />
            <Area
              dataKey="amount"
              type="monotone"
              fill="currentColor"
              fillOpacity={0.1}
              stroke="currentColor"
              strokeWidth={2}
              className="text-black dark:text-white"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
