'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const totalUSD = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

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
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
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
                          <p className="text-sm text-gray-500 mt-1">{item.product.description}</p>
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
              
              {/* Payment Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Methods
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-blue-50">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Credit/Debit Card</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-green-50">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">PayPal</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-purple-50">
                    <Truck className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Apple Pay</span>
                  </div>
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(totalUSD * 0.08)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(totalUSD * 1.08)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including tax and shipping</p>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="w-full">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
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