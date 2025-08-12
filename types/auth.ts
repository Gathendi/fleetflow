export type UserRole = "super_admin" | "admin" | "fleet_manager" | "staff" | "customer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
