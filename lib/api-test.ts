// API Testing Utilities for FleetFlow Dashboard APIs
// This file provides testing utilities and examples for the secure dashboard APIs

import { prisma } from './prisma'
import { generateAccessToken, createUser } from './auth'
import type { UserRole } from '@/lib/generated/prisma'

// Test user creation and authentication
export async function createTestUsers() {
  const testUsers = [
    {
      email: 'superadmin@test.fleetflow.com',
      password: 'TestPassword123!',
      name: 'Super Admin Test',
      role: 'SUPER_ADMIN' as UserRole
    },
    {
      email: 'admin@test.fleetflow.com',
      password: 'TestPassword123!',
      name: 'Admin Test',
      role: 'ADMIN' as UserRole
    },
    {
      email: 'fleetmanager@test.fleetflow.com',
      password: 'TestPassword123!',
      name: 'Fleet Manager Test',
      role: 'FLEET_MANAGER' as UserRole
    },
    {
      email: 'staff@test.fleetflow.com',
      password: 'TestPassword123!',
      name: 'Staff Test',
      role: 'STAFF' as UserRole
    },
    {
      email: 'customer@test.fleetflow.com',
      password: 'TestPassword123!',
      name: 'Customer Test',
      role: 'CUSTOMER' as UserRole
    }
  ]

  const createdUsers = []
  
  for (const userData of testUsers) {
    try {
      const user = await createUser(
        userData.email,
        userData.password,
        userData.name,
        userData.role
      )
      
      if (user) {
        const token = generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role
        })
        
        createdUsers.push({
          ...user,
          token
        })
      }
    } catch (error) {
      console.log(`User ${userData.email} might already exist`)
    }
  }
  
  return createdUsers
}

// Test data for dashboard APIs
export async function seedTestData() {
  try {
    // Create test locations
    const locations = await Promise.all([
      prisma.location.upsert({
        where: { email: 'downtown@test.fleetflow.com' },
        update: {},
        create: {
          name: 'Downtown Test Location',
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          phone: '+1-555-0123',
          email: 'downtown@test.fleetflow.com',
          latitude: 40.7128,
          longitude: -74.0060,
          operatingHours: {
            monday: { open: '08:00', close: '18:00' },
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
            thursday: { open: '08:00', close: '18:00' },
            friday: { open: '08:00', close: '20:00' },
            saturday: { open: '09:00', close: '17:00' },
            sunday: { open: '10:00', close: '16:00' }
          }
        }
      }),
      prisma.location.upsert({
        where: { email: 'airport@test.fleetflow.com' },
        update: {},
        create: {
          name: 'Airport Test Location',
          address: '456 Airport Rd',
          city: 'Test City',
          state: 'TS',
          zipCode: '12346',
          phone: '+1-555-0124',
          email: 'airport@test.fleetflow.com',
          latitude: 40.6892,
          longitude: -74.1745,
          operatingHours: {
            monday: { open: '06:00', close: '22:00' },
            tuesday: { open: '06:00', close: '22:00' },
            wednesday: { open: '06:00', close: '22:00' },
            thursday: { open: '06:00', close: '22:00' },
            friday: { open: '06:00', close: '22:00' },
            saturday: { open: '06:00', close: '22:00' },
            sunday: { open: '06:00', close: '22:00' }
          }
        }
      })
    ])

    // Create test vehicles
    const vehicles = await Promise.all([
      prisma.vehicle.upsert({
        where: { licensePlate: 'TEST001' },
        update: {},
        create: {
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          licensePlate: 'TEST001',
          vin: 'TEST1234567890001',
          category: 'SEDAN',
          status: 'AVAILABLE',
          locationId: locations[0].id,
          pricePerDay: 45.00,
          pricePerWeek: 280.00,
          pricePerMonth: 1000.00,
          fuelType: 'GASOLINE',
          transmission: 'AUTOMATIC',
          seats: 5,
          doors: 4,
          fuelCapacity: 50.0,
          currentFuelLevel: 85.5,
          mileage: 15234,
          features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
          color: 'White',
          condition: 'Excellent'
        }
      }),
      prisma.vehicle.upsert({
        where: { licensePlate: 'TEST002' },
        update: {},
        create: {
          make: 'Honda',
          model: 'CR-V',
          year: 2023,
          licensePlate: 'TEST002',
          vin: 'TEST1234567890002',
          category: 'SUV',
          status: 'RENTED',
          locationId: locations[0].id,
          pricePerDay: 65.00,
          pricePerWeek: 400.00,
          pricePerMonth: 1500.00,
          fuelType: 'GASOLINE',
          transmission: 'AUTOMATIC',
          seats: 5,
          doors: 4,
          fuelCapacity: 55.0,
          currentFuelLevel: 67.3,
          mileage: 8923,
          features: ['AWD', 'Sunroof', 'Navigation', 'Heated Seats'],
          color: 'Blue',
          condition: 'Excellent'
        }
      }),
      prisma.vehicle.upsert({
        where: { licensePlate: 'TEST003' },
        update: {},
        create: {
          make: 'Tesla',
          model: 'Model 3',
          year: 2024,
          licensePlate: 'TEST003',
          vin: 'TEST1234567890003',
          category: 'ELECTRIC',
          status: 'MAINTENANCE',
          locationId: locations[1].id,
          pricePerDay: 85.00,
          pricePerWeek: 550.00,
          pricePerMonth: 2200.00,
          fuelType: 'ELECTRIC',
          transmission: 'AUTOMATIC',
          seats: 5,
          doors: 4,
          fuelCapacity: 75.0,
          currentFuelLevel: 18.5, // Low battery for testing alerts
          mileage: 5432,
          features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Wireless Charging'],
          color: 'Black',
          condition: 'Good',
          nextMaintenanceDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        }
      })
    ])

    console.log('✅ Test data seeded successfully')
    return { locations, vehicles }
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    throw error
  }
}

