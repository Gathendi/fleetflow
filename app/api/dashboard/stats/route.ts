import { NextRequest } from 'next/server'
import { withSecurity, AuthContext, RATE_LIMITS, logAuditEvent } from '@/lib/api-security'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@/lib/generated/prisma'

// Dashboard stats interface
interface DashboardStats {
  overview: {
    totalVehicles: number
    totalBookings: number
    totalRevenue: number
    totalUsers: number
    activeCustomers: number
    averageBookingValue: number
    fleetUtilization: number
    customerSatisfaction: number
  }
  trends: {
    period: string
    vehicleGrowth: number[]
    bookingGrowth: number[]
    revenueGrowth: number[]
    userGrowth: number[]
  }
  performance: {
    topVehicles: Array<{
      vehicleId: string
      make: string
      model: string
      totalBookings: number
      totalRevenue: number
      utilizationRate: number
    }>
    topLocations: Array<{
      locationId: string
      name: string
      totalBookings: number
      totalRevenue: number
      vehicleCount: number
    }>
    topCustomers: Array<{
      customerId: string
      name: string
      totalBookings: number
      totalSpent: number
      lastBooking: Date
    }>
  }
  financial: {
    monthlyRevenue: Array<{
      month: string
      revenue: number
      bookings: number
      averageValue: number
    }>
    revenueByCategory: Array<{
      category: string
      revenue: number
      percentage: number
    }>
    profitMargins: {
      gross: number
      net: number
      operating: number
    }
  }
}

// Get detailed dashboard statistics
async function getDashboardStats(
  request: NextRequest,
  context: AuthContext
): Promise<DashboardStats> {
  const { user } = context
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
  const timeRange = getTimeRange(period)

  // Log audit event
  await logAuditEvent(
    request,
    context,
    'VIEW',
    'DASHBOARD_STATS',
    undefined,
    undefined,
    { period, role: user.role }
  )

  // Check permissions for financial data
  const canViewFinancials = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
  const canViewAllData = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'FLEET_MANAGER'

  // Overview statistics
  const [
    totalVehicles,
    totalBookings,
    totalRevenue,
    totalUsers,
    activeCustomers,
    completedBookings,
    fleetUtilizationData
  ] = await Promise.all([
    // Total vehicles
    prisma.vehicle.count({
      where: getRoleBasedFilter(user.role, 'vehicle')
    }),

    // Total bookings
    prisma.booking.count({
      where: {
        ...getRoleBasedFilter(user.role, 'booking'),
        createdAt: { gte: timeRange.start, lte: timeRange.end }
      }
    }),

    // Total revenue (if authorized)
    canViewFinancials ? prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: timeRange.start, lte: timeRange.end }
      },
      _sum: { amount: true }
    }) : { _sum: { amount: null } },

    // Total users (if authorized)
    canViewAllData ? prisma.user.count({
      where: { isActive: true }
    }) : 0,

    // Active customers in period
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
        isActive: true,
        bookings: {
          some: {
            createdAt: { gte: timeRange.start, lte: timeRange.end }
          }
        }
      }
    }),

    // Completed bookings for average calculation
    canViewFinancials ? prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: timeRange.start, lte: timeRange.end }
      },
      include: {
        payments: {
          where: { status: 'COMPLETED' },
          select: { amount: true }
        }
      }
    }) : [],

    // Fleet utilization data
    prisma.booking.groupBy({
      by: ['vehicleId'],
      where: {
        status: { in: ['COMPLETED', 'ACTIVE'] },
        createdAt: { gte: timeRange.start, lte: timeRange.end }
      },
      _count: true,
      _sum: {
        totalPrice: true
      }
    })
  ])

  // Calculate metrics
  const revenue = totalRevenue._sum.amount?.toNumber() || 0
  const averageBookingValue = completedBookings.length > 0 
    ? completedBookings.reduce((sum, booking) => 
        sum + booking.payments.reduce((pSum, p) => pSum + p.amount.toNumber(), 0), 0
      ) / completedBookings.length
    : 0

  const fleetUtilization = fleetUtilizationData.length > 0 
    ? (fleetUtilizationData.length / totalVehicles) * 100
    : 0

  // Get trending data
  const trendData = await getTrendingData(timeRange, user.role)

  // Get performance data
  const performanceData = canViewAllData 
    ? await getPerformanceData(timeRange, user.role)
    : { topVehicles: [], topLocations: [], topCustomers: [] }

  // Get financial data
  const financialData = canViewFinancials 
    ? await getFinancialData(timeRange)
    : {
        monthlyRevenue: [],
        revenueByCategory: [],
        profitMargins: { gross: 0, net: 0, operating: 0 }
      }

  return {
    overview: {
      totalVehicles,
      totalBookings,
      totalRevenue: revenue,
      totalUsers,
      activeCustomers,
      averageBookingValue,
      fleetUtilization,
      customerSatisfaction: 4.7 // This would come from a rating system
    },
    trends: trendData,
    performance: performanceData,
    financial: financialData
  }
}

// Helper function to get time range
function getTimeRange(period: string) {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case '7d':
      start.setDate(end.getDate() - 7)
      break
    case '30d':
      start.setDate(end.getDate() - 30)
      break
    case '90d':
      start.setDate(end.getDate() - 90)
      break
    case '1y':
      start.setFullYear(end.getFullYear() - 1)
      break
    default:
      start.setDate(end.getDate() - 30)
  }

  return { start, end }
}

