"use client"

import { useMemo, useState, useEffect } from "react"
import { Pie, PieChart } from "recharts"

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

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function EventDistribution({ data }: { data: Array<AggregationRow> }) {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const { chartData, chartConfig, total } = useMemo(() => {
    const items = data.map((d, i) => ({
      name: d.groupValue ?? "unknown",
      count: Number(d.aggValue),
      fill: COLORS[i % COLORS.length],
    }))
    const config: ChartConfig = {}
    for (let i = 0; i < items.length; i++) {
      config[items[i].name] = {
        label: items[i].name,
        color: COLORS[i % COLORS.length],
      }
    }
    const sum = items.reduce((acc, d) => acc + d.count, 0)
    return { chartData: items, chartConfig: config, total: sum }
  }, [data])

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Distribution</CardTitle>
          <CardDescription>By event type</CardDescription>
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
        <CardTitle>Event Distribution</CardTitle>
        <CardDescription>{total.toLocaleString()} events total</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              isAnimationActive={animate}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
