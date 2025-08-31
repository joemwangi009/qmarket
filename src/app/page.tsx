import React from 'react'
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { BestSellingProducts } from '@/components/BestSellingProducts'
import { PopularProducts } from '@/components/PopularProducts'
import { TodaysDeals } from '@/components/TodaysDeals'
import { FreeShipping } from '@/components/FreeShipping'
import { BestSellingBrands } from '@/components/BestSellingBrands'
import { DiscoverRareFinds } from '@/components/DiscoverRareFinds'
import { ReturnsMadeSimple } from '@/components/ReturnsMadeSimple'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BestSellingProducts />
        <PopularProducts />
        <TodaysDeals />
        <FreeShipping />
        <BestSellingBrands />
        <DiscoverRareFinds />
        <ReturnsMadeSimple />
      </main>

      <Footer />
    </div>
  )
}
