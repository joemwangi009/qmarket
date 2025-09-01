'use client'

import React, { useState } from 'react'
import { 
  X, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Download,
  FileText,
  Eye
} from 'lucide-react'

interface BulkUploadProps {
  onClose: () => void
  onUpload: (products: UploadedProduct[]) => Promise<any[]>
}

interface UploadedProduct {
  // Basic Information
  title: string
  description: string
  shortDescription: string
  sku: string
  brand: string
  category: string
  subcategory: string
  tags: string[]
  
  // Pricing
  price: number
  originalPrice: number
  costPrice: number
  taxRate: number
  
  // Inventory
  stock: number
  minStock: number
  maxStock: number
  weight: number
  length: number
  width: number
  height: number
  
  // Status & Visibility
  status: string
  featured: boolean
  visibility: string
  launchDate: string
  
  // SEO
  metaTitle: string
  metaDescription: string
  slug: string
  keywords: string[]
  
  // Digital Product
  isDigital: boolean
  downloadUrl: string
  licenseKey: string
  
  // Subscription
  isSubscription: boolean
  subscriptionInterval: string
  subscriptionPrice: number
  
  // Pre-order
  isPreOrder: boolean
  preOrderDate: string
  preOrderPrice: number
  
  // Images & Media
  images: string[]
  
  // Variations & Attributes
  variations: Record<string, string[]>
  attributes: Record<string, string>
  
