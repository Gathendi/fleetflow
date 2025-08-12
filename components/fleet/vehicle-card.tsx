"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Fuel, Users, MapPin, DollarSign } from "lucide-react"
import type { Vehicle } from "@/types/fleet"

interface VehicleCardProps {
  vehicle: Vehicle
  onEdit?: () => void
  onView?: () => void
  showActions?: boolean
}

export function VehicleCard({ vehicle, onEdit, onView, showActions = true }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "out_of_service":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "luxury":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "electric":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "suv":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={vehicle.primaryImage || "/placeholder.svg?height=200&width=300&query=car"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={getStatusColor(vehicle.status)}>{vehicle.status.replace("_", " ").toUpperCase()}</Badge>
          <Badge className={getCategoryColor(vehicle.category)}>{vehicle.category.toUpperCase()}</Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              <CardDescription>
                {vehicle.licensePlate} • {vehicle.color}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Vehicle Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{vehicle.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-gray-500" />
              <span>
                {vehicle.currentFuelLevel}% {vehicle.fuelType}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{vehicle.seats} seats</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>${vehicle.pricePerDay}/day</span>
            </div>
          </div>

          {/* Mileage and Maintenance */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Mileage:</span>
              <span>{vehicle.mileage.toLocaleString()} miles</span>
            </div>
            {vehicle.nextMaintenanceDate && (
              <div className="flex justify-between">
                <span>Next Maintenance:</span>
                <span>{vehicle.nextMaintenanceDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{vehicle.features.length - 3} more
              </Badge>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={onView} className="flex-1 bg-transparent">
                View Details
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 bg-transparent">
                Edit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
