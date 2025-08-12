export type VehicleStatus = "available" | "rented" | "maintenance" | "out_of_service"
export type VehicleCategory = "economy" | "compact" | "sedan" | "suv" | "luxury" | "electric" | "van"
export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid"
export type TransmissionType = "automatic" | "manual"

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
  category: VehicleCategory
  status: VehicleStatus
  location: string
  locationId: string
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number

  // Technical specs
  fuelType: FuelType
  transmission: TransmissionType
  seats: number
  doors: number
  fuelCapacity: number
  currentFuelLevel: number
  mileage: number

  // Features
  features: string[]
  color: string

  // Maintenance
  lastMaintenanceDate?: Date
  nextMaintenanceDate?: Date
  maintenanceMiles?: number

  // Tracking
  createdAt: Date
  updatedAt: Date
  totalBookings: number
  totalRevenue: number

  // Images
  images: string[]
  primaryImage?: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  isActive: boolean
  vehicleCount: number
  createdAt: Date
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: "routine" | "repair" | "inspection" | "cleaning"
  description: string
  cost: number
  performedBy: string
  performedAt: Date
  nextDueDate?: Date
  nextDueMiles?: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  notes?: string
}
