import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "FleetFlow - Premium Car Rental Management",
  description: "Professional car rental management platform with advanced fleet tracking, intelligent booking management, and powerful analytics",
  keywords: "car rental, fleet management, vehicle booking, automotive, rental platform",
  authors: [{ name: "FleetFlow Team" }],
  generator: "Next.js",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#A4193D",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <div id="root" className="relative">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  )
}
