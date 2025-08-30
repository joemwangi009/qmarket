'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Clock, Shield, Truck } from 'lucide-react'

interface ProductPricingProps {
  price: number
  originalPrice?: number
  currency?: string
  discount?: number
  freeShipping?: boolean
  inStock?: boolean
}

// Mock exchange rates for international customers
const mockExchangeRates = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.50,
  CAD: 1.35,
  AUD: 1.52,
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ 
  price, 
  originalPrice, 
  currency = 'USD',
  discount,
  freeShipping = false,
  inStock = true
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency)
  const [isUpdating, setIsUpdating] = useState(false)

  // Calculate discount percentage
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true)
      setTimeout(() => setIsUpdating(false), 500)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateLocalPrice = (usdPrice: number, targetCurrency: string) => {
    const rate = mockExchangeRates[targetCurrency as keyof typeof mockExchangeRates]
    if (!rate) return usdPrice
    return usdPrice * rate
  }

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
    }
    return symbols[curr] || '$'
  }

  const formatPrice = (price: number, curr: string) => {
    const symbol = getCurrencySymbol(curr)
    if (curr === 'JPY') {
      return `${symbol}${Math.round(price).toLocaleString()}`
    }
    return `${symbol}${price.toFixed(2)}`
  }

  const localPrice = calculateLocalPrice(price, selectedCurrency)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Main Price Display */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(localPrice, selectedCurrency)}
          </span>
          {originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(calculateLocalPrice(originalPrice, selectedCurrency), selectedCurrency)}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        {freeShipping && (
          <div className="flex items-center space-x-2 text-green-600">
            <Truck className="h-4 w-4" />
            <span className="text-sm font-medium">Free Shipping</span>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Currency Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Currency</h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(mockExchangeRates).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedCurrency === curr
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium">{curr}</div>
              <div className="text-xs text-gray-500">
                {formatPrice(calculateLocalPrice(price, curr), curr)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Update Indicator */}
      {isUpdating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-sm text-blue-600"
        >
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span>Updating prices...</span>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Why Shop with QMarket?</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secure payments with SSL encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Fast worldwide shipping</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>Best price guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>30-day easy returns</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="mb-1">💡 <strong>Price Information:</strong></p>
        <ul className="space-y-1">
          <li>• Prices are updated in real-time</li>
          <li>• Exchange rates are approximate</li>
          <li>• Final price is calculated at checkout</li>
          <li>• All transactions are secure and encrypted</li>
        </ul>
      </div>
    </div>
  )
} 