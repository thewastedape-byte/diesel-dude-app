'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import Logo from '@/components/Logo'

const TIERS = [
  {
    name: 'Hitchhiker',
    price: 'Free',
    sub: 'shop_hand',
    features: ['10 AI questions / day', 'Fault code lookup', 'Asset log', 'Repair log'],
    cta: 'Current Plan',
    disabled: true,
    highlight: false,
  },
  {
    name: 'Grease Monkey',
    price: '$19.99/mo',
    sub: 'line_mechanic',
    priceId: 'price_1TUm7kHfCuVeN1IrgxweTFtn',
    features: ['Unlimited AI questions', 'All fault codes', 'Unlimited assets', 'Work orders + invoices', 'Parts inventory', 'Manual search (service specs)', 'Photo diagnosis'],
    cta: 'Upgrade',
    highlight: true,
  },
  {
    name: 'Troop',
    price: '$79/mo',
    sub: 'master_mechanic',
    priceId: 'price_1TUm7kHfCuVeN1IrudictkrK',
    features: ['Everything in Grease Monkey', '5 team seats', 'Service department', 'Pool team chat', 'Customer database', 'Zapier integration', 'CSV export'],
    cta: 'Upgrade',
    highlight: false,
    badge: 'COMING SOON',
  },
  {
    name: 'Silverback',
    price: '$149/mo',
    sub: 'motor_sergeant',
    priceId: 'price_1TUm7kHfCuVeN1IrHMa56Hdc',
    features: ['Everything in Troop', '10 team seats', 'RTA Fleet integration', 'JDLink telematics', 'PM scheduling', 'Third-party software integration', 'Priority support'],
    cta: 'Upgrade',
    highlight: false,
    badge: 'COMING SOON',
  },
]

export default function UpgradePage() {
  const auth = getAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (tier: { sub: string; priceId?: string; badge?: string }) => {
    if (tier.badge || !tier.priceId) return
    setLoading(tier.sub)
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tier.sub, email: auth?.email })
      })
      const data = await r.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Checkout failed. Please try again.') }
    finally { setLoading(null) }
  }

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <Link href="/" className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
          &larr; Back
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">&#128295;</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Motor Pool Plans</h1>
          <p className="text-sm" style={dimStyle}>AI diesel diagnostics for every shop, fleet, and motor pool</p>
        </div>

        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          {TIERS.map(tier => (
            <div key={tier.name} className="panel p-5"
              style={{ border: tier.highlight ? '2px solid #C68B3A' : '1px solid rgba(198,139,58,0.2)' }}>
              {tier.highlight && (
                <p className="text-xs font-bold text-center mb-3 px-3 py-1 rounded-full"
                  style={{ background: '#C68B3A', color: '#3D1C02', display: 'inline-block' }}>
                  MOST POPULAR
                </p>
              )}
              {tier.badge && (
                <p className="text-xs font-bold text-center mb-2" style={{ color: 'rgba(198,139,58,0.6)' }}>{tier.badge}</p>
              )}
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{tier.name}</p>
                <div className="flex flex-col items-end">
                      {(tier as any).originalPrice && (
                        <span className="text-xs line-through" style={{ color: 'rgba(245,240,232,0.35)', fontFamily: 'Georgia, serif' }}>{(tier as any).originalPrice}</span>
                      )}
                      <p className="text-xl font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{tier.price}</p>
                      {(tier as any).originalPrice && (
                        <span className="text-xs" style={{ color: '#70c070', fontFamily: 'Georgia, serif' }}>Intro price</span>
                      )}
                    </div>
              </div>
              <ul className="flex flex-col gap-1.5 mb-4">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Georgia, serif' }}>
                    <span style={{ color: '#C68B3A' }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              {tier.disabled ? (
                <p className="text-center text-sm py-2" style={dimStyle}>Your current plan</p>
              ) : tier.badge ? (
                <a href={`mailto:thewastedape@gmail.com?subject=Diesel Dude ${tier.name} Waitlist`}
                  className="btn-primary text-center block"
                  style={{ textDecoration: 'none', opacity: 0.7 }}>
                  Join Waitlist
                </a>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier)}
                  disabled={loading === tier.sub}
                  className="btn-primary w-full"
                  style={{ opacity: loading === tier.sub ? 0.7 : 1 }}>
                  {loading === tier.sub ? 'Loading...' : `${tier.cta} &mdash; ${tier.price}`}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={dimStyle}>
          Secure checkout via Stripe &bull; Cancel anytime &bull;{' '}
          <Link href="/terms" style={{ color: '#C68B3A' }}>Terms &amp; Conditions</Link>
        </p>
      </main>
    </div>
  )
}



