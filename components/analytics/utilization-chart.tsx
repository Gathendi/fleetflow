"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { FleetUtilization } from "@/types/analytics"

interface UtilizationChartProps {
  data: FleetUtilization[]
  title?: string
  description?: string
}

export function UtilizationChart({
  data,
  title = "Fleet Utilization",
  description = "Vehicle utilization rates and performance",
}: UtilizationChartProps) {
  const formatPercent = (value: number) => `${value}%`
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vehicleName" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="utilization" orientation="left" tickFormatter={formatPercent} />
            <YAxis yAxisId="revenue" orientation="right" tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value, name) => [
                name === "utilizationRate" ? formatPercent(value as number) : formatCurrency(value as number),
                name === "utilizationRate" ? "Utilization Rate" : "Revenue",
              ]}
            />
            <Bar yAxisId="utilization" dataKey="utilizationRate" fill="#3b82f6" />
            <Bar yAxisId="revenue" dataKey="revenue" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
