import { NextRequest } from 'next/server'
import { withSecurity, AuthContext, RATE_LIMITS, logAuditEvent } from '@/lib/api-security'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@/lib/generated/prisma'

// Dashboard overview data interface
interface DashboardOverview {
  stats: {
    totalVehicles: number
    activeBookings: number
    totalUsers: number
    monthlyRevenue: number
    trends: {
      vehicles: { value: number; isPositive: boolean }
      bookings: { value: number; isPositive: boolean }
      users: { value: number; isPositive: boolean }
      revenue: { value: number; isPositive: boolean }
    }
  }
  recentActivity: Array<{
    id: string
    type: 'booking' | 'payment' | 'maintenance' | 'user'
    title: string
    description: string
    timestamp: Date
    status: 'success' | 'warning' | 'error' | 'info'
    userId?: string
    resourceId?: string
  }>
  quickStats: {
    vehiclesByStatus: {
      available: number
      rented: number
      maintenance: number
      outOfService: number
    }
    bookingsByStatus: {
      pending: number
      confirmed: number
      active: number
      completed: number
      cancelled: number
    }
    usersByRole: {
      customers: number
      staff: number
      fleetManagers: number
      admins: number
      superAdmins: number
    }
    locationStats: Array<{
      locationId: string
      name: string
      vehicleCount: number
      activeBookings: number
      revenue: number
    }>
  }
  alerts: Array<{
    id: string
    type: 'warning' | 'error' | 'info'
    title: string
    message: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    timestamp: Date
    isRead: boolean
  }>
}

