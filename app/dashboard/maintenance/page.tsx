"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Wrench, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { mockMaintenanceRecords, mockVehicles } from "@/lib/mock-fleet"

function MaintenanceContent() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "routine":
        return <Calendar className="h-4 w-4" />
      case "repair":
        return <Wrench className="h-4 w-4" />
      case "inspection":
        return <CheckCircle className="h-4 w-4" />
      case "cleaning":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const maintenanceStats = {
    total: mockMaintenanceRecords.length,
    completed: mockMaintenanceRecords.filter((r) => r.status === "completed").length,
    scheduled: mockMaintenanceRecords.filter((r) => r.status === "scheduled").length,
    totalCost: mockMaintenanceRecords.reduce((sum, r) => sum + r.cost, 0),
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Maintenance Management"
        description="Track vehicle maintenance, schedule services, and monitor costs."
      >
        <Button>
          <Wrench className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </DashboardHeader>

      {/* Maintenance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceStats.total}</div>
            <p className="text-xs text-muted-foreground">{maintenanceStats.completed} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceStats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${maintenanceStats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All maintenance costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Vehicles need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Records */}
      <div className="space-y-6">
        {mockMaintenanceRecords.map((record) => {
          const vehicle = mockVehicles.find((v) => v.id === record.vehicleId)
          return (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(record.type)}
                    <div>
                      <CardTitle className="text-lg">{record.description}</CardTitle>
                      <CardDescription>
                        {vehicle?.year} {vehicle?.make} {vehicle?.model} • {vehicle?.licensePlate}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-sm capitalize">{record.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cost</p>
                    <p className="text-sm">${record.cost}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Performed By</p>
                    <p className="text-sm">{record.performedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-sm">{record.performedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                {record.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                  </div>
                )}
                {record.nextDueDate && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Next Service:</strong> {record.nextDueDate.toLocaleDateString()}
                      {record.nextDueMiles && ` or ${record.nextDueMiles.toLocaleString()} miles`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}

export default function MaintenancePage() {
  return (
    <AuthGuard allowedRoles={["super_admin", "admin", "fleet_manager", "staff"]}>
      <MaintenanceContent />
    </AuthGuard>
  )
}
