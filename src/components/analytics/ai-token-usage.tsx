"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import type { AggregationRow } from "@scrawn/core"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  inputCost: {
    label: "Input Cost",
    color: "var(--chart-1)",
  },
  outputCost: {
    label: "Output Cost",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function AiTokenUsage({
  data,
}: {
  data: {
    input: Array<AggregationRow>
    output: Array<AggregationRow>
  }
}) {
  const inputMap = new Map(
    data.input.map((d) => [d.groupValue, Number(d.aggValue) / 100])
  )
  const outputMap = new Map(
    data.output.map((d) => [d.groupValue, Number(d.aggValue) / 100])
  )
  const allModels = [
    ...new Set([...inputMap.keys(), ...outputMap.keys()]),
  ].filter(Boolean)

  const chartData = allModels.map((model) => ({
    model,
    inputCost: inputMap.get(model) ?? 0,
    outputCost: outputMap.get(model) ?? 0,
  }))

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Token Usage</CardTitle>
          <CardDescription>Cost by model</CardDescription>
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
        <CardTitle>AI Token Usage</CardTitle>
        <CardDescription>Cost by model</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="model"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="inputCost"
              fill="var(--color-inputCost)"
              radius={0}
              barSize={20}
            />
            <Bar
              dataKey="outputCost"
              fill="var(--color-outputCost)"
              radius={0}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
