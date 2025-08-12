import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Shield, Users, BarChart3, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-crimson-900/90 to-brand-crimson-700/70"></div>

        <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Side - Brand and Description */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="flex items-center mb-6">
                <Car className="h-16 w-16 text-brand-peach mr-4" />
                <h1 className="text-6xl font-bold font-display bg-gradient-to-r from-white to-brand-peach bg-clip-text text-transparent">
                  FleetFlow
                </h1>
              </div>

              <h2 className="text-3xl lg:text-4xl font-semibold leading-tight text-white/95">
                Premium Car Rental Management Platform
              </h2>

              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Streamline your fleet operations with comprehensive vehicle tracking, intelligent booking management,
                and powerful analytics dashboard designed for modern businesses.
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Shield className="h-5 w-5 text-brand-peach" />
                  <span className="text-white/90">Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5 text-brand-peach" />
                  <span className="text-white/90">Multi-Role Access</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <BarChart3 className="h-5 w-5 text-brand-peach" />
                  <span className="text-white/90">Real-time Analytics</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Interface */}
            <div className="flex justify-center lg:justify-end animate-slide-up">
              <Card className="w-full max-w-md glass border-brand-peach/30 shadow-brand-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-brand-crimson font-display">Welcome Back</CardTitle>
                  <CardDescription className="text-neutral-600">
                    Sign in to access your FleetFlow dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-brand-crimson">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-brand-crimson/60" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-10 h-12 border-brand-peach/50 focus-brand" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-brand-crimson">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-brand-crimson/60" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Enter your password" 
                          className="pl-10 h-12 border-brand-peach/50 focus-brand" 
                        />
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="w-full h-12 bg-brand-crimson hover:bg-brand-crimson-700 text-white shadow-brand-md hover:shadow-brand-lg transition-all duration-200">
                    <Link href="/auth/login">Sign In to Dashboard</Link>
                  </Button>

                  <div className="text-center space-y-3">
                    <p className="text-sm text-neutral-600">
                      Don't have an account?{" "}
                      <Link href="/auth/register" className="text-brand-crimson hover:text-brand-crimson-700 font-medium">
                        Create Account
                      </Link>
                    </p>

                    <div className="pt-4 border-t border-brand-peach/30">
                      <p className="text-xs text-neutral-500 mb-2">Demo Accounts (password: "password"):</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-brand-peach/20 rounded-lg border border-brand-peach/30">
                          <div className="font-medium text-brand-crimson">Admin</div>
                          <div className="text-neutral-600">admin@fleetflow.com</div>
                        </div>
                        <div className="text-center p-2 bg-brand-peach/20 rounded-lg border border-brand-peach/30">
                          <div className="font-medium text-brand-crimson">Customer</div>
                          <div className="text-neutral-600">customer@fleetflow.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-brand-peach/10 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl lg:text-4xl font-bold text-brand-crimson mb-4 font-display">
              Everything You Need to Manage Your Fleet
            </h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From vehicle tracking to customer management, FleetFlow provides all the tools you need to run a
              successful car rental business with enterprise-grade features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-brand-lg transition-all duration-300 border-brand-peach/20 group">
              <CardHeader className="pb-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-crimson to-brand-crimson-700 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-brand-crimson font-semibold mb-3">
                  Role-Based Access Control
                </CardTitle>
                <CardDescription className="text-base text-neutral-600 leading-relaxed">
                  Secure authentication with customized dashboards for admins, managers, staff, and customers with 
                  granular permission controls.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-brand-lg transition-all duration-300 border-brand-peach/20 group">
              <CardHeader className="pb-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-crimson to-brand-crimson-700 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-brand-crimson font-semibold mb-3">
                  Comprehensive Fleet Management
                </CardTitle>
                <CardDescription className="text-base text-neutral-600 leading-relaxed">
                  Complete vehicle lifecycle management with maintenance scheduling, availability tracking, and 
                  multi-location support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-brand-lg transition-all duration-300 border-brand-peach/20 group">
              <CardHeader className="pb-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-crimson to-brand-crimson-700 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-brand-crimson font-semibold mb-3">
                  Advanced Analytics
                </CardTitle>
                <CardDescription className="text-base text-neutral-600 leading-relaxed">
                  Real-time insights into revenue, utilization rates, and performance metrics with interactive charts 
                  and detailed reporting.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
