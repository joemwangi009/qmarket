import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PopularProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewCount: number
  isTrending?: boolean
}

const popularProducts: PopularProduct[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&crop=center',
    price: 1199,
    originalPrice: 1399,
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 2847,
    isTrending: true
  },
  {
    id: '2',
    name: 'Nike Air Jordan 1',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center',
    price: 170,
    originalPrice: 200,
    category: 'Shoes',
    rating: 4.8,
    reviewCount: 1956,
    isTrending: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop&crop=center',
    price: 399,
    originalPrice: 449,
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 1234,
    isTrending: true
  },
  {
    id: '4',
    name: 'MacBook Air M2',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center',
    price: 1199,
    originalPrice: 1299,
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 2156,
    isTrending: true
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=300&h=300&fit=crop&crop=center',
    price: 180,
    originalPrice: 220,
    category: 'Shoes',
    rating: 4.6,
    reviewCount: 987,
    isTrending: true
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24',
    image: 'https://images.unsplash.com/photo-1610945265064-0d34e4b0c0c7?w=300&h=300&fit=crop&crop=center',
    price: 999,
    originalPrice: 1199,
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 1678,
    isTrending: true
  },
  {
    id: '7',
    name: 'Canon EOS R6 Mark II',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop&crop=center',
    price: 2499,
    originalPrice: 2799,
    category: 'Photography',
    rating: 4.9,
    reviewCount: 892,
    isTrending: true
  },
  {
    id: '8',
    name: 'Apple Watch Series 9',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center',
    price: 399,
    originalPrice: 449,
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 1456,
    isTrending: true
  }
]

function StarRating({ rating }: { rating: number }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }

  return <div className="flex items-center space-x-1">{stars}</div>
}

export function PopularProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">
              Popular Products
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trending items across all categories that customers love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Trending Badge */}
                {product.isTrending && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.158-.105.303-.133.442-.174.676a1 1 0 01-.149.362c-.346.346-.346.346-.346.346s-.346-.346-.346-.346a1 1 0 01-.149-.362c-.041-.234-.069-.373-.174-.676a7.004 7.004 0 00-.57-1.158 6.004 6.004 0 00-.822-.88 1 1 0 00-1.45.385c-.23.345-.23.614-.23.822 0 .208 0 .477.23.822.23.345.614.614.822.88.214.33.403.713.57 1.158.105.303.133.442.174.676.041.234.069.373.174.676.167.445.356.828.57 1.158.208.266.592.535.822.88.23.345.23.614.23.822 0 .208 0 .477-.23.822-.23.345-.614.614-.822.88a7.004 7.004 0 00-.57 1.158c-.105.303-.133.442-.174.676a1 1 0 01-.149.362c-.346.346-.346.346-.346.346s-.346-.346-.346-.346a1 1 0 01-.149-.362c-.041-.234-.069-.373-.174-.676a7.004 7.004 0 00-.57-1.158 6.004 6.004 0 00-.822-.88 1 1 0 00-1.45.385c-.23.345-.23.614-.23.822 0-.208 0-.477.23-.822.23-.345.614-.614.822-.88.214-.33.403-.713.57-1.158.105-.303.133-.442.174-.676.041-.234.069-.373.174-.676.167-.445.356-.828.57-1.158.208-.266.592-.535.822-.88.23-.345.23-.614.23-.822z" clipRule="evenodd" />
                      </svg>
                      TRENDING
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-md">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-orange-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-300 block text-center shadow-lg hover:shadow-xl"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 