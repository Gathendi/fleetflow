"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Lock } from "lucide-react"
import { mockPaymentMethods, processPayment } from "@/lib/mock-payments"

interface PaymentFormProps {
  amount: number
  bookingId: string
  customerId: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export function PaymentForm({ amount, bookingId, customerId, onSuccess, onError }: PaymentFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
  })

  const customerPaymentMethods = mockPaymentMethods.filter((pm) => pm.customerId === customerId)
  const defaultPaymentMethod = customerPaymentMethods.find((pm) => pm.isDefault)

  const handlePayment = async () => {
    if (!selectedPaymentMethod && !showNewCardForm) {
      onError("Please select a payment method")
      return
    }

    setIsProcessing(true)
    try {
      const paymentMethodId = showNewCardForm ? "pm_new" : selectedPaymentMethod
      const payment = await processPayment({
        amount,
        paymentMethodId,
        bookingId,
        customerId,
      })

      if (payment.status === "completed") {
        onSuccess(payment.id)
      } else {
        onError(payment.failureReason || "Payment failed")
      }
    } catch (error) {
      onError("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Complete your booking payment securely</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold">{formatAmount(amount)}</span>
          </div>
        </div>

        {/* Saved Payment Methods */}
        {customerPaymentMethods.length > 0 && !showNewCardForm && (
          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <div className="space-y-2">
              {customerPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
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
                    </div>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Card Option */}
        {!showNewCardForm && (
          <Button variant="outline" onClick={() => setShowNewCardForm(true)} className="w-full">
            Add New Payment Method
          </Button>
        )}

        {/* New Card Form */}
        {showNewCardForm && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>New Payment Method</Label>
              <Button variant="ghost" size="sm" onClick={() => setShowNewCardForm(false)}>
                Cancel
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCardData.cardNumber}
                  onChange={(e) => setNewCardData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Select
                    value={newCardData.expiryMonth}
                    onValueChange={(value) => setNewCardData((prev) => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expiryYear">Year</Label>
                  <Select
                    value={newCardData.expiryYear}
                    onValueChange={(value) => setNewCardData((prev) => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                          {String(new Date().getFullYear() + i).slice(-2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={newCardData.cvc}
                    onChange={(e) => setNewCardData((prev) => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={newCardData.name}
                  onChange={(e) => setNewCardData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || (!selectedPaymentMethod && !showNewCardForm)}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Pay {formatAmount(amount)}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
