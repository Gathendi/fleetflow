"use client"

import type React from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="md:ml-64">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
