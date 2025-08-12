"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KPICards } from "@/components/analytics/kpi-cards"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { UtilizationChart } from "@/components/analytics/utilization-chart"
import { CategoryPerformanceChart } from "@/components/analytics/category-performance-chart"
import { BookingTrendsChart } from "@/components/analytics/booking-trends-chart"
import { LocationPerformanceTable } from "@/components/analytics/location-performance-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import {
  mockKPIMetrics,
  mockRevenueData,
  mockFleetUtilization,
  mockVehicleCategoryPerformance,
  mockBookingTrends,
  mockLocationPerformance,
  mockCustomerSegments,
} from "@/lib/mock-analytics"

function AnalyticsContent() {
  const [dateRange, setDateRange] = useState("12months")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const handleExportData = () => {
    // Mock export functionality
    alert("Analytics data exported successfully!")
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Analytics Dashboard"
        description="Comprehensive insights into fleet performance, revenue, and customer behavior."
      >
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="1">Downtown Branch</SelectItem>
              <SelectItem value="2">Airport Location</SelectItem>
              <SelectItem value="3">Service Center</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DashboardHeader>

      {/* KPI Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <KPICards metrics={mockKPIMetrics} />
      </div>

      {/* Revenue and Booking Trends */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={mockRevenueData} />
        <BookingTrendsChart data={mockBookingTrends} />
      </div>

      {/* Fleet Performance */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <UtilizationChart data={mockFleetUtilization} />
        <CategoryPerformanceChart data={mockVehicleCategoryPerformance} />
      </div>

      {/* Location Performance */}
      <div className="mb-8">
        <LocationPerformanceTable data={mockLocationPerformance} />
      </div>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>Revenue and behavior analysis by customer segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCustomerSegments.map((segment) => (
              <div key={segment.segment} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{segment.segment}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customers:</span>
                    <span className="font-medium">{segment.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenue:</span>
                    <span className="font-medium">${segment.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Booking:</span>
                    <span className="font-medium">${segment.avgBookingValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="font-medium">{segment.bookingFrequency}x/year</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default function AnalyticsPage() {
  return (
    <AuthGuard allowedRoles={["super_admin", "admin", "fleet_manager"]}>
      <AnalyticsContent />
    </AuthGuard>
  )
}
