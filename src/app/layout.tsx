import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Quantum - The Future of Commerce is Decentralized',
  description: 'Premium crypto-native e-commerce platform. Buy with Bitcoin, Ethereum, and other cryptocurrencies. Secure, fast, and decentralized shopping experience.',
  keywords: 'crypto, e-commerce, bitcoin, ethereum, cryptocurrency, shopping, decentralized',
  authors: [{ name: 'Project Quantum Team' }],
  openGraph: {
    title: 'Project Quantum - The Future of Commerce is Decentralized',
    description: 'Premium crypto-native e-commerce platform. Buy with Bitcoin, Ethereum, and other cryptocurrencies.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Quantum - The Future of Commerce is Decentralized',
    description: 'Premium crypto-native e-commerce platform.',
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
