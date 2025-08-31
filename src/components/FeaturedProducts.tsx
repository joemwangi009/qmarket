'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { fetchFeaturedProducts } from '@/lib/products'
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await fetchFeaturedProducts(8)
        setProducts(featuredProducts)
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= products.length ? 0 : prevIndex + 4
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, products.length - 4) : prevIndex - 4
    )
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + 4)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked products you&apos;ll love</p>
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
              disabled={currentIndex + 4 >= products.length}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/product/${product.slug}`}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  {product.rating && (
                    <>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviewCount})
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
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
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
} 