import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Diesel Dude AI — Diesel Engine Diagnostics for Mechanics & Fleet Shops',
  description: 'AI assistant for diesel mechanics and fleet maintenance. Fault codes, DEF/DPF/EGR diagnostics, repair guides, work orders. Free plan available.',
  keywords: 'diesel mechanic AI, diesel engine diagnostics, fleet maintenance AI, fault code lookup, DPF cleaning, DEF system repair, heavy equipment diagnostics',
  verification: { google: 'kC5ejZEO7H6cMXus3fszzyG8upBBvGFg9H4Prk7FQl0' },
  themeColor: '#3D1C02',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'Diesel Dude AI — Diesel Engine Diagnostics for Mechanics & Fleet Shops',
    description: 'AI assistant for diesel mechanics and fleet maintenance. Fault codes, DEF/DPF/EGR diagnostics, repair guides, work orders. Free plan available.',
    url: 'https://dieseldude.thewastedape.com',
    siteName: 'Diesel Dude AI',
    images: [
      {
        url: 'https://dieseldude.thewastedape.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Diesel Dude AI — Diesel Engine Diagnostics',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diesel Dude AI — Diesel Engine Diagnostics for Mechanics & Fleet Shops',
    description: 'AI assistant for diesel mechanics and fleet maintenance. Fault codes, DEF/DPF/EGR diagnostics, repair guides, work orders.',
    images: ['https://dieseldude.thewastedape.com/og-image.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Diesel Dude AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://dieseldude.thewastedape.com',
  description: 'AI assistant for diesel mechanics and fleet maintenance. Fault codes, DEF/DPF/EGR diagnostics, repair guides, work orders for Cummins, CAT, Detroit, John Deere engines.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Hitchhiker (Free)',
      price: '0',
      priceCurrency: 'USD',
      description: '1 free question every 6 hours',
    },
    {
      '@type': 'Offer',
      name: 'Grease Monkey',
      price: '19.99',
      priceCurrency: 'USD',
      description: 'Unlimited AI diagnostics, manual search, work orders',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE_HERE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-plate min-h-screen">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
