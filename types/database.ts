// Re-export Prisma types for easier imports throughout the application
export type {
  User,
  UserRole,
  Location,
  Vehicle,
  VehicleCategory,
  VehicleStatus,
  VehicleImage,
  FuelType,
  TransmissionType,
  Booking,
  BookingStatus,
  BookingType,
  Service,
  ServiceUnit,
  BookingService,
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentMethodType,
  Refund,
  Invoice,
  InvoiceItem,
  MaintenanceRecord,
  MaintenanceType,
  MaintenanceStatus,
  Session,
  Notification,
  AuditLog,
  Prisma,
} from '@/lib/generated/prisma'

// Additional utility types for common operations
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>
export type UpdateUserInput = Partial<Pick<User, 'name' | 'avatar' | 'phone' | 'isActive'>>

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'totalBookings' | 'totalRevenue'>
export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'licensePlate' | 'vin'>>

export type CreateBookingInput = Omit<Booking, 'id' | 'confirmationNumber' | 'createdAt' | 'updatedAt' | 'checkedInAt' | 'checkedOutAt' | 'checkedInBy' | 'checkedOutBy'>
export type UpdateBookingInput = Partial<Pick<Booking, 'status' | 'specialRequests' | 'damageReported' | 'damageDescription' | 'damagePhotos'>>

export type CreateLocationInput = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateLocationInput = Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>

// Vehicle with related data (for detailed views)
export type VehicleWithDetails = Vehicle & {
  location: Location
  images: VehicleImage[]
  maintenanceRecords: MaintenanceRecord[]
}

// Booking with related data (for detailed views)
export type BookingWithDetails = Booking & {
  customer: Pick<User, 'id' | 'name' | 'email' | 'phone'>
  vehicle: Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'licensePlate' | 'images'>
  pickupLocation: Location
  dropoffLocation: Location
  services: (BookingService & { service: Service })[]
  payments: Payment[]
}

// User with safe fields (excluding sensitive data)
export type SafeUser = Omit<User, 'passwordHash'>

// Permission checking type
export type Permission = 
  | 'users.read' | 'users.create' | 'users.update' | 'users.delete'
  | 'vehicles.read' | 'vehicles.create' | 'vehicles.update' | 'vehicles.delete'
  | 'bookings.read' | 'bookings.create' | 'bookings.update' | 'bookings.cancel'
  | 'payments.read' | 'payments.process' | 'payments.refund'
  | 'analytics.read'
  | 'bookings.read.own' | 'payments.read.own'