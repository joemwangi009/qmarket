export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  addresses: Address[]
  orders: Order[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  inventory: number
  category: string
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  total: number
  status: OrderStatus
  shippingAddressId: string
  transactionHash?: string
  paymentGatewayId?: string
  paymentGateway?: PaymentGateway
  items: OrderItem[]
  shippingAddress: Address
  user: User
  payment?: Payment
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  priceAtTime: number
  product: Product
  createdAt: Date
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  status: PaymentStatus
  gatewayResponse?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type PaymentGateway = 'NOWPAYMENTS' | 'COINBASE_COMMERCE'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
}

export interface PaymentSession {
  id: string
  paymentUrl: string
  expiresAt: Date
} 