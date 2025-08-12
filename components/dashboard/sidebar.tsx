"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Car,
  BarChart3,
  Calendar,
  Users,
  Settings,
  CreditCard,
  FileText,
  Shield,
  Menu,
  X,
  LogOut,
  Home,
  Wrench,
  MapPin,
} from "lucide-react"
import type { UserRole } from "@/types/auth"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
  badge?: string
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
    roles: ["super_admin", "admin", "fleet_manager", "staff", "customer"],
  },
  {
    title: "Fleet Management",
    href: "/dashboard/fleet",
    icon: Car,
    roles: ["super_admin", "admin", "fleet_manager", "staff"],
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
    roles: ["super_admin", "admin", "fleet_manager", "staff", "customer"],
  },
  {
    title: "My Bookings",
    href: "/dashboard/my-bookings",
    icon: Calendar,
    roles: ["customer"],
  },
  {
    title: "Browse Vehicles",
    href: "/dashboard/browse",
    icon: Car,
    roles: ["customer"],
  },
  {
    title: "Maintenance",
    href: "/dashboard/maintenance",
    icon: Wrench,
    roles: ["super_admin", "admin", "fleet_manager", "staff"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["super_admin", "admin", "fleet_manager"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
    roles: ["super_admin", "admin", "fleet_manager"],
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: ["super_admin", "admin", "customer"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["super_admin", "admin", "fleet_manager"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["super_admin", "admin", "fleet_manager", "staff", "customer"],
  },
  {
    title: "System Admin",
    href: "/dashboard/admin",
    icon: Shield,
    roles: ["super_admin"],
    badge: "Admin",
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "admin":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "fleet_manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "staff":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "customer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FleetFlow</h1>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <Badge className={getRoleColor(user?.role || "")} variant="secondary">
                {user?.role?.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={logout}>
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
