"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Brand {
  id: string
  name: string
  logo: string
  featuredProduct: {
    id: string
    name: string
    image: string
    price: number
    originalPrice?: number
  }
}

const brands: Brand[] = [
  {
    id: '1',
    name: 'Apple',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p1',
      name: 'iPhone 15 Pro',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&crop=center',
      price: 999,
      originalPrice: 1199
    }
  },
  {
    id: '2',
    name: 'Samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0d34e4b0c0c7?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p2',
      name: 'Galaxy S24 Ultra',
      image: 'https://images.unsplash.com/photo-1610945265064-0d34e4b0c0c7?w=300&h=300&fit=crop&crop=center',
      price: 1199,
      originalPrice: 1399
    }
  },
  {
    id: '3',
    name: 'Nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p3',
      name: 'Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center',
      price: 150,
      originalPrice: 180
    }
  },
  {
    id: '4',
    name: 'Adidas',
    logo: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p4',
      name: 'Ultraboost 22',
      image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=300&h=300&fit=crop&crop=center',
      price: 180,
      originalPrice: 220
    }
  },
  {
    id: '5',
    name: 'Sony',
    logo: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p5',
      name: 'WH-1000XM5',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop&crop=center',
      price: 399,
      originalPrice: 449
    }
  },
  {
    id: '6',
    name: 'Canon',
    logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&crop=center',
    featuredProduct: {
      id: 'p6',
      name: 'EOS R6 Mark II',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop&crop=center',
      price: 2499,
      originalPrice: 2799
    }
  }
]

export function BestSellingBrands() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Best-Selling Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop the most trusted brands in technology, fashion, and lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Brand Logo */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {brand.name}
                </h3>
              </div>

              {/* Featured Product */}
              <div className="p-6">
                <div className="mb-4">
                  <Image
                    src={brand.featuredProduct.image}
                    alt={brand.featuredProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {brand.featuredProduct.name}
                </h4>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${brand.featuredProduct.price}
                    </span>
                    {brand.featuredProduct.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${brand.featuredProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/products?brand=${brand.name.toLowerCase()}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 block text-center group-hover:shadow-lg"
                >
                  Shop {brand.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 