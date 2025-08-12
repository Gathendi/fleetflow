import { PrismaClient } from '../lib/generated/prisma'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create locations
  console.log('📍 Creating locations...')
  const locations = []
  
  // Check and create locations individually
  let downtown = await prisma.location.findFirst({ where: { name: 'Downtown Branch' } })
  if (!downtown) {
    downtown = await prisma.location.create({
      data: {
        name: 'Downtown Branch',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '(555) 123-4567',
        email: 'downtown@fleetflow.com',
        latitude: 40.7589,
        longitude: -73.9851,
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
      },
    })
  }
  locations.push(downtown)

  let airport = await prisma.location.findFirst({ where: { name: 'Airport Location' } })
  if (!airport) {
    airport = await prisma.location.create({
      data: {
        name: 'Airport Location',
        address: 'JFK Airport Terminal 4',
        city: 'Queens',
        state: 'NY',
        zipCode: '11430',
        phone: '(555) 987-6543',
        email: 'airport@fleetflow.com',
        latitude: 40.6413,
        longitude: -73.7781,
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '06:00', close: '22:00' },
          sunday: { open: '06:00', close: '22:00' },
        },
      },
    })
  }
  locations.push(airport)

  let serviceCenter = await prisma.location.findFirst({ where: { name: 'Service Center' } })
  if (!serviceCenter) {
    serviceCenter = await prisma.location.create({
      data: {
        name: 'Service Center',
        address: '456 Industrial Blvd',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        phone: '(555) 456-7890',
        email: 'service@fleetflow.com',
        latitude: 40.6892,
        longitude: -73.9442,
        operatingHours: {
          monday: { open: '07:00', close: '19:00' },
          tuesday: { open: '07:00', close: '19:00' },
          wednesday: { open: '07:00', close: '19:00' },
          thursday: { open: '07:00', close: '19:00' },
          friday: { open: '07:00', close: '19:00' },
          saturday: { open: '08:00', close: '17:00' },
          sunday: { closed: true },
        },
      },
    })
  }
  locations.push(serviceCenter)

  // Create users
  console.log('👥 Creating users...')
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@fleetflow.com' },
      update: {},
      create: {
        email: 'admin@fleetflow.com',
        passwordHash: await hashPassword('password'),
        name: 'John Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'manager@fleetflow.com' },
      update: {},
      create: {
        email: 'manager@fleetflow.com',
        passwordHash: await hashPassword('password'),
        name: 'Sarah Manager',
        role: 'FLEET_MANAGER',
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'staff@fleetflow.com' },
      update: {},
      create: {
        email: 'staff@fleetflow.com',
        passwordHash: await hashPassword('password'),
        name: 'Mike Staff',
        role: 'STAFF',
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer@fleetflow.com' },
      update: {},
      create: {
        email: 'customer@fleetflow.com',
        passwordHash: await hashPassword('password'),
        name: 'Emma Customer',
        role: 'CUSTOMER',
        phone: '(555) 123-4567',
        isActive: true,
        emailVerified: true,
      },
    }),
  ])

  // Create services
  console.log('🛍️ Creating services...')
  const services = []
  const serviceData = [
    {
      name: 'GPS Navigation',
      description: 'Built-in GPS navigation system',
      price: 5.00,
      unit: 'PER_DAY' as const,
      category: 'Technology',
    },
    {
      name: 'Child Seat',
      description: 'Safety-certified child car seat',
      price: 8.00,
      unit: 'PER_DAY' as const,
      category: 'Safety',
    },
    {
      name: 'Premium Insurance',
      description: 'Comprehensive insurance coverage with zero deductible',
      price: 25.00,
      unit: 'PER_DAY' as const,
      category: 'Insurance',
    },
    {
      name: 'WiFi Hotspot',
      description: 'Mobile WiFi hotspot device',
      price: 7.00,
      unit: 'PER_DAY' as const,
      category: 'Technology',
    },
    {
      name: 'Additional Driver',
      description: 'Add an additional authorized driver',
      price: 12.00,
      unit: 'PER_DAY' as const,
      category: 'Driver',
    },
  ]

  for (const serviceInfo of serviceData) {
    let service = await prisma.service.findFirst({ where: { name: serviceInfo.name } })
    if (!service) {
      service = await prisma.service.create({ data: serviceInfo })
    }
    services.push(service)
  }

  // Create vehicles
  console.log('🚗 Creating vehicles...')
  const vehicles = []
  
  // Toyota Camry
  let camry = await prisma.vehicle.findFirst({ where: { licensePlate: 'ABC-123' } })
  if (!camry) {
    camry = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        licensePlate: 'ABC-123',
        vin: '1HGBH41JXMN109186',
        category: 'SEDAN',
        status: 'AVAILABLE',
        locationId: locations[0].id,
        pricePerDay: 45.00,
        pricePerWeek: 280.00,
        pricePerMonth: 1100.00,
        fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC',
        seats: 5,
        doors: 4,
        fuelCapacity: 60.0,
        currentFuelLevel: 85.0,
        mileage: 15420,
        features: ['Bluetooth', 'GPS Navigation', 'Backup Camera', 'AC', 'Cruise Control'],
        color: 'Silver',
        condition: 'Excellent',
        images: {
          create: [
            {
              url: '/toyota-camry-sedan.png',
              isPrimary: true,
              alt: 'Toyota Camry 2023 - Front View',
            },
          ],
        },
      },
    })
  }
  vehicles.push(camry)

  // Honda CR-V
  let crv = await prisma.vehicle.findFirst({ where: { licensePlate: 'XYZ-789' } })
  if (!crv) {
    crv = await prisma.vehicle.create({
      data: {
        make: 'Honda',
        model: 'CR-V',
        year: 2022,
        licensePlate: 'XYZ-789',
        vin: '2HGBH41JXMN109187',
        category: 'SUV',
        status: 'AVAILABLE',
        locationId: locations[1].id,
        pricePerDay: 65.00,
        pricePerWeek: 420.00,
        pricePerMonth: 1650.00,
        fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC',
        seats: 7,
        doors: 4,
        fuelCapacity: 70.0,
        currentFuelLevel: 60.0,
        mileage: 28350,
        features: ['AWD', 'Backup Camera', 'Bluetooth', 'AC', 'Roof Rails'],
        color: 'Blue',
        condition: 'Good',
        images: {
          create: [
            {
              url: '/honda-crv-suv.png',
              isPrimary: true,
              alt: 'Honda CR-V 2022 - Front View',
            },
          ],
        },
      },
    })
  }
  vehicles.push(crv)

  // BMW X5
  let bmw = await prisma.vehicle.findFirst({ where: { licensePlate: 'BMW-456' } })
  if (!bmw) {
    bmw = await prisma.vehicle.create({
      data: {
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'BMW-456',
        vin: '3HGBH41JXMN109188',
        category: 'LUXURY',
        status: 'MAINTENANCE',
        locationId: locations[2].id,
        pricePerDay: 120.00,
        pricePerWeek: 780.00,
        pricePerMonth: 3000.00,
        fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC',
        seats: 7,
        doors: 4,
        fuelCapacity: 80.0,
        currentFuelLevel: 40.0,
        mileage: 8920,
        features: ['Leather Seats', 'Premium Audio', 'Navigation', 'Panoramic Roof', 'Heated Seats'],
        color: 'Black',
        condition: 'Excellent',
        images: {
          create: [
            {
              url: '/bmw-x5-luxury-suv.png',
              isPrimary: true,
              alt: 'BMW X5 2023 - Front View',
            },
          ],
        },
      },
    })
  }
  vehicles.push(bmw)

  // Tesla Model 3
  let tesla = await prisma.vehicle.findFirst({ where: { licensePlate: 'TSL-321' } })
  if (!tesla) {
    tesla = await prisma.vehicle.create({
      data: {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        licensePlate: 'TSL-321',
        vin: '4HGBH41JXMN109189',
        category: 'ELECTRIC',
        status: 'AVAILABLE',
        locationId: locations[0].id,
        pricePerDay: 85.00,
        pricePerWeek: 550.00,
        pricePerMonth: 2100.00,
        fuelType: 'ELECTRIC',
        transmission: 'AUTOMATIC',
        seats: 5,
        doors: 4,
        fuelCapacity: 75.0, // kWh for electric
        currentFuelLevel: 92.0,
        mileage: 12500,
        features: ['Autopilot', 'Premium Audio', 'Supercharging', 'Glass Roof', 'Mobile Connector'],
        color: 'White',
        condition: 'Excellent',
        images: {
          create: [
            {
              url: '/tesla-model-3.png',
              isPrimary: true,
              alt: 'Tesla Model 3 2023 - Front View',
            },
          ],
        },
      },
    })
  }
  vehicles.push(tesla)

  // Create maintenance records
  console.log('🔧 Creating maintenance records...')
  await prisma.maintenanceRecord.createMany({
    data: [
      {
        vehicleId: vehicles[2].id, // BMW X5
        type: 'ROUTINE',
        description: 'Oil change and tire rotation',
        cost: 150.00,
        performedBy: 'Mike Johnson',
        performedAt: new Date('2024-12-01'),
        nextDueDate: new Date('2025-03-01'),
        nextDueMiles: 15000,
        status: 'COMPLETED',
        notes: 'All fluids checked and topped off',
      },
      {
        vehicleId: vehicles[1].id, // Honda CR-V
        type: 'REPAIR',
        description: 'Brake pad replacement',
        cost: 320.00,
        performedBy: 'Sarah Wilson',
        performedAt: new Date('2024-11-20'),
        status: 'COMPLETED',
        notes: 'Front brake pads replaced, rotors resurfaced',
      },
    ],
  })

  console.log('✅ Database seed completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${locations.length} locations`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${services.length} services`)
  console.log(`   - ${vehicles.length} vehicles`)
  console.log(`   - 2 maintenance records`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })