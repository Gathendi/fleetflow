"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Vehicle, VehicleCategory, FuelType, TransmissionType, VehicleStatus } from "@/types/fleet"
import { mockLocations } from "@/lib/mock-fleet"

interface VehicleFormProps {
  vehicle?: Vehicle
  onSubmit: (vehicle: Partial<Vehicle>) => void
  onCancel: () => void
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    licensePlate: vehicle?.licensePlate || "",
    vin: vehicle?.vin || "",
    category: vehicle?.category || ("sedan" as VehicleCategory),
    status: vehicle?.status || ("available" as VehicleStatus),
    locationId: vehicle?.locationId || "",
    pricePerDay: vehicle?.pricePerDay || 0,
    pricePerWeek: vehicle?.pricePerWeek || 0,
    pricePerMonth: vehicle?.pricePerMonth || 0,
    fuelType: vehicle?.fuelType || ("gasoline" as FuelType),
    transmission: vehicle?.transmission || ("automatic" as TransmissionType),
    seats: vehicle?.seats || 5,
    doors: vehicle?.doors || 4,
    fuelCapacity: vehicle?.fuelCapacity || 60,
    color: vehicle?.color || "",
    features: vehicle?.features || [],
  })

  const [newFeature, setNewFeature] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        <CardDescription>
          {vehicle ? "Update vehicle information and specifications." : "Enter vehicle details and specifications."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="Toyota"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Camry"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                min="2000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Silver"
                required
              />
            </div>
          </div>

          {/* Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="ABC-123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="1HGBH41JXMN109186"
                required
              />
            </div>
          </div>

          {/* Categories and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: VehicleCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: VehicleStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
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

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value: FuelType) => setFormData({ ...formData, fuelType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value: TransmissionType) => setFormData({ ...formData, transmission: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number.parseInt(e.target.value) })}
                min="2"
                max="15"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doors">Doors</Label>
              <Input
                id="doors"
                type="number"
                value={formData.doors}
                onChange={(e) => setFormData({ ...formData, doors: Number.parseInt(e.target.value) })}
                min="2"
                max="6"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per Day ($)</Label>
              <Input
                id="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: Number.parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerWeek">Price per Week ($)</Label>
              <Input
                id="pricePerWeek"
                type="number"
                value={formData.pricePerWeek}
                onChange={(e) => setFormData({ ...formData, pricePerWeek: Number.parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerMonth">Price per Month ($)</Label>
              <Input
                id="pricePerMonth"
                type="number"
                value={formData.pricePerMonth}
                onChange={(e) => setFormData({ ...formData, pricePerMonth: Number.parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature (e.g., Bluetooth, GPS)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="outline" onClick={addFeature}>
                Add
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{vehicle ? "Update Vehicle" : "Add Vehicle"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
