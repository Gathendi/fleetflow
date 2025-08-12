import { PrismaClient } from '@/lib/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

// Extend the global object to include prisma
declare global {
  var __prisma: PrismaClient | undefined
}

// Create Prisma client with proper configuration
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

  // Add Accelerate extension for performance optimization
  return client.$extends(withAccelerate())
}

// Use global variable in development to prevent multiple instances
export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Database connection helper
export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to database successfully')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

// Database disconnection helper
export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect()
    console.log('✅ Disconnected from database successfully')
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error)
    throw error
  }
}

// Health check helper
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    return { status: 'unhealthy', error: error, timestamp: new Date().toISOString() }
  }
}

// Transaction helper with retry logic
export async function executeTransaction<T>(
  fn: (tx: typeof prisma) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      })
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries) {
        console.warn(`Transaction attempt ${attempt} failed, retrying...`, error)
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  throw lastError
}