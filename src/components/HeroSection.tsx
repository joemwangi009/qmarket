'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Globe, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Amazing Products at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Unbeatable Prices
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Shop the latest trends with confidence. Fast shipping, easy returns, and secure payments 
            on everything from electronics to fashion.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <motion.div
              className="flex items-center space-x-2 text-blue-200"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="h-5 w-5" />
              <span>Secure Shopping</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 text-purple-200"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-5 w-5" />
              <span>Fast Delivery</span>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 text-indigo-200"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="h-5 w-5" />
              <span>Worldwide Shipping</span>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <motion.button
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 