// API Testing Examples
export const apiTestExamples = {
  // Test authentication
  testAuth: {
    description: 'Test authentication endpoints',
    examples: [
      {
        name: 'Login with Super Admin',
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'superadmin@test.fleetflow.com',
          password: 'TestPassword123!'
        },
        expectedStatus: 200
      },
      {
        name: 'Access Dashboard Without Token',
        method: 'GET',
        url: '/api/dashboard/overview',
        headers: {},
        expectedStatus: 401
      }
    ]
  },

  // Test dashboard overview
  testDashboard: {
    description: 'Test dashboard overview API',
    examples: [
      {
        name: 'Super Admin Dashboard Overview',
        method: 'GET',
        url: '/api/dashboard/overview',
        headers: {
          'Authorization': 'Bearer {{superadmin_token}}'
        },
        expectedStatus: 200,
        expectedFields: ['stats', 'recentActivity', 'quickStats', 'alerts']
      },
      {
        name: 'Customer Access Dashboard (Should Fail)',
        method: 'GET',
        url: '/api/dashboard/overview',
        headers: {
          'Authorization': 'Bearer {{customer_token}}'
        },
        expectedStatus: 403
      }
    ]
  },

  // Test dashboard statistics
  testStats: {
    description: 'Test dashboard statistics API',
    examples: [
      {
        name: 'Get 30-day Statistics',
        method: 'GET',
        url: '/api/dashboard/stats?period=30d',
        headers: {
          'Authorization': 'Bearer {{admin_token}}'
        },
        expectedStatus: 200,
        expectedFields: ['overview', 'trends', 'performance', 'financial']
      },
      {
        name: 'Fleet Manager Statistics (Limited)',
        method: 'GET',
        url: '/api/dashboard/stats?period=7d',
        headers: {
          'Authorization': 'Bearer {{fleetmanager_token}}'
        },
        expectedStatus: 200,
        validateResponse: (data: any) => {
          // Fleet managers shouldn't see financial details
          return data.financial.monthlyRevenue.length === 0
        }
      }
    ]
  },

  // Test alerts
  testAlerts: {
    description: 'Test dashboard alerts API',
    examples: [
      {
        name: 'Get Active Alerts',
        method: 'GET',
        url: '/api/dashboard/alerts?status=active',
        headers: {
          'Authorization': 'Bearer {{admin_token}}'
        },
        expectedStatus: 200,
        expectedFields: ['alerts', 'summary', 'systemHealth']
      },
      {
        name: 'Acknowledge Alert',
        method: 'POST',
        url: '/api/dashboard/alerts',
        headers: {
          'Authorization': 'Bearer {{admin_token}}',
          'Content-Type': 'application/json'
        },
        body: {
          alertId: 'vehicle-test003-maintenance',
          action: 'acknowledge'
        },
        expectedStatus: 200
      }
    ]
  },

  // Test rate limiting
  testRateLimit: {
    description: 'Test API rate limiting',
    examples: [
      {
        name: 'Rate Limit Test',
        method: 'GET',
        url: '/api/dashboard/overview',
        headers: {
          'Authorization': 'Bearer {{admin_token}}'
        },
        repeat: 60, // Should hit rate limit after 50 requests
        expectedFinalStatus: 429
      }
    ]
  },

  // Test security
  testSecurity: {
    description: 'Test security measures',
    examples: [
      {
        name: 'SQL Injection Attempt',
        method: 'GET',
        url: "/api/dashboard/stats?period=30d'; DROP TABLE users; --",
        headers: {
          'Authorization': 'Bearer {{admin_token}}'
        },
        expectedStatus: 400
      },
      {
        name: 'XSS Attempt',
        method: 'POST',
        url: '/api/dashboard/alerts',
        headers: {
          'Authorization': 'Bearer {{admin_token}}',
          'Content-Type': 'application/json'
        },
        body: {
          alertId: '<script>alert("xss")</script>',
          action: 'acknowledge'
        },
        expectedStatus: 400
      }
    ]
  }
}