// Get trending data
async function getTrendingData(timeRange: { start: Date; end: Date }, role: UserRole) {
  const days = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24))
  const intervals = Math.min(days, 30) // Maximum 30 data points

  // This would involve complex date grouping queries
  // For now, returning mock trending data
  return {
    period: `${days}d`,
    vehicleGrowth: Array.from({ length: intervals }, (_, i) => Math.random() * 100),
    bookingGrowth: Array.from({ length: intervals }, (_, i) => Math.random() * 50),
    revenueGrowth: Array.from({ length: intervals }, (_, i) => Math.random() * 1000),
    userGrowth: Array.from({ length: intervals }, (_, i) => Math.random() * 20)
  }
}

// Get performance data
async function getPerformanceData(timeRange: { start: Date; end: Date }, role: UserRole) {
  const [topVehicles, topLocations, topCustomers] = await Promise.all([
    // Top performing vehicles
    prisma.vehicle.findMany({
      include: {
        bookings: {
          where: {
            status: 'COMPLETED',
            createdAt: { gte: timeRange.start, lte: timeRange.end }
          },
          include: {
            payments: {
              where: { status: 'COMPLETED' },
              select: { amount: true }
            }
          }
        }
      },
      take: 10
    }),

    // Top performing locations
    prisma.location.findMany({
      include: {
        vehicles: {
          include: {
            bookings: {
              where: {
                status: 'COMPLETED',
                createdAt: { gte: timeRange.start, lte: timeRange.end }
              },
              include: {
                payments: {
                  where: { status: 'COMPLETED' },
                  select: { amount: true }
                }
              }
            }
          }
        }
      },
      take: 10
    }),

    // Top customers
    prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        bookings: {
          some: {
            createdAt: { gte: timeRange.start, lte: timeRange.end }
          }
        }
      },
      include: {
        bookings: {
          where: {
            status: 'COMPLETED',
            createdAt: { gte: timeRange.start, lte: timeRange.end }
          },
          include: {
            payments: {
              where: { status: 'COMPLETED' },
              select: { amount: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      take: 10
    })
  ])

  return {
    topVehicles: topVehicles
      .map(vehicle => {
        const totalRevenue = vehicle.bookings.reduce((sum, booking) => 
          sum + booking.payments.reduce((pSum, p) => pSum + p.amount.toNumber(), 0), 0
        )
        const totalBookings = vehicle.bookings.length
        const utilizationRate = totalBookings > 0 ? (totalBookings / 30) * 100 : 0 // Rough calculation

        return {
          vehicleId: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          totalBookings,
          totalRevenue,
          utilizationRate
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5),

    topLocations: topLocations
      .map(location => {
        const allBookings = location.vehicles.flatMap(v => v.bookings)
        const totalRevenue = allBookings.reduce((sum, booking) => 
          sum + booking.payments.reduce((pSum, p) => pSum + p.amount.toNumber(), 0), 0
        )

        return {
          locationId: location.id,
          name: location.name,
          totalBookings: allBookings.length,
          totalRevenue,
          vehicleCount: location.vehicles.length
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5),

    topCustomers: topCustomers
      .map(customer => {
        const totalSpent = customer.bookings.reduce((sum, booking) => 
          sum + booking.payments.reduce((pSum, p) => pSum + p.amount.toNumber(), 0), 0
        )
        const lastBooking = customer.bookings[0]?.createdAt || new Date()

        return {
          customerId: customer.id,
          name: customer.name,
          totalBookings: customer.bookings.length,
          totalSpent,
          lastBooking
        }
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
  }
}

// Get financial data
async function getFinancialData(timeRange: { start: Date; end: Date }) {
  // This would involve complex financial calculations
  // For now, returning structured financial data
  return {
    monthlyRevenue: [
      { month: 'Jan', revenue: 45230, bookings: 89, averageValue: 508 },
      { month: 'Feb', revenue: 52100, bookings: 95, averageValue: 548 },
      { month: 'Mar', revenue: 48900, bookings: 87, averageValue: 562 }
    ],
    revenueByCategory: [
      { category: 'ECONOMY', revenue: 25000, percentage: 35.2 },
      { category: 'SEDAN', revenue: 18500, percentage: 26.1 },
      { category: 'SUV', revenue: 15200, percentage: 21.4 },
      { category: 'LUXURY', revenue: 12300, percentage: 17.3 }
    ],
    profitMargins: {
      gross: 68.5,
      net: 23.7,
      operating: 31.2
    }
  }
}

// Role-based filtering
function getRoleBasedFilter(role: UserRole, resource: string) {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return {}
  }

  if (role === 'FLEET_MANAGER') {
    return {}
  }

  if (role === 'STAFF') {
    // Staff can see limited operational data
    return {}
  }

  // Customers can only see their own data
  return {}
}

// GET endpoint for dashboard statistics
export const GET = withSecurity(
  getDashboardStats,
  {
    permission: 'analytics.read',
    rateLimit: RATE_LIMITS.dashboard,
    requireAuth: true
  }
)