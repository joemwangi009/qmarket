'use client'

import React, { useState } from 'react'
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Copy, 
  Check,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react'

// Mock payment gateway configuration
interface PaymentConfig {
  primaryGateway: string
  nowpayments: {
    apiKey: string
    webhookSecret: string
    isEnabled: boolean
    supportedCryptos: string[]
    fees: string
    settlementTime: string
    ipnSecret: string
  }
}

const mockConfig: PaymentConfig = {
  primaryGateway: 'NOWPayments',
  nowpayments: {
    apiKey: process.env.NOWPAYMENTS_API_KEY || 'np_live_1234567890abcdef1234567890abcdef',
    webhookSecret: process.env.NOWPAYMENTS_WEBHOOK_SECRET || 'whsec_1234567890abcdef1234567890abcdef',
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET || 'ipn_1234567890abcdef1234567890abcdef',
    isEnabled: true,
    supportedCryptos: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'LTC', 'ADA', 'DOT', 'LINK', 'MATIC'],
    fees: '0.5%',
    settlementTime: '1-2 business days'
  }
}

// Mock webhook logs
const mockWebhookLogs = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:00Z',
    gateway: 'NOWPayments',
    event: 'payment_received',
    status: 'success',
    orderId: 'ORD-001',
    amount: '0.0069 BTC',
    details: 'Payment confirmed on blockchain'
  },
  {
    id: '2',
    timestamp: '2024-01-15T13:45:00Z',
    gateway: 'NOWPayments',
    event: 'payment_pending',
    status: 'pending',
    orderId: 'ORD-002',
    amount: '0.0021 ETH',
    details: 'Payment detected, waiting for confirmations'
  },
  {
    id: '3',
    timestamp: '2024-01-15T12:20:00Z',
    gateway: 'Coinbase Commerce',
    event: 'charge_created',
    status: 'success',
    orderId: 'ORD-003',
    amount: '89.99 USDT',
    details: 'Payment session created successfully'
  },
  {
    id: '4',
    timestamp: '2024-01-15T11:15:00Z',
    gateway: 'NOWPayments',
    event: 'payment_failed',
    status: 'failed',
    orderId: 'ORD-004',
    amount: '0.0015 BTC',
    details: 'Insufficient funds in wallet'
  }
]

export default function AdminPayments() {
  const [config] = useState(mockConfig)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [webhookLogs] = useState(mockWebhookLogs)


  const copyToClipboard = async (text: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyType)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }



  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'success': 'text-green-600 bg-green-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'failed': 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'success': CheckCircle,
      'pending': Clock,
      'failed': AlertCircle
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Gateway Configuration</h1>
          <p className="text-gray-600 mt-2">
            Configure and manage your crypto payment gateways
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Test Connection
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4 inline mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Gateway Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Payment Gateway</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* NOWPayments */}
          <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">NOWPayments</h3>
                  <p className="text-sm text-gray-600">Primary Payment Gateway</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fees:</span>
                <span className="font-medium">{config.nowpayments.fees}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Settlement:</span>
                <span className="font-medium">{config.nowpayments.settlementTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cryptocurrencies:</span>
                <span className="font-medium">{config.nowpayments.supportedCryptos.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Always Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showApiKeys ? 'Hide' : 'Show'} API Keys</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* NOWPayments API */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">NOWPayments API Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={config.nowpayments.apiKey}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(config.nowpayments.apiKey, 'nowpayments-api')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'nowpayments-api' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={config.nowpayments.webhookSecret}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(config.nowpayments.webhookSecret, 'nowpayments-webhook')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'nowpayments-webhook' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IPN Secret</label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={config.nowpayments.ipnSecret}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(config.nowpayments.ipnSecret, 'nowpayments-ipn')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'nowpayments-ipn' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Important Security Note</h4>
              <p className="text-sm text-blue-700 mt-1">
                API keys are stored as environment variables and are not saved in the database. 
                To update these keys, modify your environment configuration and restart the application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Webhook Endpoints</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NOWPayments Webhook URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://qmarket.com/api/webhooks/nowpayments"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard('https://qmarket.com/api/webhooks/nowpayments', 'webhook-url')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'webhook-url' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NOWPayments IPN URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://qmarket.com/api/webhooks/nowpayments/ipn"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard('https://qmarket.com/api/webhooks/nowpayments/ipn', 'webhook-url')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedKey === 'webhook-url' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Webhook Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">NOWPayments</span>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">IPN Notifications</span>
                </div>
                <span className="text-sm text-blue-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Webhook Logs</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {webhookLogs.map((log) => {
                const StatusIcon = getStatusIcon(log.status)
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.gateway}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.event.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.details}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 