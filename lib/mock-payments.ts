import type { Payment, PaymentMethod, Refund } from "@/types/payment"

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "credit_card",
    name: "Visa ending in 4242",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    brand: "visa",
    isDefault: true,
    customerId: "user_customer",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "pm_2",
    type: "credit_card",
    name: "Mastercard ending in 5555",
    last4: "5555",
    expiryMonth: 8,
    expiryYear: 2026,
    brand: "mastercard",
    isDefault: false,
    customerId: "user_customer",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "pm_3",
    type: "paypal",
    name: "PayPal Account",
    isDefault: false,
    customerId: "user_customer",
    createdAt: new Date("2024-03-10"),
  },
]

export const mockPayments: Payment[] = [
  {
    id: "pay_1",
    bookingId: "booking_1",
    customerId: "user_customer",
    amount: 24000,
    currency: "USD",
    status: "completed",
    paymentMethodId: "pm_1",
    transactionId: "txn_1234567890",
    description: "Toyota Camry rental - 3 days",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    completedAt: new Date("2024-01-20"),
  },
  {
    id: "pay_2",
    bookingId: "booking_2",
    customerId: "user_customer",
    amount: 45000,
    currency: "USD",
    status: "completed",
    paymentMethodId: "pm_2",
    transactionId: "txn_0987654321",
    description: "Honda CR-V rental - 5 days",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    completedAt: new Date("2024-02-15"),
  },
  {
    id: "pay_3",
    bookingId: "booking_3",
    customerId: "user_customer",
    amount: 35000,
    currency: "USD",
    status: "pending",
    paymentMethodId: "pm_1",
    transactionId: "txn_1122334455",
    description: "Tesla Model 3 rental - 2 days",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

export const mockRefunds: Refund[] = [
  {
    id: "ref_1",
    paymentId: "pay_1",
    amount: 5000,
    reason: "Customer requested early return",
    status: "completed",
    processedBy: "user_admin",
    createdAt: new Date("2024-01-25"),
    completedAt: new Date("2024-01-25"),
  },
]

// Mock payment processing functions
export const processPayment = async (paymentData: {
  amount: number
  paymentMethodId: string
  bookingId: string
  customerId: string
}): Promise<Payment> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate random success/failure
  const success = Math.random() > 0.1 // 90% success rate

  const payment: Payment = {
    id: `pay_${Date.now()}`,
    bookingId: paymentData.bookingId,
    customerId: paymentData.customerId,
    amount: paymentData.amount,
    currency: "USD",
    status: success ? "completed" : "failed",
    paymentMethodId: paymentData.paymentMethodId,
    transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
    description: "Vehicle rental payment",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: success ? new Date() : undefined,
    failureReason: success ? undefined : "Insufficient funds",
  }

  return payment
}

export const processRefund = async (paymentId: string, amount: number, reason: string): Promise<Refund> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const refund: Refund = {
    id: `ref_${Date.now()}`,
    paymentId,
    amount,
    reason,
    status: "completed",
    processedBy: "user_admin",
    createdAt: new Date(),
    completedAt: new Date(),
  }

  return refund
}
