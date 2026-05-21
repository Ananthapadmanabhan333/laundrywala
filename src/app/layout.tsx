import type { Metadata } from 'next'
import { Providers } from '@/app/providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'MANODROP - All You Desire | On-Demand Smart Delivery',
  description:
    'Get groceries, tech, fashion, essentials, and premium care services delivered to your doorstep in minutes. Fast, reliable, smart shopping & delivery.',
  keywords: [
    'smart delivery',
    'grocery delivery',
    'e-commerce',
    'on-demand shopping',
    'local delivery',
    'tech accessories',
    'fashion shopping',
    'care services',
    'laundry pickup',
    'MANODROP',
  ],
  authors: [{ name: 'MANODROP Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'MANODROP - All You Desire | On-Demand Smart Delivery',
    description: 'Get groceries, tech, fashion, and care services delivered in minutes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0c2340" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
