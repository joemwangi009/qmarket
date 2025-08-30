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
    name: 'Vintage Leica M3 Camera',
    description: 'Classic 1954 rangefinder camera in mint condition',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center',
    price: 4500,
    category: 'Photography',
    rarity: 'Limited Edition'
  },
  {
    id: '2',
    name: 'Handcrafted Japanese Chef Knife',
    description: 'Traditional Damascus steel blade by master craftsman',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400&h=400&fit=crop&crop=center',
    price: 1200,
    category: 'Kitchen',
    rarity: 'Artisan Made'
  },
  {
    id: '3',
    name: 'Antique Persian Rug',
    description: '19th century hand-woven silk carpet with intricate patterns',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
    price: 8500,
    category: 'Home Decor',
    rarity: 'Antique'
  },
  {
    id: '4',
    name: 'Swiss Mechanical Watch',
    description: 'Limited edition timepiece with tourbillon movement',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    price: 28000,
    category: 'Luxury',
    rarity: 'Exclusive'
  },
  {
    id: '5',
    name: 'Organic Tea Collection',
    description: 'Rare single-origin teas from remote mountain regions',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    price: 180,
    category: 'Beverages',
    rarity: 'Seasonal'
  },
  {
    id: '6',
    name: 'Artisan Leather Bag',
    description: 'Hand-stitched Italian leather with brass hardware',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&crop=center',
    price: 650,
    category: 'Fashion',
    rarity: 'Handmade'
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