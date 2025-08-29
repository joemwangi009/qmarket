'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  suggestions: string[]
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  searchQuery,
  onSearchChange,
  suggestions,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 5)) // Limit to 5 suggestions
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery, suggestions])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion)
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const handleClearSearch = () => {
    onSearchChange('')
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSearchChange(value)
    
    if (value.trim()) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (searchQuery.trim()) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false)
    }, 150)
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search products, categories, or brands..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (isFocused || searchQuery.trim()) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Recent Searches */}
            {!searchQuery.trim() && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Fashion', 'Sports', 'Home'].map((popular) => (
                    <button
                      key={popular}
                      onClick={() => handleSuggestionClick(popular)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {searchQuery.trim() ? (
                        <span>
                          {suggestion.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <span key={i} className="bg-yellow-200 font-medium">{part}</span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          ))}
                        </span>
                      ) : (
                        suggestion
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery.trim() && filteredSuggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Search Tips */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <div className="font-medium mb-1">Search Tips:</div>
                <div>• Use quotes for exact phrases</div>
                <div>• Try different keywords or categories</div>
                <div>• Check spelling and try synonyms</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Count */}
      {searchQuery.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-500"
        >
          {filteredSuggestions.length > 0 ? (
            <span>Found {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>No suggestions found</span>
          )}
        </motion.div>
      )}
    </div>
  )
} 