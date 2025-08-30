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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/products">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-1">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 flex space-x-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/product/${item.product.slug}`} className="hover:text-blue-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600">{item.product.description}</p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                            disabled={isUpdating === item.product.id}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-gray-900 font-medium">
                            {isUpdating === item.product.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                            disabled={isUpdating === item.product.id}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={isUpdating === item.product.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleClearCart}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                  <Link href="/products">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <span>Continue Shopping</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>{formatPrice(totalUSD)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(totalUSD)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ({formatCryptoPrice(totalCrypto, selectedCrypto)})
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="w-full">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Coins className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-purple-500" />
                    <span>Secure crypto payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-500" />
                    <span>30-day easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 