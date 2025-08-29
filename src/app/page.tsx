import React from 'react'
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { TrustIndicators } from '@/components/TrustIndicators'
import { HowItWorks } from '@/components/HowItWorks'
import { CryptoLiveTicker } from '@/components/CryptoLiveTicker'
import { BlogPreview } from '@/components/BlogPreview'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <TrustIndicators />
        <HowItWorks />
        <CryptoLiveTicker />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  )
}