  // Validation
  errors?: string[]
  warnings?: string[]
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onClose, onUpload }) => {
  const [products, setProducts] = useState<UploadedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'complete'>('upload')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<UploadedProduct | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          
          const product: UploadedProduct = {
            // Basic Information
            title: values[headers.indexOf('title')] || '',
            description: values[headers.indexOf('description')] || '',
            shortDescription: values[headers.indexOf('shortdescription')] || '',
            sku: values[headers.indexOf('sku')] || '',
            brand: values[headers.indexOf('brand')] || '',
            category: values[headers.indexOf('category')] || '',
            subcategory: values[headers.indexOf('subcategory')] || '',
            tags: values[headers.indexOf('tags')] ? values[headers.indexOf('tags')].split('|').map(t => t.trim()) : [],
            
            // Pricing
            price: parseFloat(values[headers.indexOf('price')]) || 0,
            originalPrice: parseFloat(values[headers.indexOf('originalprice')]) || 0,
            costPrice: parseFloat(values[headers.indexOf('costprice')]) || 0,
            taxRate: parseFloat(values[headers.indexOf('taxrate')]) || 0,
            
            // Inventory
            stock: parseInt(values[headers.indexOf('stock')]) || 0,
            minStock: parseInt(values[headers.indexOf('minstock')]) || 5,
            maxStock: parseInt(values[headers.indexOf('maxstock')]) || 1000,
            weight: parseFloat(values[headers.indexOf('weight')]) || 0,
            length: parseFloat(values[headers.indexOf('length')]) || 0,
            width: parseFloat(values[headers.indexOf('width')]) || 0,
            height: parseFloat(values[headers.indexOf('height')]) || 0,
            
            // Status & Visibility
            status: values[headers.indexOf('status')] || 'draft',
            featured: values[headers.indexOf('featured')]?.toLowerCase() === 'true' || false,
            visibility: values[headers.indexOf('visibility')] || 'public',
            launchDate: values[headers.indexOf('launchdate')] || '',
            
            // SEO
            metaTitle: values[headers.indexOf('metatitle')] || '',
            metaDescription: values[headers.indexOf('metadescription')] || '',
            slug: values[headers.indexOf('slug')] || '',
            keywords: values[headers.indexOf('keywords')] ? values[headers.indexOf('keywords')].split('|').map(k => k.trim()) : [],
            
            // Digital Product
            isDigital: values[headers.indexOf('isdigital')]?.toLowerCase() === 'true' || false,
            downloadUrl: values[headers.indexOf('downloadurl')] || '',
            licenseKey: values[headers.indexOf('licensekey')] || '',
            
            // Subscription
            isSubscription: values[headers.indexOf('issubscription')]?.toLowerCase() === 'true' || false,
            subscriptionInterval: values[headers.indexOf('subscriptioninterval')] || 'monthly',
            subscriptionPrice: parseFloat(values[headers.indexOf('subscriptionprice')]) || 0,
            
            // Pre-order
            isPreOrder: values[headers.indexOf('ispreorder')]?.toLowerCase() === 'true' || false,
            preOrderDate: values[headers.indexOf('preorderdate')] || '',
            preOrderPrice: parseFloat(values[headers.indexOf('preorderprice')]) || 0,
            
            // Images & Media
            images: values[headers.indexOf('images')] ? values[headers.indexOf('images')].split('|').map(img => img.trim()) : [],
            
            // Variations & Attributes
            variations: {},
            attributes: {},
          }
          
          // Parse variations if present
          const variationsStr = values[headers.indexOf('variations')]
          if (variationsStr) {
            try {
              product.variations = JSON.parse(variationsStr)
            } catch {
              // If JSON parsing fails, try simple format
              const variations = variationsStr.split(';').reduce((acc: Record<string, string[]>, pair: string) => {
                const [key, values] = pair.split(':')
                if (key && values) {
                  acc[key.trim()] = values.split('|').map(v => v.trim())
                }
                return acc
              }, {})
              product.variations = variations
            }
          }
          
          // Parse attributes if present
          const attributesStr = values[headers.indexOf('attributes')]
          if (attributesStr) {
            try {
              product.attributes = JSON.parse(attributesStr)
            } catch {
              // If JSON parsing fails, try simple format
              const attributes = attributesStr.split(';').reduce((acc: Record<string, string>, pair: string) => {
                const [key, value] = pair.split(':')
                if (key && value) {
                  acc[key.trim()] = value.trim()
                }
                return acc
              }, {})
              product.attributes = attributes
            }
          }
          
          // Validate product
          validateProduct(product)
          processedProducts.push(product)
        }
      }
      
      setProducts(processedProducts)
      // Automatically select valid products
      const validIndices = processedProducts
        .map((product, index) => ({ product, index }))
        .filter(({ product }) => !product.errors || product.errors.length === 0)
        .map(({ index }) => index.toString())
      setSelectedProducts(validIndices)
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
    
    // Required fields validation
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
    
    if (product.images.length === 0) {
      warnings.push('No product images provided')
    }
    
    if (product.isDigital && !product.downloadUrl) {
      warnings.push('Digital product should have download URL')
    }
    
    if (product.isSubscription && product.subscriptionPrice <= 0) {
      errors.push('Subscription price must be greater than 0')
    }
    
    if (product.isPreOrder && !product.preOrderDate) {
      warnings.push('Pre-order product should have pre-order date')
    }
    
    product.errors = errors
    product.warnings = warnings
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all valid products by default
      const validIndices = products
        .map((product, index) => ({ product, index }))
        .filter(({ product }) => !product.errors || product.errors.length === 0)
        .map(({ index }) => index.toString())
      setSelectedProducts(validIndices)
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectValidOnly = () => {
    // Select only valid products
    const validIndices = products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => !product.errors || product.errors.length === 0)
      .map(({ index }) => index.toString())
    setSelectedProducts(validIndices)
  }

  const handleSelectProduct = (productIndex: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productIndex])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productIndex))
    }
  }

  const handleUpload = () => {
    const selectedProductData = products.filter((_, index) => selectedProducts.includes(index.toString()))
    onUpload(selectedProductData)
    setCurrentStep('complete')
  }

  const downloadTemplate = () => {
    const template = `title,description,shortdescription,sku,brand,category,subcategory,tags,price,originalprice,costprice,taxrate,stock,minstock,maxstock,weight,length,width,height,status,featured,visibility,launchdate,metatitle,metadescription,slug,keywords,isdigital,downloadurl,licensekey,issubscription,subscriptioninterval,subscriptionprice,ispreorder,preorderdate,preorderprice,images,variations,attributes
"Premium Wireless Headphones","High-quality wireless headphones with noise cancellation","Premium audio experience","WH-001","AudioTech","Electronics","Audio","wireless|noise-cancelling|premium",299.99,399.99,200.00,8.5,45,10,1000,0.5,20,15,8,"active","true","public","2024-01-15","Premium Wireless Headphones - Best Audio Quality","Experience premium sound with our wireless noise-cancelling headphones","premium-wireless-headphones","wireless headphones|noise cancelling|premium audio","false","","","false","monthly",0,"false","","",0,"https://example.com/image1.jpg|https://example.com/image2.jpg","{\"color\":[\"Black\",\"White\",\"Blue\"],\"size\":[\"One Size\"]}","{\"material\":\"Premium Plastic & Metal\",\"batteryLife\":\"30 hours\",\"connectivity\":\"Bluetooth 5.0\"}"
"Mechanical Gaming Keyboard","RGB mechanical keyboard with customizable switches","Professional gaming keyboard","KB-002","GameTech","Electronics","Gaming","mechanical|gaming|rgb|customizable",159.99,199.99,120.00,8.5,23,5,500,1.2,45,15,3,"active","false","public","2024-01-10","Mechanical Gaming Keyboard - RGB Customizable","Professional gaming keyboard with mechanical switches and RGB lighting","mechanical-gaming-keyboard","mechanical keyboard|gaming|rgb|customizable","false","","","false","monthly",0,"false","","",0,"https://example.com/keyboard1.jpg","{\"color\":[\"Black\",\"White\"],\"switches\":[\"Blue\",\"Red\",\"Brown\"]}","{\"material\":\"ABS Plastic\",\"switches\":\"Cherry MX\",\"backlight\":\"RGB\"}"`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-bulk-upload-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const showProductPreview = (product: UploadedProduct) => {
    setPreviewProduct(product)
    setShowPreview(true)
  }

  const validProducts = products.filter(p => !p.errors || p.errors.length === 0)
  const invalidProducts = products.filter(p => p.errors && p.errors.length > 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Products</h2>
            <p className="text-gray-600 mt-1">
              Upload multiple products using CSV format with comprehensive field support
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
                  Upload a CSV file with your product data. All fields are supported including images, variations, and attributes.
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
                    {selectedProducts.length === 0 
                      ? 'No Valid Products Selected' 
                      : `Upload ${selectedProducts.length} Valid Products`
                    }
                  </button>
                </div>
                
                {/* Upload Guidance */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Upload Guidance:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Only products without errors can be uploaded</li>
                        <li>Products with warnings can still be uploaded</li>
                        <li>Invalid products will be skipped automatically</li>
                        <li>Use &ldquo;Select Valid Only&rdquo; to quickly select all valid products</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Total Fields</p>
                      <p className="text-2xl font-bold text-blue-900">40+</p>
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
                        checked={selectedProducts.length === validProducts.length && validProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All Valid ({validProducts.length})
                      </span>
                      <button
                        onClick={handleSelectValidOnly}
                        className="ml-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Select Valid Only
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {selectedProducts.length} selected of {validProducts.length} valid
                      </span>
                      {invalidProducts.length > 0 && (
                        <span className="text-sm text-red-500">
                          {invalidProducts.length} with errors (cannot upload)
                        </span>
                      )}
                    </div>
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
                          Images
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(index.toString())}
                              onChange={(e) => handleSelectProduct(index.toString(), e.target.checked)}
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
                                {product.brand || 'No brand'} • {product.category || 'No category'}
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

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-600">{product.images.length}</span>
                              {product.images.length > 0 && (
                                <button
                                  onClick={() => showProductPreview(product)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Preview images"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              )}
                            </div>
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

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
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
                            </div>
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

      {/* Product Preview Modal */}
      {showPreview && previewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Product Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {previewProduct.title}</div>
                    <div><span className="font-medium">SKU:</span> {previewProduct.sku}</div>
                    <div><span className="font-medium">Brand:</span> {previewProduct.brand}</div>
                    <div><span className="font-medium">Category:</span> {previewProduct.category}</div>
                    <div><span className="font-medium">Price:</span> ${previewProduct.price}</div>
                    <div><span className="font-medium">Stock:</span> {previewProduct.stock}</div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Images ({previewProduct.images.length})</h4>
                  {previewProduct.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {previewProduct.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/200/200'
                            }}
                          />
                        </div>
                      ))}
                      {previewProduct.images.length > 4 && (
                        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
                          <span className="text-sm text-gray-500">+{previewProduct.images.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No images provided</div>
                  )}
                </div>
              </div>

              {/* Validation Issues */}
              {(previewProduct.errors && previewProduct.errors.length > 0) || 
               (previewProduct.warnings && previewProduct.warnings.length > 0) ? (
                <div className="mt-6 space-y-4">
                  {previewProduct.errors && previewProduct.errors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Errors</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {previewProduct.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {previewProduct.warnings && previewProduct.warnings.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Warnings</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                        {previewProduct.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Product is valid and ready for upload</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 