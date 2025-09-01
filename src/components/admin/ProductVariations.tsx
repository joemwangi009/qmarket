'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  Package,
  Eye
} from 'lucide-react'

interface ProductVariation {
  id: string
  name: string
  options: string[]
  variations: VariationOption[]
}

interface VariationOption {
  id: string
  name: string
  price: number
  stock: number
  sku: string
  images: string[]
  isActive: boolean
}

interface ProductVariationsProps {
  variations: ProductVariation[]
  onChange: (variations: ProductVariation[]) => void
}

export const ProductVariations: React.FC<ProductVariationsProps> = ({ 
  variations, 
  onChange 
}) => {
  const [activeVariation, setActiveVariation] = useState<string | null>(null)

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      name: '',
      options: [],
      variations: []
    }
    onChange([...variations, newVariation])
  }

  const updateVariation = (id: string, field: string, value: any) => {
    onChange(variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  const removeVariation = (id: string) => {
    onChange(variations.filter(v => v.id !== id))
  }

  const addVariationOption = (variationId: string) => {
    const newOption: VariationOption = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      stock: 0,
      sku: '',
      images: [],
      isActive: true
    }
    
    onChange(variations.map(v => 
      v.id === variationId 
        ? { ...v, variations: [...v.variations, newOption] }
        : v
    ))
  }

  const updateVariationOption = (variationId: string, optionId: string, field: string, value: any) => {
    onChange(variations.map(v => 
      v.id === variationId 
        ? {
            ...v,
            variations: v.variations.map(opt => 
              opt.id === optionId ? { ...opt, [field]: value } : opt
            )
          }
        : v
    ))
  }

  const removeVariationOption = (variationId: string, optionId: string) => {
    onChange(variations.map(v => 
      v.id === variationId 
        ? {
            ...v,
            variations: v.variations.filter(opt => opt.id !== optionId)
          }
        : v
    ))
  }

  const handleImageUpload = (variationId: string, optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      
      onChange(variations.map(v => 
        v.id === variationId 
          ? {
              ...v,
              variations: v.variations.map(opt => 
                opt.id === optionId 
                  ? { ...opt, images: [...opt.images, ...newImages] }
                  : opt
              )
            }
          : v
      ))
    }
  }

  const removeImage = (variationId: string, optionId: string, imageIndex: number) => {
    onChange(variations.map(v => 
      v.id === variationId 
        ? {
            ...v,
            variations: v.variations.map(opt => 
              opt.id === optionId 
                ? { ...opt, images: opt.images.filter((_, i) => i !== imageIndex) }
                : opt
            )
          }
        : v
    ))
  }

  const generateVariations = (variationId: string) => {
    const variation = variations.find(v => v.id === variationId)
    if (!variation || variation.options.length === 0) return

    // Generate all possible combinations
    const combinations = generateCombinations(variation.options)
    
    const newVariations: VariationOption[] = combinations.map((combo, index) => ({
      id: `${variationId}-${index}`,
      name: combo.join(' - '),
      price: 0,
      stock: 0,
      sku: '',
      images: [],
      isActive: true
    }))

    updateVariation(variationId, 'variations', newVariations)
  }

  const generateCombinations = (options: string[]): string[][] => {
    if (options.length === 0) return []
    if (options.length === 1) return options[0].split(',').map(opt => [opt.trim()])
    
    const result: string[][] = []
    const firstOption = options[0].split(',').map(opt => opt.trim())
    const remainingOptions = generateCombinations(options.slice(1))
    
    firstOption.forEach(opt => {
      if (remainingOptions.length === 0) {
        result.push([opt])
      } else {
        remainingOptions.forEach(combo => {
          result.push([opt, ...combo])
        })
      }
    })
    
    return result
  }

  return (
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
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No variations added yet</p>
          <p className="text-sm">Add variations like size, color, material, etc.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variations.map((variation) => (
            <div key={variation.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={variation.name}
                    onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                    placeholder="Variation name (e.g., Size, Color, Material)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariation(variation.id)}
                  className="ml-2 p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options (comma-separated)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={variation.options.join(', ')}
                    onChange={(e) => updateVariation(variation.id, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                    placeholder="e.g., Small, Medium, Large"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => generateVariations(variation.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {variation.variations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Variation Options ({variation.variations.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => addVariationOption(variation.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {variation.variations.map((option) => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => updateVariationOption(variation.id, option.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={option.price}
                                onChange={(e) => updateVariationOption(variation.id, option.id, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Stock
                            </label>
                            <input
                              type="number"
                              value={option.stock}
                              onChange={(e) => updateVariationOption(variation.id, option.id, 'stock', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              SKU
                            </label>
                            <input
                              type="text"
                              value={option.sku}
                              onChange={(e) => updateVariationOption(variation.id, option.id, 'sku', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={option.isActive ? 'active' : 'inactive'}
                              onChange={(e) => updateVariationOption(variation.id, option.id, 'isActive', e.target.value === 'active')}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>

                          <div className="flex items-end space-x-1">
                            <button
                              type="button"
                              onClick={() => removeVariationOption(variation.id, option.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Images */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Images
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageUpload(variation.id, option.id, e)}
                              className="hidden"
                              id={`image-upload-${option.id}`}
                            />
                            <label
                              htmlFor={`image-upload-${option.id}`}
                              className="cursor-pointer flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                              <Upload className="h-3 w-3" />
                              <span>Upload</span>
                            </label>
                            
                            {option.images.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {option.images.length} image(s)
                              </span>
                            )}
                          </div>

                          {option.images.length > 0 && (
                            <div className="mt-2 flex space-x-2">
                              {option.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`${option.name} ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(variation.id, option.id, index)}
                                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-2 w-2" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 