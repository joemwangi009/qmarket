import React from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
} 