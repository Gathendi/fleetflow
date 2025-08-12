"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType, UserRole } from "@/types/auth"
import { authenticateUser, createUser } from "@/lib/mock-auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("fleetflow_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const authenticatedUser = await authenticateUser(email, password)
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("fleetflow_user", JSON.stringify(authenticatedUser))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = "customer",
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      const newUser = await createUser(email, password, name, role)
      if (newUser) {
        setUser(newUser)
        localStorage.setItem("fleetflow_user", JSON.stringify(newUser))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fleetflow_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
