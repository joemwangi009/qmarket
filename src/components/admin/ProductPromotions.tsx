'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  DollarSign,
  Percent,
  Tag,
  BarChart3
} from 'lucide-react'

interface Promotion {
  id: string
  name: string
  type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'bulk_discount'
  value: number
  minQuantity?: number
  maxQuantity?: number
  startDate: string
  endDate: string
  isActive: boolean
  customerGroups: string[]
  conditions: PromotionCondition[]
}

interface PromotionCondition {
  id: string
  type: 'minimum_amount' | 'minimum_quantity' | 'specific_categories' | 'specific_brands'
  value: any
}

interface ProductPromotionsProps {
  productId: string
  promotions: Promotion[]
  onSave: (promotions: Promotion[]) => void
}

export const ProductPromotions: React.FC<ProductPromotionsProps> = ({
  productId,
  promotions,
  onSave
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  const addPromotion = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: '',
      type: 'percentage',
      value: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      customerGroups: [],
      conditions: []
    }
    onSave([...promotions, newPromotion])
  }

  const updatePromotion = (id: string, field: string, value: any) => {
    onSave(promotions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const removePromotion = (id: string) => {
    onSave(promotions.filter(p => p.id !== id))
  }

  const addCondition = (promotionId: string) => {
    const newCondition: PromotionCondition = {
      id: Date.now().toString(),
      type: 'minimum_amount',
      value: 0
    }
    
    onSave(promotions.map(p => 
      p.id === promotionId 
        ? { ...p, conditions: [...p.conditions, newCondition] }
        : p
    ))
  }

  const updateCondition = (promotionId: string, conditionId: string, field: string, value: any) => {
    onSave(promotions.map(p => 
      p.id === promotionId 
        ? {
            ...p,
            conditions: p.conditions.map(c => 
              c.id === conditionId ? { ...c, [field]: value } : c
            )
          }
        : p
    ))
  }

  const removeCondition = (promotionId: string, conditionId: string) => {
    onSave(promotions.map(p => 
      p.id === promotionId 
        ? {
            ...p,
            conditions: p.conditions.filter(c => c.id !== conditionId)
          }
        : p
    ))
  }

  const getPromotionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'percentage': 'Percentage Discount',
      'fixed': 'Fixed Amount Discount',
      'buy_x_get_y': 'Buy X Get Y',
      'bulk_discount': 'Bulk Discount'
    }
    return labels[type] || type
  }

  const getPromotionTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'percentage': Percent,
      'fixed': DollarSign,
      'buy_x_get_y': Tag,
      'bulk_discount': BarChart3
    }
    return icons[type] || Tag
  }

  const formatPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% off`
      case 'fixed':
        return `$${promotion.value} off`
      case 'buy_x_get_y':
        return `Buy ${promotion.minQuantity} get ${promotion.maxQuantity}`
      case 'bulk_discount':
        return `${promotion.value}% off for ${promotion.minQuantity}+ items`
      default:
        return promotion.value
    }
  }

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)
    return promotion.isActive && now >= startDate && now <= endDate
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Promotions</h3>
        <button
          type="button"
          onClick={addPromotion}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Promotion</span>
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No promotions configured</p>
          <p className="text-sm">Add discounts, coupons, and special offers</p>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promotion) => {
            const TypeIcon = getPromotionTypeIcon(promotion.type)
            const isActive = isPromotionActive(promotion)
            
            return (
              <div key={promotion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{promotion.name}</h4>
                      <p className="text-sm text-gray-500">{getPromotionTypeLabel(promotion.type)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => removePromotion(promotion.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Promotion Name
                    </label>
                    <input
                      type="text"
                      value={promotion.name}
                      onChange={(e) => updatePromotion(promotion.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Summer Sale 20% Off"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        value={promotion.value}
                        onChange={(e) => updatePromotion(promotion.id, 'value', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {promotion.type === 'percentage' && (
                        <span className="flex items-center px-3 py-2 text-gray-500">%</span>
                      )}
                      {promotion.type === 'fixed' && (
                        <span className="flex items-center px-3 py-2 text-gray-500">$</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={promotion.isActive ? 'active' : 'inactive'}
                      onChange={(e) => updatePromotion(promotion.id, 'isActive', e.target.value === 'active')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={promotion.startDate}
                      onChange={(e) => updatePromotion(promotion.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={promotion.endDate}
                      onChange={(e) => updatePromotion(promotion.id, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Bulk Discount Specific Fields */}
                {promotion.type === 'bulk_discount' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Quantity
                      </label>
                      <input
                        type="number"
                        value={promotion.minQuantity || 0}
                        onChange={(e) => updatePromotion(promotion.id, 'minQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Quantity
                      </label>
                      <input
                        type="number"
                        value={promotion.maxQuantity || 0}
                        onChange={(e) => updatePromotion(promotion.id, 'maxQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Buy X Get Y Specific Fields */}
                {promotion.type === 'buy_x_get_y' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buy Quantity
                      </label>
                      <input
                        type="number"
                        value={promotion.minQuantity || 0}
                        onChange={(e) => updatePromotion(promotion.id, 'minQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Get Quantity
                      </label>
                      <input
                        type="number"
                        value={promotion.maxQuantity || 0}
                        onChange={(e) => updatePromotion(promotion.id, 'maxQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Conditions */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Conditions
                    </label>
                    <button
                      type="button"
                      onClick={() => addCondition(promotion.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Condition</span>
                    </button>
                  </div>

                  {promotion.conditions.length === 0 ? (
                    <p className="text-sm text-gray-500">No conditions set</p>
                  ) : (
                    <div className="space-y-2">
                      {promotion.conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <select
                            value={condition.type}
                            onChange={(e) => updateCondition(promotion.id, condition.id, 'type', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="minimum_amount">Minimum Amount</option>
                            <option value="minimum_quantity">Minimum Quantity</option>
                            <option value="specific_categories">Specific Categories</option>
                            <option value="specific_brands">Specific Brands</option>
                          </select>
                          
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(promotion.id, condition.id, 'value', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Value"
                          />
                          
                          <button
                            onClick={() => removeCondition(promotion.id, condition.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Groups */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Groups
                  </label>
                  <div className="space-y-2">
                    {['All Customers', 'VIP Members', 'New Customers', 'Returning Customers'].map((group) => (
                      <label key={group} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={promotion.customerGroups.includes(group)}
                          onChange={(e) => {
                            const updatedGroups = e.target.checked
                              ? [...promotion.customerGroups, group]
                              : promotion.customerGroups.filter(g => g !== group)
                            updatePromotion(promotion.id, 'customerGroups', updatedGroups)
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{group}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 