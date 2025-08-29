'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Navigation } from '@/components/Navigation'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductSearch } from '@/components/ProductSearch'
import { ProductSort } from '@/components/ProductSort'
import { Footer } from '@/components/Footer'
import { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'

// Mock products data - in production, this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with active noise cancellation, premium sound quality, and long battery life.',
    price: 299.99,
    images: ['/api/placeholder/400/400'],
    inventory: 15,
    category: 'Electronics',
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking device with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.',
    price: 199.99,
    images: ['/api/placeholder/400/400'],
    inventory: 25,
    category: 'Electronics',
    isFeatured: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Organic Coffee Beans',
    slug: 'organic-coffee-beans',
    description: 'Premium organic coffee beans sourced from sustainable farms. Rich flavor profile with notes of chocolate and caramel.',
    price: 24.99,
    images: ['/api/placeholder/400/400'],
    inventory: 100,
    category: 'Food & Beverages',
    isFeatured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Designer Backpack',
    slug: 'designer-backpack',
    description: 'Stylish and durable backpack made from premium materials. Multiple compartments, laptop sleeve, and water-resistant design.',
    price: 89.99,
    images: ['/api/placeholder/400/400'],
    inventory: 30,
    category: 'Fashion',
    isFeatured: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    slug: 'wireless-charging-pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator, non-slip design, and compact form factor.',
    price: 49.99,
    images: ['/api/placeholder/400/400'],
    inventory: 50,
    category: 'Electronics',
    isFeatured: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'High-quality yoga mat with excellent grip and cushioning. Made from eco-friendly materials, perfect for yoga, pilates, and meditation.',
    price: 79.99,
    images: ['/api/placeholder/400/400'],
    inventory: 40,
    category: 'Sports & Fitness',
    isFeatured: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    slug: 'bluetooth-speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 20-hour battery life. Perfect for outdoor activities and parties.',
    price: 129.99,
    images: ['/api/placeholder/400/400'],
    inventory: 35,
    category: 'Electronics',
    isFeatured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and environmentally friendly.',
    price: 34.99,
    images: ['/api/placeholder/400/400'],
    inventory: 75,
    category: 'Home & Garden',
    isFeatured: false,
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
  },
  {
    id: '9',
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'Premium mechanical keyboard with Cherry MX switches, RGB backlighting, and aluminum frame. Perfect for gaming and productivity.',
    price: 159.99,
    images: ['/api/placeholder/400/400'],
    inventory: 20,
    category: 'Electronics',
    isFeatured: false,
    createdAt: new Date('2023-12-25'),
    updatedAt: new Date('2023-12-25'),
  },
  {
    id: '10',
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Professional running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole.',
    price: 129.99,
    images: ['/api/placeholder/400/400'],
    inventory: 45,
    category: 'Sports & Fitness',
    isFeatured: false,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: '11',
    name: 'Smart Home Hub',
    slug: 'smart-home-hub',
    description: 'Central hub for controlling all your smart home devices. Compatible with Alexa, Google Home, and Apple HomeKit.',
    price: 199.99,
    images: ['/api/placeholder/400/400'],
    inventory: 15,
    category: 'Electronics',
    isFeatured: false,
    createdAt: new Date('2023-12-18'),
    updatedAt: new Date('2023-12-18'),
  },
  {
    id: '12',
    name: 'Leather Wallet',
    slug: 'leather-wallet',
    description: 'Handcrafted leather wallet with multiple card slots, RFID protection, and premium stitching. Made from genuine Italian leather.',
    price: 69.99,
    images: ['/api/placeholder/400/400'],
    inventory: 60,
    category: 'Fashion',
    isFeatured: false,
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
  },
]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const { addToCart } = useCart()

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(mockProducts.map(product => product.category))]
    return ['all', ...uniqueCategories]
  }, [])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...mockProducts]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [selectedCategory, priceRange, searchQuery, sortBy])

  // Pagination
  const productsPerPage = viewMode === 'grid' ? 12 : 8
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
            <p className="text-gray-600">
              Discover our premium products available for purchase with cryptocurrency
            </p>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Search */}
            <div className="flex-1">
              <ProductSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                suggestions={categories.slice(1)} // Exclude 'all'
              />
            </div>

            {/* Sort and View Toggle */}
            <div className="flex items-center gap-4">
              <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
              
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                totalProducts={filteredProducts.length}
              />
            </div>

            {/* Products Grid/List */}
            <div className="flex-1">
                          {currentProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={currentProducts}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                  />

                  {/* Pagination */}
                  <div className="mt-12">
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                    
                    {/* Load More Button (Alternative to pagination) */}
                    {currentPage < totalPages && (
                      <div className="text-center mt-6">
                        <button
                          onClick={handleLoadMore}
                          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Load More Products
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                      setPriceRange([0, 1000])
                      setSortBy('newest')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 