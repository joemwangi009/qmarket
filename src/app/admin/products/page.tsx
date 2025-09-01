'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Upload,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Image as ImageIcon,
  MoreHorizontal
} from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductEdit } from '@/components/admin/ProductEdit'
import { BulkUpload } from '@/components/admin/BulkUpload'

// Mock product data - in production, this would come from the database
interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  sku: string
  stock: number
  minStock: number
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  brand: string
  category: string
  subcategory?: string
  tags: string[]
  images: string[]
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock'
  featured: boolean
  seo: {
    metaTitle: string
    metaDescription: string
    slug: string
    keywords: string[]
  }
  variations?: Record<string, string[]>
  attributes?: Record<string, string>
  createdAt: string
  updatedAt: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    originalPrice: 399.99,
    sku: 'WH-001',
    stock: 45,
    minStock: 10,
    weight: 0.5,
    dimensions: { length: 20, width: 15, height: 8 },
    brand: 'AudioTech',
    category: 'Electronics',
    subcategory: 'Audio',
    tags: ['wireless', 'noise-cancelling', 'premium'],
    images: ['/images/headphones-1.jpg', '/images/headphones-2.jpg'],
    status: 'active',
    featured: true,
    seo: {
      metaTitle: 'Premium Wireless Headphones - Best Audio Quality',
      metaDescription: 'Experience premium sound with our wireless noise-cancelling headphones',
      slug: 'premium-wireless-headphones',
      keywords: ['wireless headphones', 'noise cancelling', 'premium audio']
    },
    variations: {
      color: ['Black', 'White', 'Blue'],
      size: ['One Size']
    },
    attributes: {
      material: 'Premium Plastic & Metal',
      batteryLife: '30 hours',
      connectivity: 'Bluetooth 5.0'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with customizable switches',
    price: 159.99,
    sku: 'KB-002',
    stock: 23,
    minStock: 5,
    weight: 1.2,
    dimensions: { length: 45, width: 15, height: 3 },
    brand: 'GameTech',
    category: 'Electronics',
    subcategory: 'Gaming',
    tags: ['mechanical', 'gaming', 'rgb', 'customizable'],
    images: ['/images/keyboard-1.jpg'],
    status: 'active',
    featured: false,
    seo: {
      metaTitle: 'Mechanical Gaming Keyboard - RGB Customizable',
      metaDescription: 'Professional gaming keyboard with mechanical switches and RGB lighting',
      slug: 'mechanical-gaming-keyboard',
      keywords: ['mechanical keyboard', 'gaming', 'rgb', 'customizable']
    },
    variations: {
      color: ['Black', 'White'],
      switches: ['Blue', 'Red', 'Brown']
    },
    attributes: {
      material: 'Aluminum & ABS',
      switchType: 'Cherry MX',
      backlight: 'RGB'
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
]

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys']
  const brands = ['AudioTech', 'GameTech', 'FashionBrand', 'HomeStyle', 'SportPro']
  const statuses = ['active', 'inactive', 'draft', 'out_of_stock']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand
    
    return matchesSearch && matchesCategory && matchesStatus && matchesBrand
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-green-600 bg-green-100',
      'inactive': 'text-gray-600 bg-gray-100',
      'draft': 'text-yellow-600 bg-yellow-100',
      'out_of_stock': 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'active': CheckCircle,
      'inactive': EyeOff,
      'draft': Clock,
      'out_of_stock': AlertCircle
    }
    return icons[status] || Clock
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return
    
    switch (action) {
      case 'activate':
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'active' as const } : p
        ))
        break
      case 'deactivate':
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'inactive' as const } : p
        ))
        break
      case 'delete':
        setProducts(products.filter(p => !selectedProducts.includes(p.id)))
        break
      case 'feature':
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) ? { ...p, featured: true } : p
        ))
        break
    }
    setSelectedProducts([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Create, edit, and manage your product catalog
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Bulk Upload</span>
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, SKU, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id))
                      } else {
                        setSelectedProducts([])
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const StatusIcon = getStatusIcon(product.status)
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id])
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      {product.subcategory && (
                        <div className="text-sm text-gray-500">{product.subcategory}</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                      {product.stock <= product.minStock && (
                        <div className="text-xs text-red-600">Low Stock</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {product.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-300" />
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.updatedAt)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingProduct(product)
                            setShowEditModal(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
            <span className="font-medium">{products.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock <= p.minStock).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Creation Modal */}
      {showCreateModal && (
        <ProductForm
          mode="create"
          onSave={(productData) => {
            const newProduct = {
              ...productData,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            setProducts([...products, newProduct])
            setShowCreateModal(false)
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* Product Edit Modal */}
      {showEditModal && editingProduct && (
        <ProductEdit
          product={editingProduct}
          onSave={(updatedProduct) => {
            setProducts(products.map(p => 
              p.id === editingProduct.id ? updatedProduct : p
            ))
            setShowEditModal(false)
            setEditingProduct(null)
          }}
          onCancel={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUpload
          onUpload={(uploadedProducts) => {
            const newProducts = uploadedProducts.map((product, index) => ({
              ...product,
              id: `bulk-${Date.now()}-${index}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }))
            setProducts([...products, ...newProducts])
            setShowBulkUpload(false)
          }}
          onClose={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  )
} 