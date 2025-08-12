"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BookingCard } from "@/components/booking/booking-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Car } from "lucide-react"
import { mockBookings } from "@/lib/mock-bookings"
import type { BookingStatus } from "@/types/booking"

function MyBookingsContent() {
  const [bookings] = useState(mockBookings.filter((b) => b.customerId === "4")) // Current user's bookings
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")

  const filteredBookings = bookings.filter((booking) => statusFilter === "all" || booking.status === statusFilter)

  const bookingStats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    upcoming: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="My Bookings" description="View and manage your vehicle bookings." />

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-blue-600">{bookingStats.active}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{bookingStats.upcoming}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{bookingStats.completed}</p>
              </div>
              <Car className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
          {statusFilter !== "all" && <Badge variant="secondary">Filtered</Badge>}
        </div>

        <Select value={statusFilter} onValueChange={(value: BookingStatus | "all") => setStatusFilter(value)}>
          <SelectTrigger className="w-48">
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
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
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
              {statusFilter !== "all" ? "No bookings match the selected filter." : "You haven't made any bookings yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

export default function MyBookingsPage() {
  return (
    <AuthGuard allowedRoles={["customer"]}>
      <MyBookingsContent />
    </AuthGuard>
  )
}
