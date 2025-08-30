export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  category: string
  tags: string[]
  inStock: boolean
  rating?: number
  reviewCount?: number
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  slug: string
  image?: string
  parentId?: string
  children?: Category[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  product: Product
}

export interface Address {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface CartItem {
  product: Product
  quantity: number
}

export interface PaymentSession {
  id: string
  paymentUrl: string
  status: 'pending' | 'completed' | 'failed'
}

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy?: 'price' | 'name' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
} 