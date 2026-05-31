"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
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
    data.input
      .filter((d) => d.groupValue != null)
      .map((d) => [d.groupValue!, Number(d.aggValue)])
  )
  const outputMap = new Map(
    data.output
      .filter((d) => d.groupValue != null)
      .map((d) => [d.groupValue!, Number(d.aggValue)])
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
      <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            AI TOKEN USAGE
          </CardTitle>
          <CardDescription>COST BY MODEL</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            NO DATA LOGGED /// START METERING
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          AI TOKEN USAGE
        </CardTitle>
        <CardDescription>COST BY MODEL</CardDescription>
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
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeDasharray="3 3"
              className="opacity-20"
            />
            <XAxis
              dataKey="model"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="fill-current text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  className="rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="inputCost"
              fill="#eab308"
              stroke="currentColor"
              strokeWidth={2}
              radius={0}
              barSize={30}
              className="text-black dark:text-white"
            />
            <Bar
              dataKey="outputCost"
              fill="#ef4444"
              stroke="currentColor"
              strokeWidth={2}
              radius={0}
              barSize={30}
              className="text-black dark:text-white"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
