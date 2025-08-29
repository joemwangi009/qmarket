'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins } from 'lucide-react'
import { formatPrice, formatCryptoPrice } from '@/lib/utils'

interface ProductPricingProps {
  price: number
  currency?: string
}

// Mock crypto prices - in production, this would come from CoinGecko API
const mockCryptoPrices = {
  BTC: { price: 43250.67, change24h: 2.45 },
  ETH: { price: 2650.34, change24h: -1.23 },
  USDT: { price: 1.00, change24h: 0.01 },
  USDC: { price: 1.00, change24h: 0.02 },
  BNB: { price: 312.45, change24h: 3.67 },
  LTC: { price: 68.92, change24h: -0.85 },
}

// Mock fiat exchange rates
const mockFiatRates = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.50,
  CAD: 1.35,
  AUD: 1.52,
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ price, currency = 'USD' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currency)
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true)
      setTimeout(() => setIsUpdating(false), 500)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateCryptoPrice = (usdPrice: number, crypto: string) => {
    const cryptoData = mockCryptoPrices[crypto as keyof typeof mockCryptoPrices]
    if (!cryptoData) return null
    return usdPrice / cryptoData.price
  }

  const calculateFiatPrice = (usdPrice: number, targetCurrency: string) => {
    const rate = mockFiatRates[targetCurrency as keyof typeof mockFiatRates]
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

  const formatFiatPrice = (price: number, curr: string) => {
    const symbol = getCurrencySymbol(curr)
    if (curr === 'JPY') {
      return `${symbol}${Math.round(price).toLocaleString()}`
    }
    return `${symbol}${price.toFixed(2)}`
  }

  const currentFiatPrice = calculateFiatPrice(price, selectedCurrency)
  const currentCryptoPrice = calculateCryptoPrice(price, selectedCrypto)
  const cryptoData = mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices]

  return (
    <div className="space-y-6">
      {/* Main Price Display */}
      <div className="space-y-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-blue-600">
            {formatFiatPrice(currentFiatPrice, selectedCurrency)}
          </span>
          {selectedCurrency !== 'USD' && (
            <span className="text-lg text-gray-500">
              ({formatPrice(price)})
            </span>
          )}
        </div>

        {/* Crypto Price Display */}
        {currentCryptoPrice && (
          <motion.div
            key={selectedCrypto}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
          >
            <Coins className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                ~{formatCryptoPrice(currentCryptoPrice, selectedCrypto)}
              </div>
              <div className="text-sm text-gray-600">
                Based on current {selectedCrypto} price
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                cryptoData.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
              </span>
              {cryptoData.change24h >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Currency Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Select Currency</h3>
        
        {/* Fiat Currencies */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fiat Currencies</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(mockFiatRates).map((curr) => (
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
                  {formatFiatPrice(calculateFiatPrice(price, curr), curr)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cryptocurrencies */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cryptocurrencies</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(mockCryptoPrices).map((crypto) => (
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
                  {formatCryptoPrice(calculateCryptoPrice(price, crypto) || 0, crypto)}
                </div>
              </button>
            ))}
          </div>
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

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="mb-1">💡 <strong>Price Information:</strong></p>
        <ul className="space-y-1">
          <li>• Fiat prices are updated in real-time</li>
          <li>• Crypto prices are approximate and may vary</li>
          <li>• Final price is calculated at checkout</li>
          <li>• All transactions are processed in USD</li>
        </ul>
      </div>
    </div>
  )
} 