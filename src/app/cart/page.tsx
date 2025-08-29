'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Coins } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatCryptoPrice } from '@/lib/utils'

// Mock crypto prices - in production, this would come from CoinGecko API
const mockCryptoPrices = {
  BTC: { price: 43250.67, change24h: 2.45 },
  ETH: { price: 2650.34, change24h: -1.23 },
  USDT: { price: 1.00, change24h: 0.01 },
  USDC: { price: 1.00, change24h: 0.02 },
  BNB: { price: 312.45, change24h: 3.67 },
  LTC: { price: 68.92, change24h: -0.85 },
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const totalUSD = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const totalCrypto = totalUSD / mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].price

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(productId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    updateQuantity(productId, newQuantity)
    setIsUpdating(null)
  }

  const handleRemoveItem = async (productId: string) => {
    setIsUpdating(productId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    removeFromCart(productId)
    setIsUpdating(null)
  }

  const handleClearCart = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    clearCart()
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cart.items.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500 text-center px-2">
                              {item.product.name}
                            </span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link
                                  href={`/product/${item.product.slug}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">{item.product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-blue-600">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatPrice(item.product.price)} each
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                                disabled={isUpdating === item.product.id || item.quantity <= 1}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              
                              <span className="w-12 text-center text-sm font-medium">
                                {isUpdating === item.product.id ? (
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                                disabled={isUpdating === item.product.id || item.quantity >= item.product.inventory}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              disabled={isUpdating === item.product.id}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cart Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleClearCart}
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      Clear Cart
                    </button>
                    <Link
                      href="/products"
                      className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {/* Crypto Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay with Cryptocurrency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(mockCryptoPrices).map(([crypto, data]) => (
                      <button
                        key={crypto}
                        onClick={() => setSelectedCrypto(crypto)}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          selectedCrypto === crypto
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-medium">{crypto}</div>
                        <div className="text-xs text-gray-500">
                          ${data.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="text-gray-900">{formatPrice(totalUSD)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">{formatPrice(totalUSD)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ~{formatCryptoPrice(totalCrypto, selectedCrypto)}
                    </div>
                  </div>
                </div>

                {/* Crypto Price Info */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Coins className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      {selectedCrypto} Payment
                    </span>
                  </div>
                  <div className="text-xs text-purple-700 space-y-1">
                    <div>Current {selectedCrypto} Price: ${mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].price.toLocaleString()}</div>
                    <div>24h Change: {mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].change24h >= 0 ? '+' : ''}{mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].change24h.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 