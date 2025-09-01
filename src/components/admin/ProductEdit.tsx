'use client'

import React, { useState, useEffect } from 'react'
import { ProductForm } from './ProductForm'

interface ProductEditProps {
  product: Record<string, unknown>
  onSave: (product: Record<string, unknown>) => void
  onCancel: () => void
}

export const ProductEdit: React.FC<ProductEditProps> = ({ 
  product, 
  onSave, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading product data
    setTimeout(() => setIsLoading(false), 500)
  }, [product])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    )
  }

  return (
    <ProductForm
      product={product}
      mode="edit"
      onSave={(updatedProduct) => {
        const productWithTimestamp = {
          ...updatedProduct,
          updatedAt: new Date().toISOString()
        }
        onSave(productWithTimestamp)
      }}
      onCancel={onCancel}
    />
  )
} 