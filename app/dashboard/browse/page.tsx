"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VehicleCard } from "@/components/fleet/vehicle-card"
import { BookingForm } from "@/components/booking/booking-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Car } from "lucide-react"
import { mockVehicles } from "@/lib/mock-fleet"
import { mockBookings } from "@/lib/mock-bookings"
import type { Vehicle, VehicleCategory } from "@/types/fleet"
import type { BookingFormData } from "@/types/booking"

function BrowseContent() {
  const [vehicles] = useState(mockVehicles.filter((v) => v.status === "available"))
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | "all">("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || vehicle.category === categoryFilter

    const matchesPrice = (() => {
      switch (priceFilter) {
        case "under_50":
          return vehicle.pricePerDay < 50
        case "50_100":
          return vehicle.pricePerDay >= 50 && vehicle.pricePerDay <= 100
        case "over_100":
          return vehicle.pricePerDay > 100
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleBookVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleBookingSubmit = (bookingData: BookingFormData & { totalPrice: number }) => {
    // Create new booking
    const newBooking = {
      id: Date.now().toString(),
      customerId: "4", // Current user ID (mock)
      customerName: "Emma Customer",
      customerEmail: "customer@fleetflow.com",
      customerPhone: "(555) 123-4567",
      vehicleId: bookingData.vehicleId,
      vehicleName: `${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}`,
      vehicleImage: selectedVehicle?.primaryImage,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      pickupLocation: "Downtown Branch", // Mock location name
      dropoffLocation: "Downtown Branch",
      pickupLocationId: bookingData.pickupLocationId,
      dropoffLocationId: bookingData.dropoffLocationId,
      basePrice: bookingData.totalPrice * 0.8, // Mock calculation
      taxes: bookingData.totalPrice * 0.12,
      fees: 25,
      totalPrice: bookingData.totalPrice,
      bookingType: "daily" as const,
      status: "pending" as const,
      confirmationNumber: `FF-${Date.now()}`,
      additionalServices: bookingData.additionalServices,
      specialRequests: bookingData.specialRequests,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: "pending" as const,
    }

    setBookings([...bookings, newBooking])
    setSelectedVehicle(null)

    // Show success message (in real app, would redirect to confirmation page)
    alert(`Booking created successfully! Confirmation number: ${newBooking.confirmationNumber}`)
  }

  const handleCancelBooking = () => {
    setSelectedVehicle(null)
  }

  if (selectedVehicle) {
    return (
      <DashboardLayout>
        <DashboardHeader
          title="Book Vehicle"
          description={`Complete your booking for the ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
        />
        <BookingForm vehicle={selectedVehicle} onSubmit={handleBookingSubmit} onCancel={handleCancelBooking} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="Browse Vehicles" description="Find the perfect vehicle for your next trip." />

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find vehicles by make, model, or filter by category and price range.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under_50">Under $50/day</SelectItem>
                <SelectItem value="50_100">$50-$100/day</SelectItem>
                <SelectItem value="over_100">Over $100/day</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setPriceFilter("all")
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
            Showing {filteredVehicles.length} available vehicles
          </span>
          {(searchTerm || categoryFilter !== "all" || priceFilter !== "all") && (
            <Badge variant="secondary">Filtered</Badge>
          )}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <VehicleCard vehicle={vehicle} showActions={false} />
            <div className="absolute bottom-4 left-4 right-4">
              <Button className="w-full" onClick={() => handleBookVehicle(vehicle)}>
                Book Now - ${vehicle.pricePerDay}/day
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No vehicles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters to find available vehicles.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setPriceFilter("all")
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default function BrowsePage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <BrowseContent />
    </AuthGuard>
  )
}
