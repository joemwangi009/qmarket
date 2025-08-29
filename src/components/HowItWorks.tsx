'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: ShoppingCart,
    title: 'Add to Cart',
    description: 'Browse our products and add items to your shopping cart. All prices are displayed in USD with real-time crypto equivalents.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: CreditCard,
    title: 'Choose Crypto',
    description: 'Select your preferred cryptocurrency from our supported options. We support Bitcoin, Ethereum, and many other popular coins.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: CheckCircle,
    title: 'Complete Payment',
    description: 'Complete your purchase securely through our integrated payment gateways. Receive instant confirmation and tracking.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
]

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            How Crypto Shopping Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Shopping with cryptocurrency is simple, secure, and fast. Here&apos;s how it works in just three easy steps.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${step.bgColor} mb-6 mt-4`}>
                <step.icon className={`h-10 w-10 ${step.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                  <div className="w-full h-full bg-gradient-to-r from-blue-200 to-purple-200"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose Crypto Payments?
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No bank account required</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Instant global transactions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lower fees than traditional methods</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Enhanced privacy and security</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Supported Cryptocurrencies
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">Bitcoin (BTC)</div>
                  <div className="bg-gray-50 p-2 rounded">Ethereum (ETH)</div>
                  <div className="bg-gray-50 p-2 rounded">USDT</div>
                  <div className="bg-gray-50 p-2 rounded">USDC</div>
                  <div className="bg-gray-50 p-2 rounded">BNB</div>
                  <div className="bg-gray-50 p-2 rounded">LTC</div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  And many more supported coins
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Start Shopping
            </a>
            <a
              href="/support"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg text-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Get Help
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 