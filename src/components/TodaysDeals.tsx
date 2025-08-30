"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Deal {
  id: string
  name: string
  image: string
  originalPrice: number
  salePrice: number
  discount: number
  endTime: Date
  soldCount: number
  totalStock: number
}

const deals: Deal[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 129.99,
    salePrice: 79.99,
    discount: 38,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2 hours 15 minutes from now
    soldCount: 45,
    totalStock: 100
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 299.99,
    salePrice: 199.99,
    discount: 33,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000 + 32 * 60 * 1000), // 4 hours 32 minutes from now
    soldCount: 28,
    totalStock: 75
  },
  {
    id: '3',
    name: 'Portable Bluetooth Speaker',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 89.99,
    salePrice: 59.99,
    discount: 33,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000 + 18 * 60 * 1000), // 6 hours 18 minutes from now
    soldCount: 67,
    totalStock: 120
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 49.99,
    salePrice: 29.99,
    discount: 40,
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000), // 8 hours 45 minutes from now
    soldCount: 34,
    totalStock: 60
  },
  {
    id: '5',
    name: 'USB-C Power Bank',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 79.99,
    salePrice: 49.99,
    discount: 38,
    endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 22 * 60 * 1000), // 10 hours 22 minutes from now
    soldCount: 52,
    totalStock: 90
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    originalPrice: 119.99,
    salePrice: 79.99,
    discount: 33,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000 + 8 * 60 * 1000), // 12 hours 8 minutes from now
    soldCount: 41,
    totalStock: 150
  }
]

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor(distance / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className="flex space-x-1 text-xs">
      <div className="bg-red-600 text-white px-2 py-1 rounded font-mono font-bold">
        {timeLeft.hours.toString().padStart(2, '0')}
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded font-mono font-bold">
        {timeLeft.minutes.toString().padStart(2, '0')}
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded font-mono font-bold">
        {timeLeft.seconds.toString().padStart(2, '0')}
      </div>
    </div>
  )
}

export function TodaysDeals() {
  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Today&apos;s Deals
            </h2>
            <p className="text-lg text-gray-600">
              Limited time offers - Don&apos;t miss out!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-semibold">Flash Sale Active</span>
          </div>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-red-100"
              >
                {/* Product Image */}
                <div className="relative">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {deal.discount}% OFF
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="absolute top-4 right-4">
                    <CountdownTimer endTime={deal.endTime} />
                  </div>

                  {/* Stock Progress */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Sold: {deal.soldCount}</span>
                        <span>Stock: {deal.totalStock - deal.soldCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(deal.soldCount / deal.totalStock) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {deal.name}
                  </h3>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl font-bold text-red-600">
                      ${deal.salePrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${deal.originalPrice}
                    </span>
                    <span className="text-sm text-red-600 font-semibold">
                      Save ${deal.originalPrice - deal.salePrice}
                    </span>
                  </div>

                  <Link
                    href={`/product/${deal.id}`}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-300 block text-center shadow-lg hover:shadow-xl"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-red-200 rounded-full"></div>
            <div className="w-2 h-2 bg-red-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 