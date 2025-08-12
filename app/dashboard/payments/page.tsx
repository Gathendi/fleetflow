"use client"

import { useAuth } from "@/contexts/auth-context"
import { PaymentHistory } from "@/components/payment/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import { mockPaymentMethods } from "@/lib/mock-payments"

export default function PaymentsPage() {
  const { user } = useAuth()

  if (!user) return null

  const customerPaymentMethods = mockPaymentMethods.filter((pm) => pm.customerId === user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Billing</h1>
        <p className="text-muted-foreground">Manage your payment methods and view transaction history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerPaymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No payment methods saved</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {customerPaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.type === "credit_card" && (
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        )}
                      </div>
                      {method.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Your payment activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">$690.00</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Transactions</p>
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-lg font-semibold text-green-700">$50.00</p>
              <p className="text-sm text-green-600">Total Refunds</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <PaymentHistory customerId={user.id} />
    </div>
  )
}
