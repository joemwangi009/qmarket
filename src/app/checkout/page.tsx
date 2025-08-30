'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Lock, Shield, Truck, CreditCard, Paypal } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

const checkoutSteps = [
  { id: 'cart', title: 'Cart Review', icon: Check },
  { id: 'shipping', title: 'Shipping & Info', icon: Truck },
  { id: 'payment', title: 'Payment Method', icon: CreditCard },
  { id: 'confirm', title: 'Payment', icon: Lock },
]

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
  { id: 'paypal', name: 'PayPal', icon: Paypal, description: 'Pay with your PayPal account' },
  { id: 'apple', name: 'Apple Pay', icon: CreditCard, description: 'Quick and secure with Apple Pay' },
]

export default function CheckoutPage() {
  const { cart } = useCart()
  const [currentStep, setCurrentStep] = useState('cart')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
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
  const tax = totalUSD * 0.08
  const shipping = totalUSD > 50 ? 0 : 5.99
  const total = totalUSD + tax + shipping

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
    // 2. Generate payment session with Stripe/PayPal
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
            <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <method.icon className={`h-6 w-6 ${
                      selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
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
                    <Lock className="h-4 w-4" />
                    <span>Complete Payment</span>
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