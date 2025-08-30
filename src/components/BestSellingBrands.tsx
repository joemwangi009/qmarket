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
    name: 'TechPro',
    logo: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    featuredProduct: {
      id: 'p1',
      name: 'Wireless Earbuds Pro',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      price: 129.99,
      originalPrice: 149.99
    }
  },
  {
    id: '2',
    name: 'SportFlex',
    logo: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    featuredProduct: {
      id: 'p2',
      name: 'Running Shoes Elite',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      price: 189.99,
      originalPrice: 209.99
    }
  },
  {
    id: '3',
    name: 'HomeStyle',
    logo: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    featuredProduct: {
      id: 'p3',
      name: 'Smart LED Lamp',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      price: 79.99,
      originalPrice: 99.99
    }
  },
  {
    id: '4',
    name: 'BeautyGlow',
    logo: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    featuredProduct: {
      id: 'p4',
      name: 'Organic Face Serum',
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      price: 49.99,
      originalPrice: 59.99
    }
  },
  {
    id: '5',
    name: 'KitchenCraft',
    logo: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    featuredProduct: {
      id: 'p5',
      name: 'Chef\'s Knife Set',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      price: 159.99,
      originalPrice: 179.99
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