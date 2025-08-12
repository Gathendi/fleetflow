export interface PaymentMethod {
  id: string
  type: "credit_card" | "debit_card" | "paypal" | "apple_pay" | "google_pay"
  name: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  brand?: string
  isDefault: boolean
  customerId: string
  createdAt: Date
}

export interface Payment {
  id: string
  bookingId: string
  customerId: string
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded"
  paymentMethodId: string
  transactionId: string
  description: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  failureReason?: string
}

export interface Refund {
  id: string
  paymentId: string
  amount: number
  reason: string
  status: "pending" | "processing" | "completed" | "failed"
  processedBy: string
  createdAt: Date
  completedAt?: Date
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "canceled"
  clientSecret: string
  metadata?: Record<string, any>
}

export interface Invoice {
  id: string
  bookingId: string
  customerId: string
  amount: number
  tax: number
  total: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "canceled"
  dueDate: Date
  paidAt?: Date
  items: InvoiceItem[]
  createdAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}
