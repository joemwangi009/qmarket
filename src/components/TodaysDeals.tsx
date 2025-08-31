'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { fetchTodaysDeals } from '@/lib/products'
import { ChevronLeft, ChevronRight, Clock, ShoppingCart, Flame } from 'lucide-react'
import Link from 'next/link'

export default function TodaysDeals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dealsProducts = await fetchTodaysDeals(6)
        setProducts(dealsProducts)
      } catch (error) {
        console.error('Error loading today\'s deals:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= products.length ? 0 : prevIndex + 3
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, products.length - 3) : prevIndex - 3
    )
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Today&apos;s Deals</h2>
            <p className="text-gray-600">Loading amazing deals...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-6 rounded mb-4"></div>
                <div className="bg-gray-200 h-10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Today&apos;s Deals</h2>
            <p className="text-gray-600">No deals available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + 3)

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Flame className="w-8 h-8 text-red-500" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Today&apos;s Deals</h2>
              <p className="text-gray-600">Don&apos;t miss out! Limited time offers</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              disabled={currentIndex + 3 >= products.length}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href={`/product/${product.slug}`}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Deal
                  </div>
                </div>
              </Link>
              
              <div className="p-6">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-red-600">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Limited time offer</span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold text-yellow-500">{product.rating}</span>
                      <span className="ml-1">({product.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    product.inStock
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Deals
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}