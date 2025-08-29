'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react'

// Mock admin user - in production, this would come from the database
const mockAdminUser = {
  id: 'admin-1',
  email: 'admin@qmarket.com',
  role: 'admin',
  name: 'Admin User'
}

// Mock admin check - in production, this would verify against the database
const isAdmin = (user: { email?: string; role?: string } | null) => {
  return user && (user.email === 'admin@qmarket.com' || user.role === 'admin')
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (!isAdmin(user)) {
      router.push('/dashboard')
      return
    }

    setIsLoading(false)
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin(user)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Welcome, {mockAdminUser.name}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <a
                href="/admin"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </a>
              
              <a
                href="/admin/products"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </a>
              
              <a
                href="/admin/orders"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Orders</span>
              </a>
              
              <a
                href="/admin/customers"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </a>
              
              <a
                href="/admin/payments"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
              </a>
              
              <a
                href="/admin/settings"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
} 