"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { BookingTrends } from "@/types/analytics"

interface BookingTrendsChartProps {
  data: BookingTrends[]
  title?: string
  description?: string
}

export function BookingTrendsChart({
  data,
  title = "Booking Trends",
  description = "Monthly booking status trends",
}: BookingTrendsChartProps) {
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
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatMonth} />
            <YAxis />
            <Tooltip labelFormatter={formatMonth} />
            <Area
              type="monotone"
              dataKey="confirmedBookings"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="pendingBookings"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="cancelledBookings"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
