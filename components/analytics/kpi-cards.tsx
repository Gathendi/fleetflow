import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Star, Percent, BarChart3 } from "lucide-react"
import type { KPIMetrics } from "@/types/analytics"

interface KPICardsProps {
  metrics: KPIMetrics
}

export function KPICards({ metrics }: KPICardsProps) {
  const kpis = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: { value: metrics.revenueGrowth, isPositive: metrics.revenueGrowth > 0 },
      description: "vs last period",
    },
    {
      title: "Total Bookings",
      value: metrics.totalBookings.toLocaleString(),
      icon: Calendar,
      trend: { value: metrics.bookingGrowth, isPositive: metrics.bookingGrowth > 0 },
      description: "vs last period",
    },
    {
      title: "Avg Booking Value",
      value: `$${metrics.avgBookingValue}`,
      icon: BarChart3,
      trend: { value: 5.2, isPositive: true },
      description: "vs last period",
    },
    {
      title: "Fleet Utilization",
      value: `${metrics.fleetUtilization}%`,
      icon: Percent,
      trend: { value: 3.1, isPositive: true },
      description: "vs last period",
    },
    {
      title: "Customer Satisfaction",
      value: `${metrics.customerSatisfaction}/5.0`,
      icon: Star,
      trend: { value: 0.2, isPositive: true },
      description: "average rating",
    },
    {
      title: "Repeat Customer Rate",
      value: `${metrics.repeatCustomerRate}%`,
      icon: Users,
      trend: { value: 4.8, isPositive: true },
      description: "vs last period",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend.isPositive ? TrendingUp : TrendingDown
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 ${kpi.trend.isPositive ? "text-green-600" : "text-red-600"}`} />
                <span className={kpi.trend.isPositive ? "text-green-600" : "text-red-600"}>
                  {kpi.trend.isPositive ? "+" : ""}
                  {kpi.trend.value}%
                </span>
                <span>{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
