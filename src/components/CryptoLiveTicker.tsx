'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

// Mock crypto data - in production, this would come from CoinGecko API
const mockCryptoData = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 43250.67,
    change24h: 2.45,
    marketCap: '847.2B',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2650.34,
    change24h: -1.23,
    marketCap: '318.7B',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: 1.00,
    change24h: 0.01,
    marketCap: '95.4B',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.00,
    change24h: 0.02,
    marketCap: '28.9B',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: 312.45,
    change24h: 3.67,
    marketCap: '47.2B',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 68.92,
    change24h: -0.85,
    marketCap: '5.1B',
  },
]

export const CryptoLiveTicker = () => {
  const [cryptoData, setCryptoData] = useState(mockCryptoData)
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setCryptoData(prevData =>
        prevData.map(coin => ({
          ...coin,
          price: coin.price + (Math.random() - 0.5) * 10,
          change24h: coin.change24h + (Math.random() - 0.5) * 0.1,
        }))
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${price.toFixed(4)}`
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0
    const icon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        {icon}
        <span>{Math.abs(change).toFixed(2)}%</span>
      </div>
    )
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <DollarSign className="h-8 w-8 text-green-400" />
            <h2 className="text-3xl sm:text-4xl font-bold">
              Live Crypto Prices
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Real-time cryptocurrency prices for seamless shopping experience
          </motion.p>

          {/* Live Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6"
          >
            <button
              onClick={() => setIsLive(!isLive)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isLive
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </button>
          </motion.div>
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoData.map((crypto, index) => (
            <motion.div
              key={crypto.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{crypto.symbol}</h3>
                  <p className="text-gray-400 text-sm">{crypto.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {formatPrice(crypto.price)}
                  </div>
                  <div className="text-sm text-gray-400">
                    MCap: {crypto.marketCap}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">24h Change</span>
                {formatChange(crypto.change24h)}
              </div>

              {/* Price Chart Placeholder */}
              <div className="mt-4 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">Chart View</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gray-800 rounded-xl p-6 inline-block">
            <p className="text-gray-300 text-sm">
              Prices update every 5 seconds • Data provided by CoinGecko API
            </p>
            <p className="text-gray-400 text-xs mt-2">
              All prices are for reference only. Actual payment amounts may vary slightly.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Shop with Crypto
          </a>
        </motion.div>
      </div>
    </section>
  )
} 