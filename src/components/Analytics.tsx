'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  useEffect(() => {
    // Local persistent analytics
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'pageview', page: pathname }),
    }).catch(() => {})
  }, [pathname])
  return null
}
