import type { Booking } from "@/types/booking"

export const mockBookings: Booking[] = [
  {
    id: "1",
    customerId: "4",
    customerName: "Emma Customer",
    customerEmail: "customer@fleetflow.com",
    customerPhone: "(555) 123-4567",
    vehicleId: "2",
    vehicleName: "2022 Honda CR-V",
    vehicleImage: "/honda-crv-suv.png",
    startDate: new Date("2024-12-15"),
    endDate: new Date("2024-12-17"),
    pickupLocation: "Downtown Branch",
    dropoffLocation: "Downtown Branch",
    pickupLocationId: "1",
    dropoffLocationId: "1",
    basePrice: 130,
    taxes: 15.6,
    fees: 25,
    totalPrice: 170.6,
    bookingType: "daily",
    status: "active",
    confirmationNumber: "FF-2024-001",
    additionalServices: ["GPS Navigation", "Child Seat"],
    specialRequests: "Please have the vehicle ready by 9 AM",
    checkedInAt: new Date("2024-12-15T09:00:00"),
    checkedInBy: "Mike Staff",
    pickupCondition: "Excellent condition, full tank",
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-15"),
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    paymentId: "pay_123456789",
  },
  {
    id: "2",
    customerId: "4",
    customerName: "Emma Customer",
    customerEmail: "customer@fleetflow.com",
    customerPhone: "(555) 123-4567",
    vehicleId: "1",
    vehicleName: "2023 Toyota Camry",
    vehicleImage: "/toyota-camry-sedan.png",
    startDate: new Date("2024-11-20"),
    endDate: new Date("2024-11-25"),
    pickupLocation: "Airport Location",
    dropoffLocation: "Airport Location",
    pickupLocationId: "2",
    dropoffLocationId: "2",
    basePrice: 225,
    taxes: 27,
    fees: 35,
    totalPrice: 287,
    bookingType: "daily",
    status: "completed",
    confirmationNumber: "FF-2024-002",
    additionalServices: ["Insurance Coverage"],
    checkedInAt: new Date("2024-11-20T14:30:00"),
    checkedOutAt: new Date("2024-11-25T11:15:00"),
    checkedInBy: "Sarah Wilson",
    checkedOutBy: "Mike Staff",
    pickupCondition: "Good condition, 3/4 tank",
    returnCondition: "Good condition, 1/2 tank, minor scratch on rear bumper",
    damageReported: true,
    damageDescription: "Small scratch on rear bumper, approximately 2 inches",
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-25"),
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    paymentId: "pay_987654321",
  },
  {
    id: "3",
    customerId: "customer_123",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "(555) 987-6543",
    vehicleId: "4",
    vehicleName: "2023 Tesla Model 3",
    vehicleImage: "/tesla-model-3.png",
    startDate: new Date("2024-12-20"),
    endDate: new Date("2024-12-22"),
    pickupLocation: "Downtown Branch",
    dropoffLocation: "Downtown Branch",
    pickupLocationId: "1",
    dropoffLocationId: "1",
    basePrice: 170,
    taxes: 20.4,
    fees: 30,
    totalPrice: 220.4,
    bookingType: "daily",
    status: "confirmed",
    confirmationNumber: "FF-2024-003",
    additionalServices: ["Premium Insurance"],
    specialRequests: "Please ensure vehicle is fully charged",
    createdAt: new Date("2024-12-12"),
    updatedAt: new Date("2024-12-12"),
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    paymentId: "pay_456789123",
  },
  {
    id: "4",
    customerId: "customer_456",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "(555) 456-7890",
    vehicleId: "3",
    vehicleName: "2023 BMW X5",
    vehicleImage: "/bmw-x5-luxury-suv.png",
    startDate: new Date("2024-12-25"),
    endDate: new Date("2025-01-02"),
    pickupLocation: "Airport Location",
    dropoffLocation: "Airport Location",
    pickupLocationId: "2",
    dropoffLocationId: "2",
    basePrice: 960,
    taxes: 115.2,
    fees: 85,
    totalPrice: 1160.2,
    bookingType: "weekly",
    status: "pending",
    confirmationNumber: "FF-2024-004",
    additionalServices: ["Chauffeur Service", "Premium Insurance", "GPS Navigation"],
    specialRequests: "Holiday rental for family vacation",
    createdAt: new Date("2024-12-13"),
    updatedAt: new Date("2024-12-13"),
    paymentStatus: "pending",
  },
]

export const additionalServices = [
  { id: "gps", name: "GPS Navigation", price: 5, unit: "per day" },
  { id: "child_seat", name: "Child Seat", price: 8, unit: "per day" },
  { id: "booster_seat", name: "Booster Seat", price: 6, unit: "per day" },
  { id: "basic_insurance", name: "Basic Insurance", price: 15, unit: "per day" },
  { id: "premium_insurance", name: "Premium Insurance", price: 25, unit: "per day" },
  { id: "roadside_assistance", name: "24/7 Roadside Assistance", price: 10, unit: "per booking" },
  { id: "additional_driver", name: "Additional Driver", price: 12, unit: "per day" },
  { id: "wifi_hotspot", name: "WiFi Hotspot", price: 7, unit: "per day" },
  { id: "ski_rack", name: "Ski Rack", price: 15, unit: "per booking" },
  { id: "bike_rack", name: "Bike Rack", price: 12, unit: "per booking" },
]

export const checkVehicleAvailability = (vehicleId: string, startDate: Date, endDate: Date): boolean => {
  const conflictingBookings = mockBookings.filter(
    (booking) =>
      booking.vehicleId === vehicleId &&
      booking.status !== "cancelled" &&
      booking.status !== "completed" &&
      ((startDate >= booking.startDate && startDate <= booking.endDate) ||
        (endDate >= booking.startDate && endDate <= booking.endDate) ||
        (startDate <= booking.startDate && endDate >= booking.endDate)),
  )

  return conflictingBookings.length === 0
}

export const calculateBookingPrice = (
  vehicleId: string,
  startDate: Date,
  endDate: Date,
  selectedServices: string[],
): { basePrice: number; servicesPrice: number; taxes: number; fees: number; totalPrice: number } => {
  // Mock vehicle prices (in real app, would fetch from vehicle data)
  const vehiclePrices: Record<string, number> = {
    "1": 45, // Toyota Camry
    "2": 65, // Honda CR-V
    "3": 120, // BMW X5
    "4": 85, // Tesla Model 3
  }

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const dailyRate = vehiclePrices[vehicleId] || 50
  const basePrice = dailyRate * days

  const servicesPrice = selectedServices.reduce((total, serviceId) => {
    const service = additionalServices.find((s) => s.id === serviceId)
    if (service) {
      return total + (service.unit === "per day" ? service.price * days : service.price)
    }
    return total
  }, 0)

  const subtotal = basePrice + servicesPrice
  const taxes = subtotal * 0.12 // 12% tax
  const fees = 25 // Flat booking fee
  const totalPrice = subtotal + taxes + fees

  return { basePrice, servicesPrice, taxes, fees, totalPrice }
}
