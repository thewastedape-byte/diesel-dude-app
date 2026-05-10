'use client'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = { sm: 80, md: 100, lg: 140 }
  const px = sizes[size]
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.png" alt="Diesel Dude" width={px} height={px} style={{ objectFit: 'contain' }} priority />
      {(
        <div>
          <p className="font-bold leading-none" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif', fontSize: size === 'lg' ? '22px' : '16px' }}>
            Diesel Dude
          </p>
          <p style={{ color: 'rgba(245,240,232,0.4)', fontFamily: 'Georgia, serif', fontSize: '10px', letterSpacing: '2px' }}>
            BY WASTEDAPE
          </p>
        </div>
      )}
    </div>
  )
}
