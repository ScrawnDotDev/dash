"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TopUsers({ data }: { data: Array<AggregationRow> }) {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const chartData = data.map((d) => ({
    user: d.groupValue?.slice(0, 12) ?? "unknown",
    amount: Number(d.aggValue) / 100,
  }))

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
          <CardDescription>Highest spenders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Users</CardTitle>
        <CardDescription>Highest spenders</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="user"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={0}
              barSize={16}
              isAnimationActive={animate}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
