"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BookingCard } from "@/components/booking/booking-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Car, DollarSign, Users, Search, Filter } from "lucide-react"
import { mockBookings } from "@/lib/mock-bookings"
import type { BookingStatus } from "@/types/booking"

function BookingsContent() {
  const [bookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const bookingStats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="All Bookings" description="Manage customer bookings and reservations." />

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bookings"
          value={bookingStats.total}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Rentals"
          value={bookingStats.active}
          icon={Car}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Pending Approval"
          value={bookingStats.pending}
          icon={Users}
          trend={{ value: -2, isPositive: false }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${bookingStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, confirmation, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: BookingStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
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
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
          {(searchTerm || statusFilter !== "all") && <Badge variant="secondary">Filtered</Badge>}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            showCustomerInfo={true}
            onView={() => {
              /* TODO: Implement view details */
            }}
            onEdit={() => {
              /* TODO: Implement edit booking */
            }}
            onCancel={() => {
              /* TODO: Implement cancel booking */
            }}
          />
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "No bookings have been made yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default function BookingsPage() {
  return (
    <AuthGuard allowedRoles={["super_admin", "admin", "fleet_manager", "staff"]}>
      <BookingsContent />
    </AuthGuard>
  )
}
