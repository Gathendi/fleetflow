import { NextRequest } from 'next/server'
import { withSecurity, AuthContext, RATE_LIMITS, logAuditEvent } from '@/lib/api-security'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@/lib/generated/prisma'

// Alert types and priorities
type AlertType = 'system' | 'maintenance' | 'booking' | 'payment' | 'security' | 'inventory'
type AlertPriority = 'low' | 'medium' | 'high' | 'critical'
type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed'

interface DashboardAlert {
  id: string
  type: AlertType
  priority: AlertPriority
  status: AlertStatus
  title: string
  message: string
  details?: string
  timestamp: Date
  expiresAt?: Date
  acknowledgeddBy?: string
  acknowledgedAt?: Date
  resolvedBy?: string
  resolvedAt?: Date
  resourceType?: string
  resourceId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

interface AlertsResponse {
  alerts: DashboardAlert[]
  summary: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    unacknowledged: number
  }
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical'
    uptime: number
    lastCheck: Date
    services: Array<{
      name: string
      status: 'online' | 'offline' | 'degraded'
      lastCheck: Date
    }>
  }
}

// Get dashboard alerts
async function getDashboardAlerts(
  request: NextRequest,
  context: AuthContext
): Promise<AlertsResponse> {
  const { user } = context
  const { searchParams } = new URL(request.url)
  
  const status = searchParams.get('status') as AlertStatus | null
  const type = searchParams.get('type') as AlertType | null
  const priority = searchParams.get('priority') as AlertPriority | null
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')

  // Log audit event
  await logAuditEvent(
    request,
    context,
    'VIEW',
    'DASHBOARD_ALERTS',
    undefined,
    undefined,
    { filters: { status, type, priority }, role: user.role }
  )

  // Generate real-time alerts based on system state
  const systemAlerts = await generateSystemAlerts(user.role)
  
  // Get stored notifications that qualify as alerts
  const storedAlerts = await getStoredAlerts(user.id, user.role, { status, type, priority, limit, offset })
  
  // Combine and deduplicate alerts
  const allAlerts = [...systemAlerts, ...storedAlerts]
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })
    .slice(offset, offset + limit)

  // Calculate summary
  const summary = {
    total: allAlerts.length,
    critical: allAlerts.filter(a => a.priority === 'critical').length,
    high: allAlerts.filter(a => a.priority === 'high').length,
    medium: allAlerts.filter(a => a.priority === 'medium').length,
    low: allAlerts.filter(a => a.priority === 'low').length,
    unacknowledged: allAlerts.filter(a => a.status === 'active').length
  }

  // System health check
  const systemHealth = await getSystemHealth()

  return {
    alerts: allAlerts,
    summary,
    systemHealth
  }
}

