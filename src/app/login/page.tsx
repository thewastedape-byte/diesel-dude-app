'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, isLoggedIn } from '@/lib/auth'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (isLoggedIn()) router.replace('/') }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Enter your email and password.'); return }
    setLoading(true)
    const result = login(email.trim().toLowerCase(), password)
    if (result.success) {
      // Set admin bypass cookie for maintenance mode
      const adminEmails = ['thewastedape@gmail.com','howirolloldschool@gmail.com','benjamin.green7@gmail.com','zrudick@gmail.com','brittanirudick@gmail.com']
      if (adminEmails.includes(email.trim().toLowerCase())) {
        document.cookie = 'dd_admin_bypass=wastedape2026; path=/; max-age=86400'
      }
      router.push(result.firstLogin ? '/setup' : '/')
    } else {
      setError(result.error || 'Login failed.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-plate min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="mt-3 text-sm" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }}>
            Your digital motor pool
          </p>
        </div>
        <div className="mb-6 px-4 py-3 rounded-lg text-sm text-center" style={{ background: 'rgba(198,139,58,0.15)', border: '1px solid rgba(198,139,58,0.5)', color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>
          🔧 <strong>Diesel Dude is currently under construction.</strong><br />
          <span style={{ color: 'rgba(245,240,232,0.6)', fontSize: '12px' }}>We&apos;re upgrading the engine. Check back soon — something bigger is coming.</span>
        </div>
        <div className="panel p-6">
          <h1 className="text-xl font-bold text-center mb-6" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Sign In</h1>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm text-center"
              style={{ background: 'rgba(139,26,26,0.3)', border: '1px solid rgba(139,26,26,0.6)', color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Email</label>
              <input type="email" className="input-field" placeholder="mechanic@fleet.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Password</label>
              <input type="password" className="input-field" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: '#C68B3A', fontWeight: 'bold' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
