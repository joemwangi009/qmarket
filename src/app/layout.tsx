import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QMarket - Premium Online Shopping Experience',
  description: 'Discover amazing products at unbeatable prices. Shop the latest trends with confidence - fast shipping, easy returns, and secure payments on everything from electronics to fashion.',
  keywords: ['online shopping', 'e-commerce', 'retail', 'fashion', 'electronics', 'home goods', 'secure shopping', 'fast delivery'],
  authors: [{ name: 'QMarket Team' }],
  creator: 'QMarket',
  openGraph: {
    title: 'QMarket - Premium Online Shopping Experience',
    description: 'Discover amazing products at unbeatable prices. Shop the latest trends with confidence - fast shipping, easy returns, and secure payments on everything from electronics to fashion.',
    url: 'https://qmarket.com',
    siteName: 'QMarket',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QMarket - Premium Online Shopping Experience',
    description: 'Discover amazing products at unbeatable prices. Shop the latest trends with confidence - fast shipping, easy returns, and secure payments on everything from electronics to fashion.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  )
}
