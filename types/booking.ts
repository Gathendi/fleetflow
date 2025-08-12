export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled"
export type BookingType = "daily" | "weekly" | "monthly"

export interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleId: string
  vehicleName: string
  vehicleImage?: string

  // Booking details
  startDate: Date
  endDate: Date
  pickupLocation: string
  dropoffLocation: string
  pickupLocationId: string
  dropoffLocationId: string

  // Pricing
  basePrice: number
  taxes: number
  fees: number
  totalPrice: number
  bookingType: BookingType

  // Status and tracking
  status: BookingStatus
  confirmationNumber: string

  // Additional services
  additionalServices: string[]
  specialRequests?: string

  // Check-in/out details
  checkedInAt?: Date
  checkedOutAt?: Date
  checkedInBy?: string
  checkedOutBy?: string

  // Vehicle condition
  pickupCondition?: string
  returnCondition?: string
  damageReported?: boolean
  damageDescription?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Payment
  paymentStatus: "pending" | "paid" | "refunded"
  paymentMethod?: string
  paymentId?: string
}

export interface BookingFormData {
  vehicleId: string
  startDate: Date
  endDate: Date
  pickupLocationId: string
  dropoffLocationId: string
  additionalServices: string[]
  specialRequests?: string
}

export interface AvailabilityCheck {
  vehicleId: string
  startDate: Date
  endDate: Date
  isAvailable: boolean
  conflictingBookings?: string[]
}
