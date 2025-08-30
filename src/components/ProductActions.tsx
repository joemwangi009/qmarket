'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Shield, Truck, Clock, AlertTriangle, CheckCircle, Coins } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

interface ProductActionsProps {
  product: Product
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const { addToCart } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) { // Set reasonable max quantity
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    addToCart(product, quantity)
    setIsAddingToCart(false)
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    addToCart(product, quantity)
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  const getInventoryStatus = () => {
    if (!product.inStock) {
      return {
        status: 'out-of-stock',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Out of Stock',
      }
    } else {
      return {
        status: 'in-stock',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'In Stock',
      }
    }
  }

  const inventoryStatus = getInventoryStatus()
  const StatusIcon = inventoryStatus.icon

  return (
    <div className="space-y-6">
      {/* Inventory Status */}
      <div className={`p-4 rounded-lg border ${inventoryStatus.bgColor} ${inventoryStatus.borderColor}`}>
        <div className="flex items-center space-x-3">
          <StatusIcon className={`h-5 w-5 ${inventoryStatus.color}`} />
          <div>
            <p className={`font-medium ${inventoryStatus.color}`}>
              {inventoryStatus.message}
            </p>
            {product.inStock && (
              <p className="text-sm text-gray-600">
                Available for immediate purchase
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      {product.inStock && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart Button */}
        {product.inStock && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-3"
          >
            {isAddingToCart ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        )}

        {/* Buy Now with Crypto Button */}
        {product.inStock && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
          >
            {isBuyingNow ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Coins className="h-5 w-5" />
                <span>Buy Now with Crypto</span>
              </>
            )}
          </motion.button>
        )}

        {/* Out of Stock Message */}
        {!product.inStock && (
          <div className="w-full bg-gray-100 text-gray-500 py-4 px-6 rounded-lg font-semibold text-center">
            Currently Out of Stock
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Coins className="h-4 w-4 text-purple-600" />
          <span>Secure Crypto Payment</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Truck className="h-4 w-4 text-blue-600" />
          <span>Free Shipping on Orders Over $50</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-orange-600" />
          <span>Instant Order Confirmation</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900">Secure Checkout</h4>
            <p className="text-sm text-green-700">
              Your payment is protected by bank-level security and encryption
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 space-y-2">
        <p>• All prices are in USD</p>
        <p>• Crypto prices are calculated at checkout</p>
        <p>• No personal data required until payment</p>
        <p>• 30-day money-back guarantee</p>
      </div>
    </div>
  )
} 