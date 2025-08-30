"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface RareProduct {
  id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  rarity: string
}

const rareProducts: RareProduct[] = [
  {
    id: '1',
    name: 'Vintage Camera Collection',
    description: 'Rare 1950s Leica cameras in mint condition',
    price: 2499.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Collectibles',
    rarity: 'Ultra Rare'
  },
  {
    id: '2',
    name: 'Handcrafted Wooden Desk',
    description: 'One-of-a-kind artisan desk made from reclaimed oak',
    price: 1899.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Furniture',
    rarity: 'Limited Edition'
  },
  {
    id: '3',
    name: 'Antique Pocket Watch',
    description: 'Swiss-made pocket watch from the 1800s',
    price: 899.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Jewelry',
    rarity: 'Vintage'
  },
  {
    id: '4',
    name: 'Artisan Ceramic Vase',
    description: 'Hand-thrown ceramic vase by renowned potter',
    price: 599.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Home Decor',
    rarity: 'Handcrafted'
  },
  {
    id: '5',
    name: 'Limited Edition Sneakers',
    description: 'Only 100 pairs made worldwide',
    price: 799.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Footwear',
    rarity: 'Limited Edition'
  },
  {
    id: '6',
    name: 'Custom Guitar',
    description: 'Hand-built acoustic guitar with unique inlay',
    price: 3499.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    category: 'Musical Instruments',
    rarity: 'Custom Made'
  }
]

export function DiscoverRareFinds() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Rare Finds
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated collection of unique, niche, and hard-to-find products that tell a story
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rareProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.rarity}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price.toLocaleString()}
                  </span>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 block text-center group-hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/rare-finds"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Discover More
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 