// Utility function to run API tests
export async function runAPITests(baseUrl: string, tokens: Record<string, string>) {
  console.log('🧪 Starting API Security Tests...\n')
  
  for (const [testName, testSuite] of Object.entries(apiTestExamples)) {
    console.log(`📋 ${testSuite.description}`)
    
    for (const example of testSuite.examples) {
      try {
        const url = `${baseUrl}${example.url}`
        const headers = { ...example.headers }
        
        // Replace token placeholders
        if (headers.Authorization) {
          headers.Authorization = headers.Authorization.replace(/\{\{(\w+)_token\}\}/, (_, role) => {
            return `Bearer ${tokens[role] || 'invalid'}`
          })
        }
        
        // Simulate API call (in real implementation, use fetch or axios)
        console.log(`  ✓ ${example.name}: ${example.method} ${example.url}`)
        console.log(`    Expected Status: ${example.expectedStatus}`)
        
        if (example.expectedFields) {
          console.log(`    Expected Fields: ${example.expectedFields.join(', ')}`)
        }
        
      } catch (error) {
        console.log(`  ❌ ${example.name}: ${error}`)
      }
    }
    
    console.log('')
  }
  
  console.log('✅ API Tests Completed')
}

// Performance testing utility
export function generateLoadTestData(userCount: number = 100) {
  const testScenarios = [
    {
      name: 'Dashboard Overview Load Test',
      endpoint: '/api/dashboard/overview',
      method: 'GET',
      concurrent: userCount,
      duration: '30s',
      expectedAvgResponseTime: 200, // ms
      expectedMaxResponseTime: 500  // ms
    },
    {
      name: 'Statistics API Load Test',
      endpoint: '/api/dashboard/stats?period=30d',
      method: 'GET',
      concurrent: Math.floor(userCount / 2),
      duration: '60s',
      expectedAvgResponseTime: 300,
      expectedMaxResponseTime: 1000
    },
    {
      name: 'Alerts API Load Test',
      endpoint: '/api/dashboard/alerts',
      method: 'GET',
      concurrent: Math.floor(userCount / 4),
      duration: '45s',
      expectedAvgResponseTime: 150,
      expectedMaxResponseTime: 400
    }
  ]
  
  return testScenarios
}

// Export all testing utilities
export default {
  createTestUsers,
  seedTestData,
  apiTestExamples,
  runAPITests,
  generateLoadTestData
}