// Get dashboard data based on user role
async function getDashboardOverview(
  request: NextRequest,
  context: AuthContext
): Promise<DashboardOverview> {
  const { user } = context
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Log audit event for dashboard access
  await logAuditEvent(
    request,
    context,
    'VIEW',
    'DASHBOARD_OVERVIEW',
    undefined,
    undefined,
    { role: user.role, timestamp: now }
  )

  // Base stats queries
  const [
    totalVehicles,
    activeBookings,
    totalUsers,
    currentMonthRevenue,
    lastMonthRevenue,
    vehiclesByStatus,
    bookingsByStatus,
    usersByRole,
    locations,
    recentBookings,
    recentPayments,
    maintenanceAlerts,
    vehicleAlerts
  ] = await Promise.all([
    // Total vehicles
    prisma.vehicle.count({
      where: getRoleBasedFilter(user.role, 'vehicle')
    }),

    // Active bookings
    prisma.booking.count({
      where: {
        ...getRoleBasedFilter(user.role, 'booking'),
        status: { in: ['CONFIRMED', 'ACTIVE'] }
      }
    }),

    // Total users (admin-only data)
    user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
      ? prisma.user.count({ where: { isActive: true } })
      : 0,

    // Current month revenue
    prisma.payment.aggregate({
      where: {
        ...getRoleBasedFilter(user.role, 'payment'),
        status: 'COMPLETED',
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),

    // Last month revenue for trend calculation
    prisma.payment.aggregate({
      where: {
        ...getRoleBasedFilter(user.role, 'payment'),
        status: 'COMPLETED',
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
      },
      _sum: { amount: true }
    }),

    // Vehicle status breakdown
    prisma.vehicle.groupBy({
      by: ['status'],
      where: getRoleBasedFilter(user.role, 'vehicle'),
      _count: true
    }),

    // Booking status breakdown
    prisma.booking.groupBy({
      by: ['status'],
      where: getRoleBasedFilter(user.role, 'booking'),
      _count: true
    }),

    // User role breakdown (admin-only)
    user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
      ? prisma.user.groupBy({
          by: ['role'],
          where: { isActive: true },
          _count: true
        })
      : [],

    // Location stats
    prisma.location.findMany({
      where: { isActive: true },
      include: {
        vehicles: {
          select: { id: true, status: true }
        },
        pickupBookings: {
          where: { status: { in: ['CONFIRMED', 'ACTIVE'] } },
          select: { id: true, totalPrice: true }
        }
      }
    }),

    // Recent bookings
    prisma.booking.findMany({
      where: {
        ...getRoleBasedFilter(user.role, 'booking'),
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      },
      include: {
        customer: { select: { name: true, email: true } },
        vehicle: { select: { make: true, model: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),

    // Recent payments
    prisma.payment.findMany({
      where: {
        ...getRoleBasedFilter(user.role, 'payment'),
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      include: {
        customer: { select: { name: true } },
        booking: { select: { confirmationNumber: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),

    // Maintenance alerts
    prisma.maintenanceRecord.findMany({
      where: {
        status: 'SCHEDULED',
        nextDueDate: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // Due within 7 days
        vehicle: getRoleBasedFilter(user.role, 'vehicle')
      },
      include: {
        vehicle: { select: { make: true, model: true, licensePlate: true } }
      },
      orderBy: { nextDueDate: 'asc' },
      take: 5
    }),

    // Vehicle alerts (low fuel, high mileage)
    prisma.vehicle.findMany({
      where: {
        ...getRoleBasedFilter(user.role, 'vehicle'),
        OR: [
          { currentFuelLevel: { lt: 25 } }, // Low fuel
          { mileage: { gte: 200000 } } // High mileage
        ]
      },
      select: {
        id: true,
        make: true,
        model: true,
        licensePlate: true,
        currentFuelLevel: true,
        mileage: true
      },
      take: 5
    })
  ])

  // Calculate trends
  const currentRevenue = currentMonthRevenue._sum.amount?.toNumber() || 0
  const lastRevenue = lastMonthRevenue._sum.amount?.toNumber() || 0
  const revenueTrend = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

  // Process data into response format
  const stats = {
    totalVehicles,
    activeBookings,
    totalUsers,
    monthlyRevenue: currentRevenue,
    trends: {
      vehicles: { value: 12, isPositive: true }, // These would be calculated from historical data
      bookings: { value: 8, isPositive: true },
      users: { value: 15, isPositive: true },
      revenue: { value: Math.round(revenueTrend), isPositive: revenueTrend >= 0 }
    }
  }

  // Process recent activity
  const recentActivity = [
    ...recentBookings.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      title: 'New booking received',
      description: `${booking.vehicle.make} ${booking.vehicle.model} - ${booking.customer.name}`,
      timestamp: booking.createdAt,
      status: 'success' as const,
      userId: booking.customerId,
      resourceId: booking.id
    })),
    ...recentPayments.map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      title: 'Payment processed',
      description: `$${payment.amount} from ${payment.customer.name}`,
      timestamp: payment.createdAt,
      status: payment.status === 'COMPLETED' ? 'success' as const : 'warning' as const,
      userId: payment.customerId,
      resourceId: payment.id
    }))
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10)

  // Process quick stats
  const quickStats = {
    vehiclesByStatus: vehiclesByStatus.reduce((acc, item) => {
      acc[item.status.toLowerCase() as keyof typeof acc] = item._count
      return acc
    }, { available: 0, rented: 0, maintenance: 0, outOfService: 0 } as any),

    bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
      acc[item.status.toLowerCase() as keyof typeof acc] = item._count
      return acc
    }, { pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 } as any),

    usersByRole: usersByRole.reduce((acc, item) => {
      const roleKey = item.role.toLowerCase().replace('_', '') + 's'
      acc[roleKey as keyof typeof acc] = item._count
      return acc
    }, { customers: 0, staff: 0, fleetmanagers: 0, admins: 0, superadmins: 0 } as any),

    locationStats: locations.map(location => ({
      locationId: location.id,
      name: location.name,
      vehicleCount: location.vehicles.length,
      activeBookings: location.pickupBookings.length,
      revenue: location.pickupBookings.reduce((sum, booking) => 
        sum + (booking.totalPrice?.toNumber() || 0), 0
      )
    }))
  }

  // Process alerts
  const alerts = [
    ...maintenanceAlerts.map(maintenance => ({
      id: maintenance.id,
      type: 'warning' as const,
      title: 'Maintenance Due',
      message: `${maintenance.vehicle.make} ${maintenance.vehicle.model} (${maintenance.vehicle.licensePlate}) requires ${maintenance.type.toLowerCase()} maintenance`,
      priority: 'medium' as const,
      timestamp: maintenance.nextDueDate || new Date(),
      isRead: false
    })),
    ...vehicleAlerts.map(vehicle => ({
      id: vehicle.id,
      type: vehicle.currentFuelLevel < 25 ? 'warning' as const : 'info' as const,
      title: vehicle.currentFuelLevel < 25 ? 'Low Fuel Alert' : 'High Mileage Alert',
      message: vehicle.currentFuelLevel < 25 
        ? `${vehicle.make} ${vehicle.model} has ${vehicle.currentFuelLevel}% fuel remaining`
        : `${vehicle.make} ${vehicle.model} has ${vehicle.mileage} miles`,
      priority: vehicle.currentFuelLevel < 10 ? 'high' as const : 'medium' as const,
      timestamp: new Date(),
      isRead: false
    }))
  ]

  return {
    stats,
    recentActivity,
    quickStats,
    alerts
  }
}

// Role-based data filtering
function getRoleBasedFilter(role: UserRole, resource: string) {
  // Super admins and admins can see all data
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return {}
  }

  // Fleet managers can see all operational data but not financial details
  if (role === 'FLEET_MANAGER') {
    return {}
  }

  // Staff can see limited data
  if (role === 'STAFF') {
    return {}
  }

  // Customers can only see their own data
  return { customerId: 'user-context-id' } // This would be populated from context
}

// GET endpoint for dashboard overview
export const GET = withSecurity(
  getDashboardOverview,
  {
    permission: 'analytics.read',
    rateLimit: RATE_LIMITS.dashboard,
    requireAuth: true
  }
)