"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, DollarSign, AlertCircle } from "lucide-react"
import type { Vehicle } from "@/types/fleet"
import type { BookingFormData } from "@/types/booking"
import { mockLocations } from "@/lib/mock-fleet"
import { additionalServices, calculateBookingPrice, checkVehicleAvailability } from "@/lib/mock-bookings"

interface BookingFormProps {
  vehicle: Vehicle
  onSubmit: (bookingData: BookingFormData & { totalPrice: number }) => void
  onCancel: () => void
}

export function BookingForm({ vehicle, onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    vehicleId: vehicle.id,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    pickupLocationId: vehicle.locationId,
    dropoffLocationId: vehicle.locationId,
    additionalServices: [],
    specialRequests: "",
  })

  const [pricing, setPricing] = useState({
    basePrice: 0,
    servicesPrice: 0,
    taxes: 0,
    fees: 0,
    totalPrice: 0,
  })

  const [isAvailable, setIsAvailable] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  // Calculate pricing whenever form data changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const newPricing = calculateBookingPrice(
        formData.vehicleId,
        formData.startDate,
        formData.endDate,
        formData.additionalServices,
      )
      setPricing(newPricing)

      // Check availability
      const available = checkVehicleAvailability(formData.vehicleId, formData.startDate, formData.endDate)
      setIsAvailable(available)
    }
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: string[] = []

    if (formData.startDate >= formData.endDate) {
      newErrors.push("End date must be after start date")
    }

    if (formData.startDate < new Date()) {
      newErrors.push("Start date cannot be in the past")
    }

    if (!isAvailable) {
      newErrors.push("Vehicle is not available for selected dates")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    onSubmit({ ...formData, totalPrice: pricing.totalPrice })
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter((id) => id !== serviceId)
        : [...prev.additionalServices, serviceId],
    }))
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Vehicle Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <img
              src={vehicle.primaryImage || "/placeholder.svg?height=80&width=120&query=car"}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-20 h-16 object-cover rounded"
            />
            <div>
              <CardTitle>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              <CardDescription>
                {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)} • {vehicle.seats} seats •{" "}
                {vehicle.fuelType}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Booking Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Pickup Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formatDate(formData.startDate)}
                      onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                      min={formatDate(new Date())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Return Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formatDate(formData.endDate)}
                      onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                      min={formatDate(new Date(formData.startDate.getTime() + 24 * 60 * 60 * 1000))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Select
                      value={formData.pickupLocationId}
                      onValueChange={(value) => setFormData({ ...formData, pickupLocationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoffLocation">Return Location</Label>
                    <Select
                      value={formData.dropoffLocationId}
                      onValueChange={(value) => setFormData({ ...formData, dropoffLocationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!isAvailable && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Vehicle is not available for selected dates</span>
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {days} day{days !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {formData.pickupLocationId === formData.dropoffLocationId
                        ? "Same location pickup/return"
                        : "Different locations"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
                <CardDescription>Enhance your rental experience with optional services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={formData.additionalServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                          {service.name}
                        </Label>
                        <p className="text-xs text-gray-500">
                          ${service.price} {service.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
                <CardDescription>Any special requirements or requests for your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter any special requests or requirements..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vehicle rental ({days} days)</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  {pricing.servicesPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Additional services</span>
                      <span>${pricing.servicesPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>${pricing.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Booking fees</span>
                    <span>${pricing.fees.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {formData.additionalServices.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.additionalServices.map((serviceId) => {
                        const service = additionalServices.find((s) => s.id === serviceId)
                        return service ? (
                          <Badge key={serviceId} variant="secondary" className="text-xs">
                            {service.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <div key={index} className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={!isAvailable || errors.length > 0}>
                    Book Now - ${pricing.totalPrice.toFixed(2)}
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-transparent" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
