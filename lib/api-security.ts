import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, hasPermission, canAccessResource, getUserById } from './auth'
import type { UserRole } from '@/lib/generated/prisma'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const

// Rate limiting configuration
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

export const RATE_LIMITS = {
  default: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  auth: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 auth attempts per 15 minutes
  admin: { maxRequests: 200, windowMs: 15 * 60 * 1000 }, // Higher limit for admin operations
  dashboard: { maxRequests: 50, windowMs: 5 * 60 * 1000 }, // 50 dashboard requests per 5 minutes
} as const

// API Error types
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN')
  }
}

export class RateLimitError extends APIError {
  constructor(message = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED')
  }
}

export class ValidationError extends APIError {
  constructor(message = 'Validation failed') {
    super(400, message, 'VALIDATION_ERROR')
  }
}

// Authentication context
export interface AuthContext {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    isActive: boolean
  }
  token: string
}

// Request validation schemas
export interface RequestValidation {
  body?: any
  query?: any
  params?: any
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

// Rate limiting middleware
export function rateLimit(config: RateLimitConfig = RATE_LIMITS.default) {
  return async (request: NextRequest, identifier?: string) => {
    const key = identifier || getClientIP(request)
    const now = Date.now()
    const entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return
    }

    if (entry.count >= config.maxRequests) {
      throw new RateLimitError(config.message)
    }

    entry.count++
    rateLimitStore.set(key, entry)
  }
}

// JWT Authentication middleware
export async function authenticate(request: NextRequest): Promise<AuthContext> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = authHeader.substring(7)
  
  try {
    const payload = verifyAccessToken(token)
    const user = await getUserById(payload.userId)
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive')
    }

    return {
      user,
      token,
    }
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

// Authorization middleware
export function authorize(
  permission: string,
  options: {
    requireOwnership?: boolean
    allowSelf?: boolean
  } = {}
) {
  return async (context: AuthContext, resourceUserId?: string) => {
    const { user } = context
    
    // Check basic permission
    if (!hasPermission(user.role, permission as any)) {
      // Check if user can access their own resource
      if (options.allowSelf && resourceUserId === user.id) {
        return
      }
      
      throw new ForbiddenError('Insufficient permissions')
    }

    // Check resource ownership if required
    if (options.requireOwnership && resourceUserId && resourceUserId !== user.id) {
      if (!canAccessResource(user.role, permission as any, resourceUserId, user.id)) {
        throw new ForbiddenError('Cannot access this resource')
      }
    }
  }
}

// Input validation middleware
export function validateInput<T>(schema: any, data: any): T {
  try {
    // In a real application, you would use a validation library like Zod
    // For now, we'll do basic validation
    if (!data) {
      throw new ValidationError('Request data is required')
    }
    
    return data as T
  } catch (error) {
    throw new ValidationError(`Validation failed: ${error}`)
  }
}

// Sanitize output data
export function sanitizeOutput(data: any, userRole: UserRole): any {
  if (!data) return data

  // Remove sensitive fields based on user role
  const sensitiveFields = ['passwordHash', 'sessionToken', 'refreshToken']
  
  if (userRole !== 'SUPER_ADMIN') {
    sensitiveFields.push('ipAddress', 'userAgent')
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item, sensitiveFields))
  }

  return sanitizeObject(data, sensitiveFields)
}

function sanitizeObject(obj: any, fieldsToRemove: string[]): any {
  if (!obj || typeof obj !== 'object') return obj

  const sanitized = { ...obj }
  
  for (const field of fieldsToRemove) {
    delete sanitized[field]
  }

  return sanitized
}

// Security headers middleware
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

// API wrapper with security
export function withSecurity<T = any>(
  handler: (request: NextRequest, context: AuthContext, params?: any) => Promise<T>,
  options: {
    permission?: string
    rateLimit?: RateLimitConfig
    requireAuth?: boolean
    allowSelf?: boolean
    requireOwnership?: boolean
  } = {}
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    try {
      // Apply rate limiting
      if (options.rateLimit) {
        await rateLimit(options.rateLimit)(request)
      }

      // Authentication
      let authContext: AuthContext | undefined
      if (options.requireAuth !== false) {
        authContext = await authenticate(request)
      }

      // Authorization
      if (options.permission && authContext) {
        const resourceUserId = context?.params?.userId || context?.params?.id
        await authorize(options.permission, {
          allowSelf: options.allowSelf,
          requireOwnership: options.requireOwnership,
        })(authContext, resourceUserId)
      }

      // Execute handler
      const result = await handler(request, authContext!, context?.params)

      // Sanitize output
      const sanitizedResult = authContext 
        ? sanitizeOutput(result, authContext.user.role)
        : result

      // Create response with security headers
      const response = NextResponse.json({
        success: true,
        data: sanitizedResult,
      })

      return applySecurityHeaders(response)

    } catch (error) {
      console.error('API Error:', error)

      let statusCode = 500
      let message = 'Internal server error'
      let code = 'INTERNAL_ERROR'

      if (error instanceof APIError) {
        statusCode = error.statusCode
        message = error.message
        code = error.code || 'API_ERROR'
      }

      const errorResponse = NextResponse.json({
        success: false,
        error: {
          code,
          message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      }, { status: statusCode })

      return applySecurityHeaders(errorResponse)
    }
  }
}

// Audit logging
export async function logAuditEvent(
  request: NextRequest,
  context: AuthContext,
  action: string,
  resource: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any
) {
  try {
    const { prisma } = await import('./prisma')
    
    await prisma.auditLog.create({
      data: {
        userId: context.user.id,
        action,
        resource,
        resourceId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      },
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}