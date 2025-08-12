import type { User, UserRole } from "@/types/auth"

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@fleetflow.com",
    name: "John Admin",
    role: "super_admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "manager@fleetflow.com",
    name: "Sarah Manager",
    role: "fleet_manager",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    email: "staff@fleetflow.com",
    name: "Mike Staff",
    role: "staff",
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date(),
  },
  {
    id: "4",
    email: "customer@fleetflow.com",
    name: "Emma Customer",
    role: "customer",
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date(),
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple mock authentication - in real app, this would be secure
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return { ...user, lastLogin: new Date() }
  }
  return null
}

export const createUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole = "customer",
): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    return null
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    createdAt: new Date(),
  }

  mockUsers.push(newUser)
  return newUser
}
