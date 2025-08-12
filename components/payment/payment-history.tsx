"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, RefreshCw } from "lucide-react"
import { mockPayments, mockRefunds } from "@/lib/mock-payments"
import type { Payment, Refund } from "@/types/payment"

interface PaymentHistoryProps {
  customerId: string
}

export function PaymentHistory({ customerId }: PaymentHistoryProps) {
  const customerPayments = mockPayments.filter((payment) => payment.customerId === customerId)
  const paymentRefunds = mockRefunds.filter((refund) =>
    customerPayments.some((payment) => payment.id === refund.paymentId),
  )

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
      case "partially_refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRefundForPayment = (paymentId: string): Refund | undefined => {
    return paymentRefunds.find((refund) => refund.paymentId === paymentId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>View all your payment transactions and receipts</CardDescription>
      </CardHeader>
      <CardContent>
        {customerPayments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customerPayments.map((payment) => {
              const refund = getRefundForPayment(payment.id)
              return (
                <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">Transaction ID: {payment.transactionId}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-semibold">{formatAmount(payment.amount)}</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {refund && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Refund Processed</p>
                          <p className="text-xs text-muted-foreground">{refund.reason}</p>
                        </div>
                        <p className="text-sm font-medium">-{formatAmount(refund.amount)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                    {payment.status === "failed" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
