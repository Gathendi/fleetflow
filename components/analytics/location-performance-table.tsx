import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, DollarSign, Calendar } from "lucide-react"
import type { LocationPerformance } from "@/types/analytics"

interface LocationPerformanceTableProps {
  data: LocationPerformance[]
  title?: string
  description?: string
}

export function LocationPerformanceTable({
  data,
  title = "Location Performance",
  description = "Performance metrics by location",
}: LocationPerformanceTableProps) {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (rate >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((location) => (
            <div key={location.locationId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">{location.locationName}</h3>
                </div>
                <Badge className={getUtilizationColor(location.utilizationRate)}>
                  {location.utilizationRate}% Utilization
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{location.totalBookings}</p>
                    <p className="text-gray-500">Total Bookings</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">${location.revenue.toLocaleString()}</p>
                    <p className="text-gray-500">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">${location.avgBookingValue}</p>
                    <p className="text-gray-500">Avg Booking</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{location.vehicleCount}</p>
                    <p className="text-gray-500">Vehicles</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
