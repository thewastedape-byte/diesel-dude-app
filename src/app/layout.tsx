import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Diesel Dude by WastedApe',
  description: 'AI diesel diagnostic assistant — from pickup trucks to heavy equipment. Your digital motor pool.',
  themeColor: '#3D1C02',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-plate min-h-screen">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
