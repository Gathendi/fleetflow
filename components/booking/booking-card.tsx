"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Car, DollarSign, User, Phone } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingCardProps {
  booking: Booking
  onView?: () => void
  onEdit?: () => void
  onCancel?: () => void
  showCustomerInfo?: boolean
  showActions?: boolean
}

export function BookingCard({
  booking,
  onView,
  onEdit,
  onCancel,
  showCustomerInfo = false,
  showActions = true,
}: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={booking.vehicleImage || "/placeholder.svg?height=60&width=80&query=car"}
              alt={booking.vehicleName}
              className="w-16 h-12 object-cover rounded"
            />
            <div>
              <CardTitle className="text-lg">{booking.vehicleName}</CardTitle>
              <CardDescription>Booking #{booking.confirmationNumber}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{booking.pickupLocation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-gray-500" />
              <span>
                {days} day{days !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>${booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Information (for staff view) */}
          {showCustomerInfo && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Customer Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{booking.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{booking.customerPhone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Services */}
          {booking.additionalServices.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Additional Services</p>
              <div className="flex flex-wrap gap-1">
                {booking.additionalServices.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Special Requests</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{booking.specialRequests}</p>
            </div>
          )}

          {/* Check-in/out Status */}
          {(booking.checkedInAt || booking.checkedOutAt) && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {booking.checkedInAt && (
                  <div>
                    <p className="font-medium text-gray-500">Checked In</p>
                    <p>{booking.checkedInAt.toLocaleString()}</p>
                    {booking.checkedInBy && <p className="text-gray-500">by {booking.checkedInBy}</p>}
                  </div>
                )}
                {booking.checkedOutAt && (
                  <div>
                    <p className="font-medium text-gray-500">Checked Out</p>
                    <p>{booking.checkedOutAt.toLocaleString()}</p>
                    {booking.checkedOutBy && <p className="text-gray-500">by {booking.checkedOutBy}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={onView} className="flex-1 bg-transparent">
                View Details
              </Button>
              {booking.status === "pending" && (
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 bg-transparent">
                  Modify
                </Button>
              )}
              {(booking.status === "pending" || booking.status === "confirmed") && (
                <Button variant="destructive" size="sm" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
