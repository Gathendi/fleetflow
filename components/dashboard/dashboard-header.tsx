import type React from "react"
interface DashboardHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        {children && <div className="flex items-center space-x-3">{children}</div>}
      </div>
    </div>
  )
}
