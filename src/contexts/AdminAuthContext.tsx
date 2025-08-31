'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AdminUser {
  id: string
  email: string
  role: string
  isAdmin: boolean
}

interface AdminAuthContextType {
  user: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing admin session in localStorage
    const checkExistingSession = () => {
      try {
        const sessionData = localStorage.getItem('admin-session')
        if (sessionData) {
          const parsed = JSON.parse(sessionData)
          if (parsed.user && parsed.user.isAdmin) {
            setUser(parsed.user)
          }
        }
      } catch (error) {
        console.error('Error parsing admin session:', error)
        localStorage.removeItem('admin-session')
      }
      setLoading(false)
    }

    checkExistingSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Authentication failed') }
      }

      // Store session in localStorage
      localStorage.setItem('admin-session', JSON.stringify(data))
      setUser(data.user)

      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Network error') }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('admin-session')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
} 