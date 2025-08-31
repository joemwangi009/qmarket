'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { fetchTodaysDeals } from '@/lib/products'
import { useCart } from '@/contexts/CartContext'
import { Star, ShoppingCart, Heart, Eye, Clock } from 'lucide-react'

export const TodaysDeals: React.FC = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTodaysDeals = async () => {
      try {
        setLoading(true)
        setError(null)
        const dealsProducts = await fetchTodaysDeals(6)
        setProducts(dealsProducts)
      } catch (err) {
        setError('Failed to load today\'s deals')
        console.error('Error loading today\'s deals:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTodaysDeals()
  }, [])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would open a quick view modal
    console.log('Quick view:', product.name)
  }

  const handleAddToWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would add to wishlist
    console.log('Add to wishlist:', product.name)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-gray-900 mb-4">Today&apos;s Deals</h2>
            <p className="text-gray-600">Limited time offers you don&apos;t want to miss</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return null // Don't show section if no deals
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-red-600 mr-3" />
                         <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Deals</h2>
          </div>
                     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             Limited time offers you don&apos;t want to miss. These deals won&apos;t last long!
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-red-100 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Deal badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1 animate-pulse" />
                    DEAL OF THE DAY
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Quick actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleQuickView(product, e)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Quick view"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => handleAddToWishlist(product, e)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Add to wishlist"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Stock status */}
                {!product.inStock && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-red-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Savings indicator */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-red-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-700 font-medium">
                        You save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                      <span className="text-red-600 font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!product.inStock}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  )
}