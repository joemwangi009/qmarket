'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, formatCryptoPrice } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  onAddToCart: (product: Product) => void
}

// Mock crypto prices - in production, this would come from CoinGecko API
const mockCryptoPrices = {
  BTC: 43250.67,
  ETH: 2650.34,
  USDT: 1.00,
  USDC: 1.00,
  BNB: 312.45,
  LTC: 68.92,
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode, onAddToCart }) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const calculateCryptoPrice = (usdPrice: number, crypto: string) => {
    const cryptoPrice = mockCryptoPrices[crypto as keyof typeof mockCryptoPrices]
    if (!cryptoPrice) return null
    return usdPrice / cryptoPrice
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(product)
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex">
              {/* Product Image */}
              <div className="w-48 h-48 flex-shrink-0">
                <div className="w-full h-full bg-gray-200 rounded-l-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-500 text-sm text-center px-4">{product.name}</span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {product.category}</span>
                      <span>Stock: {product.inventory}</span>
                      {product.isFeatured && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatPrice(product.price)}
                    </div>
                    
                    {/* Crypto Prices */}
                    <div className="space-y-1 mb-4">
                      <div className="text-sm text-gray-600">
                        ~{formatCryptoPrice(calculateCryptoPrice(product.price, 'BTC') || 0, 'BTC')}
                      </div>
                      <div className="text-sm text-gray-600">
                        ~{formatCryptoPrice(calculateCryptoPrice(product.price, 'ETH') || 0, 'ETH')}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-end mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                      
                      <Link
                        href={`/product/${product.slug}`}
                        className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Product Image */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center px-4">{product.name}</span>
            </div>
            
            {/* Quick Actions Overlay */}
            <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4 transition-opacity duration-200 ${
              hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
              
              <Link
                href={`/product/${product.slug}`}
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                <Eye className="h-5 w-5" />
              </Link>
              
              <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
            )}

            {/* Stock Badge */}
            {product.inventory < 10 && (
              <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Low Stock
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              <Link href={`/product/${product.slug}`} className="hover:text-blue-600 transition-colors">
                {product.name}
              </Link>
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
              
              {/* Crypto Prices */}
              <div className="text-sm text-gray-500 space-y-1 mt-1">
                <div>~{formatCryptoPrice(calculateCryptoPrice(product.price, 'BTC') || 0, 'BTC')}</div>
                <div>~{formatCryptoPrice(calculateCryptoPrice(product.price, 'ETH') || 0, 'ETH')}</div>
              </div>
            </div>

            {/* Category */}
            <div className="text-xs text-gray-500 mb-3">
              {product.category}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 