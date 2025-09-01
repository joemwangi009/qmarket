'use client'

import React, { useState } from 'react'
import { 
  X, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Download
} from 'lucide-react'

interface BulkUploadProps {
  onClose: () => void
  onUpload: (products: UploadedProduct[]) => void
}

interface UploadedProduct {
  id: string
  title: string
  description: string
  price: number
  sku: string
  stock: number
  brand: string
  category: string
  status: string
  errors?: string[]
  warnings?: string[]
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onClose, onUpload }) => {

  const [products, setProducts] = useState<UploadedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'complete'>('upload')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    
    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const processedProducts: UploadedProduct[] = []
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim())
          const product: UploadedProduct = {
            id: `temp-${i}`,
            title: values[headers.indexOf('title')] || '',
            description: values[headers.indexOf('description')] || '',
            price: parseFloat(values[headers.indexOf('price')]) || 0,
            sku: values[headers.indexOf('sku')] || '',
            stock: parseInt(values[headers.indexOf('stock')]) || 0,
            brand: values[headers.indexOf('brand')] || '',
            category: values[headers.indexOf('category')] || '',
            status: values[headers.indexOf('status')] || 'draft',
            errors: [],
            warnings: []
          }
          
          // Validate product
          validateProduct(product)
          processedProducts.push(product)
        }
      }
      
      setProducts(processedProducts)
      setCurrentStep('review')
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const validateProduct = (product: UploadedProduct) => {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!product.title) {
      errors.push('Title is required')
    }
    
    if (!product.sku) {
      errors.push('SKU is required')
    }
    
    if (product.price <= 0) {
      errors.push('Price must be greater than 0')
    }
    
    if (product.stock < 0) {
      errors.push('Stock cannot be negative')
    }
    
    if (product.stock === 0) {
      warnings.push('Product has zero stock')
    }
    
    if (!product.category) {
      warnings.push('Category is recommended')
    }
    
    product.errors = errors
    product.warnings = warnings
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    }
  }

  const handleUpload = () => {
    const selectedProductData = products.filter(p => selectedProducts.includes(p.id))
    onUpload(selectedProductData)
    setCurrentStep('complete')
  }

  const downloadTemplate = () => {
    const template = `title,description,price,sku,stock,brand,category,status
"Sample Product","Product description",29.99,"SKU001",100,"Brand Name","Electronics","draft"`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-upload-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validProducts = products.filter(p => !p.errors || p.errors.length === 0)
  const invalidProducts = products.filter(p => p.errors && p.errors.length > 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Products</h2>
            <p className="text-gray-600 mt-1">
              Upload multiple products using CSV format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Product File
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload a CSV file with your product data
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Choose a file or drag it here
                    </p>
                    <p className="text-sm text-gray-500">
                      CSV, Excel files up to 10MB
                    </p>
                  </div>
                </label>
              </div>

              {isProcessing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing file...</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Review Products</h3>
                  <p className="text-gray-600">
                    {products.length} products found • {validProducts.length} valid • {invalidProducts.length} with errors
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentStep('upload')}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Upload Different File
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={selectedProducts.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Upload {selectedProducts.length} Products
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Valid Products</p>
                      <p className="text-2xl font-bold text-green-900">{validProducts.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">With Warnings</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {products.filter(p => p.warnings && p.warnings.length > 0).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">With Errors</p>
                      <p className="text-2xl font-bold text-red-900">{invalidProducts.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All ({products.length})
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedProducts.length} selected
                    </span>
                  </div>
                </div>
                
                <div className="overflow-y-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Issues
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                              disabled={product.errors && product.errors.length > 0}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                            />
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.title || 'No title'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.brand || 'No brand'}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sku || 'No SKU'}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              product.status === 'active' ? 'bg-green-100 text-green-800' :
                              product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.errors && product.errors.length > 0 && (
                              <div className="text-xs text-red-600">
                                {product.errors.length} error(s)
                              </div>
                            )}
                            {product.warnings && product.warnings.length > 0 && (
                              <div className="text-xs text-yellow-600">
                                {product.warnings.length} warning(s)
                              </div>
                            )}
                            {(!product.errors || product.errors.length === 0) && 
                             (!product.warnings || product.warnings.length === 0) && (
                              <div className="text-xs text-green-600">
                                Valid
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedProducts.length} products have been successfully uploaded to your catalog.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 