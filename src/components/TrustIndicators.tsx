'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, CheckCircle, Globe } from 'lucide-react'

const trustItems = [
  {
    icon: Shield,
    title: 'SSL Secured',
    description: '256-bit encryption for all transactions',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    description: 'Your data is protected and never stored',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: CheckCircle,
    title: 'Verified Payments',
    description: 'Instant blockchain confirmation',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Shop from anywhere in the world',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
]

const paymentProviders = [
  { name: 'NOWPayments', logo: '/api/placeholder/120/60' },
  { name: 'Coinbase Commerce', logo: '/api/placeholder/120/60' },
  { name: 'Bitcoin', logo: '/api/placeholder/120/60' },
  { name: 'Ethereum', logo: '/api/placeholder/120/60' },
]

export const TrustIndicators = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Features */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Trust Project Quantum?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We prioritize security, transparency, and user privacy in everything we do.
          </motion.p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.bgColor} mb-4`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Payment Providers */}
        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-gray-900 mb-8"
          >
            Trusted Payment Partners
          </motion.h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {paymentProviders.map((provider, index) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">{provider.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Guarantee</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">256-bit</div>
            <div className="text-gray-600">Encryption</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Verified & Secure Platform</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 