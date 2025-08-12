"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

function DashboardContent() {
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const getStatsForRole = () => {
    switch (user?.role) {
      case "super_admin":
      case "admin":
        return [
          { title: "Total Vehicles", value: 156, icon: Car, trend: { value: 12, isPositive: true } },
          { title: "Active Bookings", value: 89, icon: Calendar, trend: { value: 8, isPositive: true } },
          { title: "Total Users", value: 1247, icon: Users, trend: { value: 15, isPositive: true } },
          { title: "Monthly Revenue", value: "$45,231", icon: DollarSign, trend: { value: 23, isPositive: true } },
        ]
      case "fleet_manager":
        return [
          { title: "Fleet Vehicles", value: 89, icon: Car, trend: { value: 5, isPositive: true } },
          { title: "Available Now", value: 34, icon: TrendingUp, trend: { value: -3, isPositive: false } },
          { title: "In Maintenance", value: 7, icon: AlertTriangle, trend: { value: 2, isPositive: false } },
          { title: "Utilization Rate", value: "78%", icon: TrendingUp, trend: { value: 4, isPositive: true } },
        ]
      case "staff":
        return [
          { title: "Today's Bookings", value: 23, icon: Calendar, trend: { value: 12, isPositive: true } },
          { title: "Pending Returns", value: 8, icon: Car, trend: { value: -2, isPositive: false } },
          { title: "Customer Inquiries", value: 15, icon: Users, trend: { value: 5, isPositive: true } },
          { title: "Available Vehicles", value: 34, icon: TrendingUp, trend: { value: -3, isPositive: false } },
        ]
      case "customer":
        return [
          { title: "Active Bookings", value: 2, icon: Calendar },
          { title: "Completed Trips", value: 12, icon: Car },
          { title: "Loyalty Points", value: 1250, icon: TrendingUp },
          { title: "Total Spent", value: "$2,340", icon: DollarSign },
        ]
      default:
        return []
    }
  }

  const stats = getStatsForRole()

  const getQuickActions = () => {
    switch (user?.role) {
      case "super_admin":
      case "admin":
        return [
          { title: "Add New Vehicle", href: "/dashboard/fleet/add" },
          { title: "View Analytics", href: "/dashboard/analytics" },
          { title: "Manage Users", href: "/dashboard/users" },
          { title: "System Settings", href: "/dashboard/settings" },
        ]
      case "fleet_manager":
        return [
          { title: "Add Vehicle", href: "/dashboard/fleet/add" },
          { title: "Schedule Maintenance", href: "/dashboard/maintenance" },
          { title: "View Fleet Status", href: "/dashboard/fleet" },
          { title: "Location Management", href: "/dashboard/locations" },
        ]
      case "staff":
        return [
          { title: "Process Check-in", href: "/dashboard/bookings/checkin" },
          { title: "Process Check-out", href: "/dashboard/bookings/checkout" },
          { title: "View Today's Bookings", href: "/dashboard/bookings" },
          { title: "Customer Support", href: "/dashboard/support" },
        ]
      case "customer":
        return [
          { title: "Browse Vehicles", href: "/dashboard/browse" },
          { title: "Make Booking", href: "/dashboard/browse" },
          { title: "View My Bookings", href: "/dashboard/my-bookings" },
          { title: "Account Settings", href: "/dashboard/settings" },
        ]
      default:
        return []
    }
  }

  const quickActions = getQuickActions()

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`Welcome back, ${user?.name}!`}
        description={`Here's your ${user?.role?.replace("_", " ")} dashboard overview.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button key={index} variant="outline" className="justify-start h-auto p-4 bg-transparent">
                  {action.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.role === "customer" ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Booking confirmed</p>
                      <p className="text-xs text-muted-foreground">Toyota Camry - Dec 15-17</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment processed</p>
                      <p className="text-xs text-muted-foreground">$234.50 for recent booking</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-muted-foreground">Honda Civic - Customer: John D.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Maintenance due</p>
                      <p className="text-xs text-muted-foreground">BMW X5 - Service required</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vehicle returned</p>
                      <p className="text-xs text-muted-foreground">Tesla Model 3 - No issues reported</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
