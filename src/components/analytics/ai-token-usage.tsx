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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  inputTokens: {
    label: "Input Tokens",
    color: "var(--chart-1)",
  },
  outputTokens: {
    label: "Output Tokens",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const formatYAxis = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`
  return `${value}`
}

export function AiTokenUsage({
  data,
}: {
  data: {
    input: Array<AggregationRow>
    output: Array<AggregationRow>
  }
}) {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 1500)
    return () => clearTimeout(timer)
  }, [])

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
    inputTokens: inputMap.get(model) ?? 0,
    outputTokens: outputMap.get(model) ?? 0,
  }))

  if (!chartData.length) {
    return (
      <Card className="h-full flex flex-col border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <CardHeader className="border-b-2 border-black dark:border-white pb-3">
          <CardTitle className="text-black dark:text-white">
            AI TOKEN USAGE
          </CardTitle>
          <CardDescription>TOKEN CONSUMPTION BY MODEL</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col justify-between relative overflow-hidden">
          <div className="relative w-full h-[160px] border-2 border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(0,0,0,0.03)_8px,rgba(0,0,0,0.03)_16px)] dark:bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.02)_8px,rgba(255,255,255,0.02)_16px)] flex items-center justify-center">
            <div className="absolute w-[120%] rotate-[-5deg] border-y-4 border-black bg-yellow-400 py-3.5 text-center font-mono text-xs md:text-sm font-black tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-yellow-500 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              /// NO DATA LOGGED /// START METERING ///
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader className="border-b-2 border-black dark:border-white pb-3">
        <CardTitle className="text-black dark:text-white">
          AI TOKEN USAGE
        </CardTitle>
        <CardDescription>TOKEN CONSUMPTION BY MODEL</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col justify-between">
        <ChartContainer
          config={chartConfig}
          className="flex-1 min-h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 12, bottom: 4 }}
            barGap={6}
            barCategoryGap="30%"
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
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
              dataKey="inputTokens"
              fill="#eab308"
              stroke="currentColor"
              strokeWidth={2}
              radius={0}
              className="text-black dark:text-white"
              isAnimationActive={animate}
            />
            <Bar
              dataKey="outputTokens"
              fill="#ef4444"
              stroke="currentColor"
              strokeWidth={2}
              radius={0}
              className="text-black dark:text-white"
              isAnimationActive={animate}
            />
          </BarChart>
        </ChartContainer>
        <p className="mt-3 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
          Token counts (input / output per model)
        </p>
      </CardContent>
    </Card>
  )
}
