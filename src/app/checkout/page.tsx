'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Lock, Shield, Truck, CreditCard } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, formatCryptoPrice } from '@/lib/utils'

// Mock crypto prices - in production, this would come from CoinGecko API
const mockCryptoPrices = {
  BTC: { price: 43250.67, change24h: 2.45, transactionTime: '10-30 minutes' },
  ETH: { price: 2650.34, change24h: -1.23, transactionTime: '2-5 minutes' },
  USDT: { price: 1.00, change24h: 0.01, transactionTime: '1-3 minutes' },
  USDC: { price: 1.00, change24h: 0.02, transactionTime: '1-3 minutes' },
  BNB: { price: 312.45, change24h: 3.67, transactionTime: '3-5 minutes' },
  LTC: { price: 68.92, change24h: -0.85, transactionTime: '2-5 minutes' },
}

const checkoutSteps = [
  { id: 'cart', title: 'Cart Review', icon: Check },
  { id: 'shipping', title: 'Shipping & Info', icon: Truck },
  { id: 'payment', title: 'Payment Method', icon: CreditCard },
  { id: 'confirm', title: 'Payment', icon: Lock },
]

export default function CheckoutPage() {
  const { cart } = useCart()
  const [currentStep, setCurrentStep] = useState('cart')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const totalUSD = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const totalCrypto = totalUSD / mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].price

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      window.location.href = '/cart'
    }
  }, [cart.items.length])

  const handleNextStep = () => {
    const currentIndex = checkoutSteps.findIndex(step => step.id === currentStep)
    if (currentIndex < checkoutSteps.length - 1) {
      setCurrentStep(checkoutSteps[currentIndex + 1].id)
    }
  }

  const handlePrevStep = () => {
    const currentIndex = checkoutSteps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(checkoutSteps[currentIndex - 1].id)
    }
  }

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentGatewayRedirect = async () => {
    setIsProcessing(true)
    
    // Simulate order creation and payment gateway redirect
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, this would:
    // 1. Create order in database
    // 2. Generate payment session with NOWPayments/Coinbase Commerce
    // 3. Redirect to their secure payment page
    
    // For demo purposes, show success message
    alert('Order created successfully! Redirecting to payment gateway...')
    setIsProcessing(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'cart':
        return (
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Review Your Cart</h2>
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center px-1">
                        {item.product.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(totalUSD)}</span>
              </div>
            </div>
          </motion.div>
        )

      case 'shipping':
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            <p className="text-gray-600">
              Provide your shipping details. No email required until after payment to respect your privacy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={shippingInfo.firstName}
                  onChange={(e) => handleShippingChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={shippingInfo.lastName}
                  onChange={(e) => handleShippingChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleShippingChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => handleShippingChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={shippingInfo.state}
                  onChange={(e) => handleShippingChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={shippingInfo.zipCode}
                  onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => handleShippingChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </motion.div>
        )

      case 'payment':
        return (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
            <p className="text-gray-600">
              Select your preferred cryptocurrency for payment
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(mockCryptoPrices).map(([crypto, data]) => (
                <button
                  key={crypto}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedCrypto === crypto
                      ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg font-semibold mb-2">{crypto}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    ${data.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}% (24h)
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Amount (USD)</span>
                  <span className="font-semibold">{formatPrice(totalUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Amount ({selectedCrypto})</span>
                  <span className="font-semibold">
                    {formatCryptoPrice(totalCrypto, selectedCrypto)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Transaction Time</span>
                  <span className="font-semibold">
                    {mockCryptoPrices[selectedCrypto as keyof typeof mockCryptoPrices].transactionTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'confirm':
        return (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-gray-600">
              Review your order and proceed to secure payment
            </p>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(totalUSD)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ~{formatCryptoPrice(totalCrypto, selectedCrypto)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Gateway Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Secure Payment Gateway</h3>
              </div>
              <p className="text-blue-700 text-sm mb-4">
                You will be redirected to our secure payment partner (NOWPayments/Coinbase Commerce) 
                to complete your {selectedCrypto} payment. We never handle your private keys or 
                create transactions on our servers.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Payment processed by secure third-party gateway</div>
                <div>• No private keys stored on our servers</div>
                <div>• Bank-level encryption and security</div>
                <div>• Instant order confirmation upon payment</div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePaymentGatewayRedirect}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Proceed to Secure Payment</span>
                </>
              )}
            </button>
          </motion.div>
        )

      default:
        return null
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'cart':
        return cart.items.length > 0
      case 'shipping':
        return Object.values(shippingInfo).every(value => value.trim() !== '')
      case 'payment':
        return selectedCrypto !== ''
      case 'confirm':
        return true
      default:
        return false
    }
  }

  const currentStepIndex = checkoutSteps.findIndex(step => step.id === currentStep)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {checkoutSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = index < currentStepIndex
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < checkoutSteps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentStep !== 'confirm' && (
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 