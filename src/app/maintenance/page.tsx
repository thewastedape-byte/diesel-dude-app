'use client'
import Logo from '@/components/Logo'

export default function MaintenancePage() {
  return (
    <div className="bg-plate min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <Logo size="lg" />
      <div className="mt-8 panel p-8 max-w-md w-full">
        <p className="text-4xl mb-4">🔧</p>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>
          Coming Soon
        </h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}>
          Diesel Dude is currently in development. We&apos;re building something serious for fleet mechanics and heavy equipment operators.
        </p>
        <p className="text-xs" style={{ color: 'rgba(198,139,58,0.7)', fontFamily: 'Georgia, serif' }}>
          Questions? <a href="mailto:thewastedape@gmail.com" style={{ color: '#C68B3A' }}>thewastedape@gmail.com</a>
        </p>
      </div>
    </div>
  )
}
