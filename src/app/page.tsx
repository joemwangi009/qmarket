import React from 'react'
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import { BestSellingBrands } from '@/components/BestSellingBrands'
import { DiscoverRareFinds } from '@/components/DiscoverRareFinds'
import TodaysDeals from '@/components/TodaysDeals'
import { FreeShipping } from '@/components/FreeShipping'
import { ReturnsMadeSimple } from '@/components/ReturnsMadeSimple'
import { PopularProducts } from '@/components/PopularProducts'
import { BestSellingProducts } from '@/components/BestSellingProducts'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BestSellingBrands />
        <DiscoverRareFinds />
        <TodaysDeals />
        <FreeShipping />
        <ReturnsMadeSimple />
        <PopularProducts />
        <BestSellingProducts />
      </main>
      <Footer />
    </div>
  )
}