// Generate real-time system alerts
async function generateSystemAlerts(userRole: UserRole): Promise<DashboardAlert[]> {
  const alerts: DashboardAlert[] = []
  const now = new Date()
  
  // Only generate alerts for authorized roles
  if (!['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER'].includes(userRole)) {
    return alerts
  }

  try {
    // Vehicle maintenance alerts
    const maintenanceDue = await prisma.vehicle.findMany({
      where: {
        OR: [
          { nextMaintenanceDate: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }, // Due within 7 days
          { currentFuelLevel: { lt: 20 } }, // Low fuel
          { mileage: { gte: 200000 } } // High mileage
        ]
      },
      include: {
        location: { select: { name: true } }
      }
    })

    for (const vehicle of maintenanceDue) {
      let alertType: AlertType = 'maintenance'
      let priority: AlertPriority = 'medium'
      let title = ''
      let message = ''

      if (vehicle.nextMaintenanceDate && vehicle.nextMaintenanceDate <= new Date(Date.now() + 24 * 60 * 60 * 1000)) {
        priority = 'high'
        title = 'Urgent Maintenance Required'
        message = `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) requires immediate maintenance`
      } else if (vehicle.currentFuelLevel < 10) {
        priority = 'high'
        alertType = 'inventory'
        title = 'Critical Fuel Level'
        message = `${vehicle.make} ${vehicle.model} has only ${vehicle.currentFuelLevel}% fuel remaining`
      } else if (vehicle.currentFuelLevel < 20) {
        priority = 'medium'
        alertType = 'inventory'
        title = 'Low Fuel Alert'
        message = `${vehicle.make} ${vehicle.model} needs refueling (${vehicle.currentFuelLevel}% remaining)`
      } else if (vehicle.mileage >= 200000) {
        priority = 'medium'
        title = 'High Mileage Vehicle'
        message = `${vehicle.make} ${vehicle.model} has ${vehicle.mileage.toLocaleString()} miles`
      }

      if (title) {
        alerts.push({
          id: `vehicle-${vehicle.id}-${alertType}`,
          type: alertType,
          priority,
          status: 'active',
          title,
          message,
          timestamp: now,
          resourceType: 'vehicle',
          resourceId: vehicle.id,
          actionUrl: `/dashboard/fleet/${vehicle.id}`,
          metadata: {
            vehicleId: vehicle.id,
            locationName: vehicle.location.name,
            licensePlate: vehicle.licensePlate
          }
        })
      }
    }

    // Payment issues
    const failedPayments = await prisma.payment.count({
      where: {
        status: 'FAILED',
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })

    if (failedPayments > 0) {
      alerts.push({
        id: `payments-failed-${now.getTime()}`,
        type: 'payment',
        priority: failedPayments > 5 ? 'high' : 'medium',
        status: 'active',
        title: 'Payment Processing Issues',
        message: `${failedPayments} payment(s) failed in the last 24 hours`,
        timestamp: now,
        actionUrl: '/dashboard/payments?status=failed',
        metadata: { failedCount: failedPayments }
      })
    }

    // Booking anomalies
    const overdueReturns = await prisma.booking.count({
      where: {
        status: 'ACTIVE',
        endDate: { lt: now }
      }
    })

    if (overdueReturns > 0) {
      alerts.push({
        id: `bookings-overdue-${now.getTime()}`,
        type: 'booking',
        priority: overdueReturns > 10 ? 'high' : 'medium',
        status: 'active',
        title: 'Overdue Vehicle Returns',
        message: `${overdueReturns} vehicle(s) not returned on time`,
        timestamp: now,
        actionUrl: '/dashboard/bookings?status=overdue',
        metadata: { overdueCount: overdueReturns }
      })
    }

    // System capacity alerts
    const vehicleUtilization = await prisma.vehicle.count({
      where: { status: 'RENTED' }
    })
    const totalVehicles = await prisma.vehicle.count({
      where: { status: { in: ['AVAILABLE', 'RENTED'] } }
    })
    const utilizationRate = totalVehicles > 0 ? (vehicleUtilization / totalVehicles) * 100 : 0

    if (utilizationRate > 90) {
      alerts.push({
        id: `capacity-high-${now.getTime()}`,
        type: 'system',
        priority: 'high',
        status: 'active',
        title: 'High Fleet Utilization',
        message: `Fleet is ${utilizationRate.toFixed(1)}% utilized - consider expanding inventory`,
        timestamp: now,
        actionUrl: '/dashboard/analytics',
        metadata: { utilizationRate }
      })
    }

    // Security alerts (example: multiple failed login attempts)
    const recentFailedLogins = await prisma.auditLog.count({
      where: {
        action: 'FAILED_LOGIN',
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      }
    })

    if (recentFailedLogins > 10) {
      alerts.push({
        id: `security-failed-logins-${now.getTime()}`,
        type: 'security',
        priority: 'high',
        status: 'active',
        title: 'Multiple Failed Login Attempts',
        message: `${recentFailedLogins} failed login attempts in the last hour`,
        timestamp: now,
        actionUrl: '/dashboard/security',
        metadata: { failedLoginCount: recentFailedLogins }
      })
    }

  } catch (error) {
    console.error('Error generating system alerts:', error)
    
    // Add system error alert
    alerts.push({
      id: `system-error-${now.getTime()}`,
      type: 'system',
      priority: 'critical',
      status: 'active',
      title: 'System Monitoring Error',
      message: 'Unable to generate some alerts due to system error',
      timestamp: now,
      metadata: { error: error.message }
    })
  }

  return alerts
}

// Get stored alerts from notifications
async function getStoredAlerts(
  userId: string, 
  userRole: UserRole, 
  filters: {
    status?: AlertStatus | null
    type?: AlertType | null
    priority?: AlertPriority | null
    limit: number
    offset: number
  }
): Promise<DashboardAlert[]> {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      type: { in: ['alert', 'warning', 'error'] },
      ...(filters.status === 'active' && { isRead: false }),
      ...(filters.status === 'acknowledged' && { isRead: true })
    },
    orderBy: { createdAt: 'desc' },
    take: filters.limit,
    skip: filters.offset
  })

  return notifications.map(notification => {
    const metadata = notification.metadata as any || {}
    
    return {
      id: notification.id,
      type: (metadata.alertType as AlertType) || 'system',
      priority: (metadata.priority as AlertPriority) || 'medium',
      status: notification.isRead ? 'acknowledged' : 'active',
      title: notification.title,
      message: notification.message,
      timestamp: notification.createdAt,
      resourceType: metadata.resourceType,
      resourceId: metadata.resourceId,
      actionUrl: metadata.actionUrl,
      metadata
    }
  })
}

