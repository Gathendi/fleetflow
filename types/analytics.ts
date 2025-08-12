export interface RevenueData {
  date: string
  revenue: number
  bookings: number
  avgBookingValue: number
}

export interface FleetUtilization {
  vehicleId: string
  vehicleName: string
  category: string
  utilizationRate: number
  totalBookings: number
  revenue: number
  daysRented: number
  totalDays: number
}

export interface LocationPerformance {
  locationId: string
  locationName: string
  totalBookings: number
  revenue: number
  vehicleCount: number
  utilizationRate: number
  avgBookingValue: number
}

export interface CustomerSegment {
  segment: string
  count: number
  revenue: number
  avgBookingValue: number
  bookingFrequency: number
}

export interface BookingTrends {
  date: string
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  pendingBookings: number
}

export interface VehicleCategoryPerformance {
  category: string
  count: number
  revenue: number
  bookings: number
  utilizationRate: number
  avgDailyRate: number
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date
    end: Date
  }
  locations: string[]
  vehicleCategories: string[]
  customerSegments: string[]
}

export interface KPIMetrics {
  totalRevenue: number
  totalBookings: number
  avgBookingValue: number
  fleetUtilization: number
  customerSatisfaction: number
  repeatCustomerRate: number
  revenueGrowth: number
  bookingGrowth: number
}
