"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { RevenueData } from "@/types/analytics"

interface RevenueChartProps {
  data: RevenueData[]
  title?: string
  description?: string
}

export function RevenueChart({
  data,
  title = "Revenue Trends",
  description = "Monthly revenue and booking trends",
}: RevenueChartProps) {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatMonth = (value: string) => {
    const date = new Date(value + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatMonth} />
            <YAxis yAxisId="revenue" orientation="left" tickFormatter={formatCurrency} />
            <YAxis yAxisId="bookings" orientation="right" />
            <Tooltip
              formatter={(value, name) => [
                name === "revenue" ? formatCurrency(value as number) : value,
                name === "revenue" ? "Revenue" : "Bookings",
              ]}
              labelFormatter={formatMonth}
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="bookings"
              type="monotone"
              dataKey="bookings"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