// Get system health status
async function getSystemHealth() {
  const now = new Date()
  
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Check various system components
    const services = [
      {
        name: 'Database',
        status: 'online' as const,
        lastCheck: now
      },
      {
        name: 'Payment Gateway',
        status: 'online' as const, // This would be a real check
        lastCheck: now
      },
      {
        name: 'Email Service',
        status: 'online' as const, // This would be a real check
        lastCheck: now
      },
      {
        name: 'File Storage',
        status: 'online' as const, // This would be a real check
        lastCheck: now
      }
    ]

    const offlineServices = services.filter(s => s.status === 'offline')
    const degradedServices = services.filter(s => s.status === 'degraded')

    let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (offlineServices.length > 0) {
      systemStatus = 'critical'
    } else if (degradedServices.length > 0) {
      systemStatus = 'warning'
    }

    return {
      status: systemStatus,
      uptime: process.uptime(),
      lastCheck: now,
      services
    }
  } catch (error) {
    console.error('System health check failed:', error)
    
    return {
      status: 'critical' as const,
      uptime: 0,
      lastCheck: now,
      services: [
        {
          name: 'Database',
          status: 'offline' as const,
          lastCheck: now
        }
      ]
    }
  }
}

// Mark alert as acknowledged
async function acknowledgeAlert(
  request: NextRequest,
  context: AuthContext
): Promise<{ success: boolean; message: string }> {
  const { user } = context
  const body = await request.json()
  const { alertId, action } = body

  // Log audit event
  await logAuditEvent(
    request,
    context,
    'UPDATE',
    'ALERT',
    alertId,
    undefined,
    { action, acknowledgedBy: user.id }
  )

  try {
    if (alertId.startsWith('vehicle-') || alertId.startsWith('payments-') || alertId.startsWith('bookings-')) {
      // System-generated alerts - create notification record
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Alert ${action}d`,
          message: `Alert ${alertId} was ${action}d by ${user.name}`,
          type: 'system',
          isRead: true,
          metadata: {
            originalAlertId: alertId,
            action,
            acknowledgedBy: user.id,
            acknowledgedAt: new Date()
          }
        }
      })
    } else {
      // Stored notification alert
      await prisma.notification.update({
        where: { id: alertId },
        data: { isRead: action === 'acknowledge' }
      })
    }

    return {
      success: true,
      message: `Alert ${action}d successfully`
    }
  } catch (error) {
    console.error('Failed to acknowledge alert:', error)
    throw new Error('Failed to update alert status')
  }
}

// GET endpoint for alerts
export const GET = withSecurity(
  getDashboardAlerts,
  {
    permission: 'analytics.read',
    rateLimit: RATE_LIMITS.dashboard,
    requireAuth: true
  }
)

// POST endpoint for alert actions
export const POST = withSecurity(
  acknowledgeAlert,
  {
    permission: 'analytics.read',
    rateLimit: RATE_LIMITS.default,
    requireAuth: true
  }
)