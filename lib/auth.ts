import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import type { User, UserRole } from '@/lib/generated/prisma'

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-this'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-fallback-refresh-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12')

// Token interfaces
export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string | null
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date | null
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Token utilities
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'fleetflow',
    audience: 'fleetflow-users',
  })
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'fleetflow',
    audience: 'fleetflow-users',
  })
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'fleetflow',
      audience: 'fleetflow-users',
    }) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

export function verifyRefreshToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'fleetflow',
      audience: 'fleetflow-users',
    }) as { userId: string }
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
}

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return null
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Return user without password hash
    const { passwordHash, ...authUser } = user
    return authUser
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'CUSTOMER',
  phone?: string
): Promise<AuthUser | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role,
        phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
      },
    })

    return user
  } catch (error) {
    console.error('User creation error:', error)
    return null
  }
}

export async function generateAuthTokens(user: AuthUser): Promise<AuthTokens> {
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  const refreshToken = generateRefreshToken(user.id)

  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setTime(expiresAt.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  // Store refresh token in database
  await prisma.session.create({
    data: {
      userId: user.id,
      sessionToken: accessToken,
      refreshToken,
      expiresAt,
    },
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN,
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
  try {
    // Verify refresh token
    const { userId } = verifyRefreshToken(refreshToken)

    // Find session in database
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        userId,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            isActive: true,
            emailVerified: true,
            lastLogin: true,
          },
        },
      },
    })

    if (!session || !session.user.isActive) {
      return null
    }

    // Generate new tokens
    const newTokens = await generateAuthTokens(session.user)

    // Delete old session
    await prisma.session.delete({
      where: { id: session.id },
    })

    return newTokens
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

export async function revokeSession(sessionToken: string): Promise<boolean> {
  try {
    await prisma.session.deleteMany({
      where: { sessionToken },
    })
    return true
  } catch (error) {
    console.error('Session revocation error:', error)
    return false
  }
}

export async function revokeAllUserSessions(userId: string): Promise<boolean> {
  try {
    await prisma.session.deleteMany({
      where: { userId },
    })
    return true
  } catch (error) {
    console.error('All sessions revocation error:', error)
    return false
  }
}

// User utilities
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
      },
    })

    return user && user.isActive ? user : null
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
      },
    })

    return user && user.isActive ? user : null
  } catch (error) {
    console.error('Get user by email error:', error)
    return null
  }
}

// RBAC utilities
export const PERMISSIONS = {
  // User Management
  'users.read': ['SUPER_ADMIN', 'ADMIN'],
  'users.create': ['SUPER_ADMIN', 'ADMIN'],
  'users.update': ['SUPER_ADMIN', 'ADMIN'],
  'users.delete': ['SUPER_ADMIN'],
  
  // Fleet Management
  'vehicles.read': ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER', 'STAFF'],
  'vehicles.create': ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER'],
  'vehicles.update': ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER'],
  'vehicles.delete': ['SUPER_ADMIN', 'ADMIN'],
  
  // Booking Management
  'bookings.read': ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER', 'STAFF'],
  'bookings.create': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER'],
  'bookings.update': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
  'bookings.cancel': ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER'],
  
  // Payment Management
  'payments.read': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
  'payments.process': ['SUPER_ADMIN', 'ADMIN', 'STAFF'],
  'payments.refund': ['SUPER_ADMIN', 'ADMIN'],
  
  // Analytics
  'analytics.read': ['SUPER_ADMIN', 'ADMIN', 'FLEET_MANAGER'],
  
  // Customer Data (own data only for customers)
  'bookings.read.own': ['CUSTOMER'],
  'payments.read.own': ['CUSTOMER'],
} as const

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles ? allowedRoles.includes(userRole) : false
}

export function canAccessResource(
  userRole: UserRole,
  permission: keyof typeof PERMISSIONS,
  resourceUserId?: string,
  currentUserId?: string
): boolean {
  // Check if user has general permission
  if (hasPermission(userRole, permission)) {
    return true
  }

  // Check if it's a "own" permission and user is accessing their own data
  if (
    permission.endsWith('.own') &&
    userRole === 'CUSTOMER' &&
    resourceUserId === currentUserId
  ) {
    return true
  }

  return false
}