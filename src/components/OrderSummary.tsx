'use client'

import React from 'react'

import { Coins, Clock, Shield, Truck } from 'lucide-react'
import { formatPrice, formatCryptoPrice } from '@/lib/utils'
import { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  selectedCrypto: string
  cryptoPrices: Record<string, { price: number; change24h: number; transactionTime: string }>
  shippingInfo?: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  isCheckout?: boolean
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  selectedCrypto,
  cryptoPrices,
  shippingInfo,
  isCheckout = false,
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax
  const totalCrypto = total / cryptoPrices[selectedCrypto]?.price || 0

  const cryptoData = cryptoPrices[selectedCrypto]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-xs text-gray-500 text-center px-1">
                  {item.product.name}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h3>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="text-gray-900">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            ~{formatCryptoPrice(totalCrypto, selectedCrypto)}
          </div>
        </div>
      </div>

      {/* Crypto Payment Info */}
      {cryptoData && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Coins className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-900">
              {selectedCrypto} Payment Details
            </span>
          </div>
          <div className="space-y-2 text-sm text-purple-700">
            <div className="flex justify-between">
              <span>Current Price:</span>
              <span className="font-medium">${cryptoData.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>24h Change:</span>
              <span className={`font-medium ${
                cryptoData.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Time:</span>
              <span className="font-medium">{cryptoData.transactionTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Info (if provided) */}
      {shippingInfo && isCheckout && (
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>{shippingInfo.firstName} {shippingInfo.lastName}</div>
            <div>{shippingInfo.address}</div>
            <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
            <div>{shippingInfo.country}</div>
            <div>{shippingInfo.phone}</div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Secure Crypto Payment</span>
        </div>
        <div className="flex items-center space-x-2">
          <Truck className="h-4 w-4 text-blue-600" />
          <span>Free Shipping on Orders Over $50</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-orange-600" />
          <span>Instant Order Confirmation</span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 text-center">
          <div className="font-medium mb-1">🔒 Secure Checkout</div>
          <div>Your payment is protected by bank-level security</div>
          <div>No personal data required until after payment</div>
        </div>
      </div>
    </div>
  )
} 