import React from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { ProductImageGallery } from '@/components/ProductImageGallery'
import { ProductPricing } from '@/components/ProductPricing'
import { ProductTabs } from '@/components/ProductTabs'
import { ProductActions } from '@/components/ProductActions'
import { Footer } from '@/components/Footer'
import { Star, Heart, Share2, Truck, Shield, Clock } from 'lucide-react'
import { fetchProductBySlug } from '@/lib/products'
import { notFound } from 'next/navigation'

// Mock data for specifications, reviews, and shipping info
// In production, these would come from separate API endpoints
const mockSpecifications = {
  'Brand': 'Quantum Audio',
  'Model': 'WH-2000XM5',
  'Connectivity': 'Bluetooth 5.0, NFC',
  'Battery Life': 'Up to 30 hours',
  'Quick Charge': '10 min = 5 hours',
  'Noise Cancellation': 'Active (ANC)',
  'Driver Size': '40mm dynamic',
  'Frequency Response': '4Hz - 40kHz',
  'Impedance': '32 ohms',
  'Weight': '250g',
  'Warranty': '2 years',
  'Compatibility': 'iOS, Android, Windows, macOS',
}

const mockReviews = [
  {
    id: '1',
    user: 'Alex Johnson',
    rating: 5,
    title: 'Exceptional Sound Quality',
    comment: 'These headphones exceeded my expectations. The sound quality is incredible, and the noise cancellation works perfectly. Battery life is impressive, and they\'re very comfortable for long listening sessions.',
    date: '2 days ago',
    verified: true,
    photos: ['/api/placeholder/200/200'],
  },
  {
    id: '2',
    user: 'Sarah Chen',
    rating: 5,
    title: 'Perfect for Work and Music',
    comment: 'I use these for both work calls and music. The microphone quality is excellent, and the noise cancellation helps me focus in noisy environments. Highly recommend!',
    date: '1 week ago',
    verified: true,
  },
  {
    id: '3',
    user: 'Mike Rodriguez',
    rating: 4,
    title: 'Great Headphones with Minor Issues',
    comment: 'Overall excellent headphones. Sound quality is top-notch and they look great. The only minor issue is the touch controls can be a bit sensitive sometimes.',
    date: '2 weeks ago',
    verified: true,
  },
  {
    id: '4',
    user: 'Emily Davis',
    rating: 5,
    title: 'Worth Every Penny',
    comment: 'These are the best headphones I\'ve ever owned. The build quality is premium, sound is amazing, and the battery life is incredible. Perfect for my daily commute.',
    date: '3 weeks ago',
    verified: true,
    photos: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
  },
]

const mockShippingInfo = {
  estimatedDelivery: '3-5 business days',
  shippingMethods: [
    {
      name: 'Standard Shipping',
      price: 0,
      deliveryTime: '3-5 business days',
      description: 'Free shipping on orders over $50',
    },
    {
      name: 'Express Shipping',
      price: 15.99,
      deliveryTime: '1-2 business days',
      description: 'Priority handling and tracking',
    },
    {
      name: 'Overnight Shipping',
      price: 29.99,
      deliveryTime: 'Next business day',
      description: 'Guaranteed next-day delivery',
    },
  ],
  returnPolicy: '30-day money-back guarantee. Return shipping is free for defective items. Items must be in original condition with all packaging.',
  warranty: '2-year manufacturer warranty covering defects in materials and workmanship. Extended warranty available for purchase.',
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          {/* Product Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating and Reviews Summary */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.toFixed(1)} out of 5 ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Quick Features */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Image Gallery */}
            <div>
              <ProductImageGallery
                images={[product.image]}
                productName={product.name}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              {/* Pricing */}
              <ProductPricing 
                price={product.price} 
                originalPrice={product.originalPrice}
                inStock={product.inStock}
              />

              {/* Actions */}
              <ProductActions product={product} />
            </div>
          </div>

          {/* Product Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <ProductTabs
              description={product.description}
              specifications={mockSpecifications}
              reviews={mockReviews}
              shippingInfo={mockShippingInfo}
            />
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder for related products */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <h3 className="font-medium text-gray-900 mb-2">Related Product {i}</h3>
                  <p className="text-blue-600 font-semibold">$199.99</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 