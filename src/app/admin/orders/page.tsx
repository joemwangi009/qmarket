'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Package,
  Download
} from 'lucide-react'

// Mock order data - in production, this would come from the database
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    date: '2024-01-15T10:30:00Z',
    status: 'Delivered',
    total: 299.99,
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 }
    ],
    paymentMethod: 'BTC',
    trackingNumber: 'TRK-123456789',
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    date: '2024-01-14T14:20:00Z',
    status: 'Shipped',
    total: 159.98,
    items: [
      { name: 'Mechanical Keyboard', quantity: 1, price: 159.99 }
    ],
    paymentMethod: 'ETH',
    trackingNumber: 'TRK-987654321',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com'
    },
    date: '2024-01-13T09:15:00Z',
    status: 'Paid',
    total: 89.99,
    items: [
      { name: 'Designer Backpack', quantity: 1, price: 89.99 }
    ],
    paymentMethod: 'USDT',
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcd'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Alice Brown',
      email: 'alice@example.com'
    },
    date: '2024-01-12T16:45:00Z',
    status: 'Pending',
    total: 129.99,
    items: [
      { name: 'Running Shoes', quantity: 1, price: 129.99 }
    ],
    paymentMethod: 'BTC'
  }
]

const statusOptions = [
  'Pending',
  'Paid',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled'
]

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all')
  const [editingOrder, setEditingOrder] = useState<typeof mockOrders[0] | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPayment = selectedPaymentMethod === 'all' || order.paymentMethod === selectedPaymentMethod
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'text-yellow-600 bg-yellow-100',
      'Paid': 'text-blue-600 bg-blue-100',
      'Confirmed': 'text-green-600 bg-green-100',
      'Shipped': 'text-purple-600 bg-purple-100',
      'Delivered': 'text-green-600 bg-green-100',
      'Cancelled': 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'Pending': Clock,
      'Paid': CheckCircle,
      'Confirmed': CheckCircle,
      'Shipped': Truck,
      'Delivered': CheckCircle,
      'Cancelled': XCircle
    }
    return icons[status] || Clock
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            View, filter, and manage customer orders
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Truck className="h-4 w-4 inline mr-2" />
            Bulk Ship
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 inline mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="crypto">Crypto Payment</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status)
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(order.date)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {order.paymentMethod}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => window.open(`/dashboard/orders/${order.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Update Status"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {order.trackingNumber && (
                          <button className="text-purple-600 hover:text-purple-900 p-1" title="Track Package">
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{orders.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Update Order Status</h2>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Order ID: {editingOrder.id}</p>
                <p className="text-sm text-gray-600 mb-2">Customer: {editingOrder.customer.name}</p>
                <p className="text-sm text-gray-600">Current Status: {editingOrder.status}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => updateOrderStatus(editingOrder.id, e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status} selected={status === editingOrder.status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {editingOrder.status === 'Shipped' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 