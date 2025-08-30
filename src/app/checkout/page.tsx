'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Lock, Shield, Truck, CreditCard, Coins } from 'lucide-react'
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Review Your Cart</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'shipping':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={shippingInfo.firstName}
                  onChange={(e) => handleShippingChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={shippingInfo.lastName}
                  onChange={(e) => handleShippingChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleShippingChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => handleShippingChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={shippingInfo.state}
                  onChange={(e) => handleShippingChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={shippingInfo.zipCode}
                  onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => handleShippingChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Select Cryptocurrency</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(mockCryptoPrices).map(([crypto, data]) => (
                <div
                  key={crypto}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCrypto === crypto
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{crypto}</div>
                    <div className="text-sm text-gray-600">${data.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">{data.transactionTime}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total (USD):</span>
                  <span className="font-medium">{formatPrice(totalUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total ({selectedCrypto}):</span>
                  <span className="font-medium">{formatCryptoPrice(totalCrypto, selectedCrypto)}</span>
                </div>
                <div className="text-xs text-blue-700">
                  * Prices are approximate and may vary based on current market conditions
                </div>
              </div>
            </div>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Confirm Your Order</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(totalUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalUSD)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ({formatCryptoPrice(totalCrypto, selectedCrypto)})
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Coins className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Cryptocurrency Payment</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You will be redirected to a secure payment gateway to complete your {selectedCrypto} transaction.
                    The final amount will be calculated based on current market rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {checkoutSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.id
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : index < checkoutSteps.findIndex(s => s.id === currentStep)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {index < checkoutSteps.findIndex(s => s.id === currentStep) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < checkoutSteps.length - 1 && (
                  <div className={`w-16 h-0.5 ${
                    index < checkoutSteps.findIndex(s => s.id === currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {checkoutSteps.map((step) => (
              <span
                key={step.id}
                className={`text-sm font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep !== 'cart' && (
              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            
            {currentStep === 'confirm' ? (
              <button
                onClick={handlePaymentGatewayRedirect}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    <span>Pay with {selectedCrypto}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 