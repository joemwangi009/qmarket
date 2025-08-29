'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Settings, Star, Truck, CheckCircle } from 'lucide-react'

interface ProductTabsProps {
  description: string
  specifications: Record<string, string>
  reviews: Array<{
    id: string
    user: string
    rating: number
    title: string
    comment: string
    date: string
    verified: boolean
    photos?: string[]
  }>
  shippingInfo: {
    estimatedDelivery: string
    shippingMethods: Array<{
      name: string
      price: number
      deliveryTime: string
      description: string
    }>
    returnPolicy: string
    warranty: string
  }
}

const tabData = [
  { id: 'description', label: 'Description', icon: FileText },
  { id: 'specifications', label: 'Specifications', icon: Settings },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
]

export const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  specifications,
  reviews,
  shippingInfo,
}) => {
  const [activeTab, setActiveTab] = useState('description')

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="prose prose-gray max-w-none"
          >
            <div className="text-gray-700 leading-relaxed space-y-4">
              {description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )

      case 'specifications':
        return (
          <motion.div
            key="specifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 pb-4">
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {key}
                  </dt>
                  <dd className="text-base text-gray-900">{value}</dd>
                </div>
              ))}
            </div>
          </motion.div>
        )

      case 'reviews':
        return (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length))}
                    </div>
                    <p className="text-gray-600">
                      Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {review.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            {review.verified && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500 ml-2">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {review.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <span className="text-xs text-gray-500">Photo</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'shipping':
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {/* Estimated Delivery */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Estimated Delivery</h4>
                    <p className="text-blue-700">{shippingInfo.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Methods */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Methods</h4>
                <div className="space-y-3">
                  {shippingInfo.shippingMethods.map((method, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{method.name}</h5>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <p className="text-sm text-gray-500">Delivery: {method.deliveryTime}</p>
                        </div>
                        <span className="text-lg font-semibold text-blue-600">
                          ${method.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Policy & Warranty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                  <p className="text-sm text-gray-600">{shippingInfo.returnPolicy}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                  <p className="text-sm text-gray-600">{shippingInfo.warranty}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabData.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  )
} 