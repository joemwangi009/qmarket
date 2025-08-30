import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QMarket - The Future of Commerce is Decentralized',
  description: 'Experience the future of e-commerce with QMarket. Shop securely with cryptocurrency, enjoy lightning-fast transactions, and discover a world of innovative products.',
  keywords: ['cryptocurrency', 'e-commerce', 'decentralized', 'shopping', 'crypto payments', 'blockchain commerce'],
  authors: [{ name: 'QMarket Team' }],
  creator: 'QMarket',
  openGraph: {
    title: 'QMarket - The Future of Commerce is Decentralized',
    description: 'Experience the future of e-commerce with QMarket. Shop securely with cryptocurrency, enjoy lightning-fast transactions, and discover a world of innovative products.',
    url: 'https://qmarket.com',
    siteName: 'QMarket',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QMarket - The Future of Commerce is Decentralized',
    description: 'Experience the future of e-commerce with QMarket. Shop securely with cryptocurrency, enjoy lightning-fast transactions, and discover a world of innovative products.',
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
      </body>
    </html>
  )
}
