'use client'

import React, { useState } from 'react'
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Save,
  Package,
  Tag,
  Image as ImageIcon,
  Settings,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface ProductFormProps {
  product?: Record<string, unknown>
  onSave: (product: Record<string, unknown>) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

interface ProductVariation {
  id: string
  name: string
  options: string[]
}

interface ProductAttribute {
  id: string
  name: string
  value: string
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSave, 
  onCancel, 
  mode 
}) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: product?.title || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    sku: product?.sku || '',
    brand: product?.brand || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    tags: product?.tags || [],
    
    // Pricing
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    costPrice: product?.costPrice || 0,
    taxRate: product?.taxRate || 0,
    
    // Inventory
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
    maxStock: product?.maxStock || 1000,
    weight: product?.weight || 0,
    length: product?.dimensions?.length || 0,
    width: product?.dimensions?.width || 0,
    height: product?.dimensions?.height || 0,
    
    // Status & Visibility
    status: product?.status || 'draft',
    featured: product?.featured || false,
    visibility: product?.visibility || 'public',
    launchDate: product?.launchDate || '',
    
    // SEO
    metaTitle: product?.seo?.metaTitle || '',
    metaDescription: product?.seo?.metaDescription || '',
    slug: product?.seo?.slug || '',
    keywords: product?.seo?.keywords || [],
    
    // Digital Product
    isDigital: product?.isDigital || false,
    downloadUrl: product?.downloadUrl || '',
    licenseKey: product?.licenseKey || '',
    
    // Subscription
    isSubscription: product?.isSubscription || false,
    subscriptionInterval: product?.subscriptionInterval || 'monthly',
    subscriptionPrice: product?.subscriptionPrice || 0,
    
    // Pre-order
    isPreOrder: product?.isPreOrder || false,
    preOrderDate: product?.preOrderDate || '',
    preOrderPrice: product?.preOrderPrice || 0,
  })

  const [images, setImages] = useState<string[]>(product?.images || [])
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || [])
  const [attributes, setAttributes] = useState<ProductAttribute[]>(product?.attributes || [])
  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health & Beauty', 'Automotive']
  const brands = ['AudioTech', 'GameTech', 'FashionBrand', 'HomeStyle', 'SportPro', 'TechCorp', 'LuxuryBrand']
  const statuses = ['draft', 'active', 'inactive', 'out_of_stock', 'coming_soon']
  const visibilities = ['public', 'private', 'password_protected', 'members_only']

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: '',
      options: []
    }
    setVariations(prev => [...prev, newVariation])
  }

  const updateVariation = (id: string, field: string, value: unknown) => {
    setVariations(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  const removeVariation = (id: string) => {
    setVariations(prev => prev.filter(v => v.id !== id))
  }

  const addAttribute = () => {
    const newAttribute: ProductAttribute = {
      id: Date.now().toString(),
      name: '',
      value: ''
    }
    setAttributes(prev => [...prev, newAttribute])
  }

  const updateAttribute = (id: string, field: string, value: string) => {
    setAttributes(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  const removeAttribute = (id: string) => {
    setAttributes(prev => prev.filter(a => a.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const productData = {
        ...formData,
        images,
        variations,
        attributes,
        dimensions: {
          length: formData.length,
          width: formData.width,
          height: formData.height
        },
        seo: {
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          slug: formData.slug,
          keywords: formData.keywords
        }
      }

      await onSave(productData)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    handleInputChange('slug', slug)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Create New Product' : 'Edit Product'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Add a new product to your catalog' : 'Update product information'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex h-full">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'basic', label: 'Basic Information', icon: Package },
                { id: 'pricing', label: 'Pricing & Inventory', icon: DollarSign },
                { id: 'media', label: 'Media & Images', icon: ImageIcon },
                { id: 'variations', label: 'Variations', icon: Tag },
                { id: 'seo', label: 'SEO & Marketing', icon: BarChart3 },
                { id: 'advanced', label: 'Advanced Settings', icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief product description for listings..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Detailed product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stock Alert
                    </label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Stock
                    </label>
                    <input
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Media & Images</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload images or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </span>
                    </label>
                  </div>
                </div>

                {images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images ({images.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'variations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
                  <button
                    type="button"
                    onClick={addVariation}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Variation</span>
                  </button>
                </div>

                {variations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No variations added yet</p>
                    <p className="text-sm">Add variations like size, color, material, etc.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variations.map((variation) => (
                      <div key={variation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <input
                            type="text"
                            value={variation.name}
                            onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                            placeholder="Variation name (e.g., Size, Color)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariation(variation.id)}
                            className="ml-2 p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={variation.options.join(', ')}
                            onChange={(e) => updateVariation(variation.id, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                            placeholder="e.g., Small, Medium, Large"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">SEO & Marketing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="product-url-slug"
                      />
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description for search engine results"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.keywords.join(', ')}
                    onChange={(e) => handleInputChange('keywords', e.target.value.split(',').map(keyword => keyword.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => handleInputChange('visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {visibilities.map(visibility => (
                        <option key={visibility} value={visibility}>
                          {visibility.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Launch Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.launchDate}
                      onChange={(e) => handleInputChange('launchDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Product
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isDigital"
                      checked={formData.isDigital}
                      onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isDigital" className="text-sm font-medium text-gray-700">
                      Digital Product
                    </label>
                  </div>

                  {formData.isDigital && (
                    <div className="ml-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Download URL
                        </label>
                        <input
                          type="url"
                          value={formData.downloadUrl}
                          onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/download"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Key
                        </label>
                        <input
                          type="text"
                          value={formData.licenseKey}
                          onChange={(e) => handleInputChange('licenseKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional license key"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isSubscription"
                      checked={formData.isSubscription}
                      onChange={(e) => handleInputChange('isSubscription', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isSubscription" className="text-sm font-medium text-gray-700">
                      Subscription Product
                    </label>
                  </div>

                  {formData.isSubscription && (
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subscription Interval
                        </label>
                        <select
                          value={formData.subscriptionInterval}
                          onChange={(e) => handleInputChange('subscriptionInterval', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subscription Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.subscriptionPrice}
                            onChange={(e) => handleInputChange('subscriptionPrice', parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPreOrder"
                      checked={formData.isPreOrder}
                      onChange={(e) => handleInputChange('isPreOrder', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPreOrder" className="text-sm font-medium text-gray-700">
                      Pre-order Product
                    </label>
                  </div>

                  {formData.isPreOrder && (
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pre-order Date
                        </label>
                        <input
                          type="date"
                          value={formData.preOrderDate}
                          onChange={(e) => handleInputChange('preOrderDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pre-order Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.preOrderPrice}
                            onChange={(e) => handleInputChange('preOrderPrice', parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                // Save as draft
                const draftData = { ...formData, status: 'draft' }
                onSave(draftData)
              }}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 