'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  ExternalLink,
  MapPin,
  CreditCard,
  Copy,
  Check
} from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'


// Mock order data - in production, this would come from API
const mockOrder = {
  id: 'ORD-001',
  date: '2024-01-15T10:30:00Z',
  status: 'Delivered',
  total: 299.99,
  subtotal: 274.99,
  shipping: 0,
  tax: 25.00,
  items: [
    { 
      name: 'Premium Wireless Headphones', 
      quantity: 1, 
      price: 274.99,
      image: '/api/placeholder/100/100'
    }
  ],
  trackingNumber: 'TRK-123456789',
  transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  paymentMethod: 'BTC',
  paymentAmount: '0.0069 BTC',
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    phone: '+1 (555) 123-4567'
  },
  timeline: [
    {
      status: 'Order Placed',
      date: '2024-01-15T10:30:00Z',
      description: 'Your order has been placed successfully',
      completed: true
    },
    {
      status: 'Payment Confirmed',
      date: '2024-01-15T10:35:00Z',
      description: 'Bitcoin payment has been confirmed on the blockchain',
      completed: true
    },
    {
      status: 'Order Confirmed',
      date: '2024-01-15T11:00:00Z',
      description: 'Your order has been confirmed and is being processed',
      completed: true
    },
    {
      status: 'Shipped',
      date: '2024-01-16T09:00:00Z',
      description: 'Your order has been shipped via Express Shipping',
      completed: true
    },
    {
      status: 'Delivered',
      date: '2024-01-18T14:30:00Z',
      description: 'Your order has been delivered successfully',
      completed: true
    }
  ]
}

const statusConfig = {
  'Pending': { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock },
  'Paid': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  'Confirmed': { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  'Shipped': { color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Truck },
  'Delivered': { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  'Cancelled': { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle }
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { user } = useAuth()
  const [order] = useState(mockOrder)
  const [copiedHash, setCopiedHash] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/signin'
    }
  }, [user])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
        <Icon className="h-4 w-4 mr-2" />
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBlockchainExplorerUrl = (hash: string, method: string) => {
    const methodMap: Record<string, string> = {
      'BTC': 'https://blockstream.info/tx/',
      'ETH': 'https://etherscan.io/tx/',
      'USDT': 'https://etherscan.io/tx/',
      'USDC': 'https://etherscan.io/tx/',
      'BNB': 'https://bscscan.com/tx/',
      'LTC': 'https://blockchair.com/litecoin/transaction/'
    }
    
    return methodMap[method] ? methodMap[method] + hash : '#'
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(order.status)}
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              {order.trackingNumber && (
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </button>
              )}
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500 text-center px-1">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                <div className="space-y-4">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{step.status}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(step.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                      <p className="text-sm text-gray-600">{order.paymentAmount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Hash
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={order.transactionHash}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(order.transactionHash)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedHash ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <a
                        href={getBlockchainExplorerUrl(order.transactionHash, order.paymentMethod)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                        title="View on blockchain explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="pt-3 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Number
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={order.trackingNumber}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(order.trackingNumber)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 