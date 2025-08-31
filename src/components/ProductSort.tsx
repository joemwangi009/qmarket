'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductSortProps {
  value: string
  onChange: (sort: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

const sortOptions = [
  { value: 'newest', label: 'Newest First', description: 'Recently added products' },
  { value: 'oldest', label: 'Oldest First', description: 'Longest available products' },
  { value: 'price-low', label: 'Price: Low to High', description: 'Cheapest products first' },
  { value: 'price-high', label: 'Price: High to Low', description: 'Most expensive first' },
  { value: 'name', label: 'Name: A to Z', description: 'Alphabetical order' },
  { value: 'featured', label: 'Featured First', description: 'Featured products first' },
]

export const ProductSort: React.FC<ProductSortProps> = ({ value, onChange, viewMode, onViewModeChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortChange = (sortValue: string) => {
    onChange(sortValue)
    setIsOpen(false)
  }

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === value)
    return option ? option.label : 'Sort by'
  }

  const getCurrentSortDescription = () => {
    const option = sortOptions.find(opt => opt.value === value)
    return option ? option.description : ''
  }

  return (
    <div className="flex items-center space-x-3">
      {/* View Mode Toggle */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 transition-colors ${
            viewMode === 'grid' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          title="Grid view"
        >
          <Grid className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 transition-colors ${
            viewMode === 'list' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          title="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Sort Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-w-[200px]"
        >
          <div className="text-left">
            <div className="font-medium">{getCurrentSortLabel()}</div>
            {getCurrentSortDescription() && (
              <div className="text-xs text-gray-500">{getCurrentSortDescription()}</div>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                      value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className={`font-medium ${
                        value === option.value ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                    
                    {value === option.value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 