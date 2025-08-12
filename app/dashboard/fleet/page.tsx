"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VehicleCard } from "@/components/fleet/vehicle-card"
import { VehicleForm } from "@/components/fleet/vehicle-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Car, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"
import { mockVehicles, mockLocations } from "@/lib/mock-fleet"
import type { Vehicle, VehicleStatus, VehicleCategory } from "@/types/fleet"

function FleetContent() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | "all">("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesCategory = categoryFilter === "all" || vehicle.category === categoryFilter
    const matchesLocation = locationFilter === "all" || vehicle.locationId === locationFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation
  })

  // Fleet statistics
  const fleetStats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    totalRevenue: vehicles.reduce((sum, v) => sum + v.totalRevenue, 0),
    avgUtilization: Math.round((vehicles.filter((v) => v.status === "rented").length / vehicles.length) * 100),
  }

  const handleAddVehicle = (vehicleData: Partial<Vehicle>) => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleData,
      currentFuelLevel: 100,
      mileage: 0,
      totalBookings: 0,
      totalRevenue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
      location: mockLocations.find((l) => l.id === vehicleData.locationId)?.name || "",
    } as Vehicle

    setVehicles([...vehicles, newVehicle])
    setShowForm(false)
  }

  const handleEditVehicle = (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      const updatedVehicles = vehicles.map((v) =>
        v.id === editingVehicle.id
          ? {
              ...v,
              ...vehicleData,
              updatedAt: new Date(),
              location: mockLocations.find((l) => l.id === vehicleData.locationId)?.name || v.location,
            }
          : v,
      )
      setVehicles(updatedVehicles)
      setEditingVehicle(null)
      setShowForm(false)
    }
  }

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingVehicle(null)
  }

  if (showForm) {
    return (
      <DashboardLayout>
        <VehicleForm
          vehicle={editingVehicle || undefined}
          onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
          onCancel={handleCancelForm}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Fleet Management"
        description="Manage your vehicle fleet, track availability, and monitor performance."
      >
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DashboardHeader>

      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {fleetStats.available} available • {fleetStats.rented} rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.avgUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              {fleetStats.rented} of {fleetStats.total} vehicles rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Vehicles in maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${fleetStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all vehicles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>
            Find vehicles by make, model, license plate, or filter by status and category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: VehicleStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value: VehicleCategory | "all") => setCategoryFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {mockLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setCategoryFilter("all")
                setLocationFilter("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </span>
          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all" || locationFilter !== "all") && (
            <Badge variant="secondary">Filtered</Badge>
          )}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={() => handleEditClick(vehicle)}
            onView={() => {
              /* TODO: Implement view details */
            }}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No vehicles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || locationFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first vehicle to the fleet."}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && locationFilter === "all" && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default function FleetPage() {
  return (
    <AuthGuard allowedRoles={["super_admin", "admin", "fleet_manager", "staff"]}>
      <FleetContent />
    </AuthGuard>
  )
}
