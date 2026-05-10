'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signup, login, isLoggedIn } from '@/lib/auth'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('invite')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<{ownerEmail: string; role: string} | null>(null)

  useEffect(() => { if (isLoggedIn()) router.replace('/') }, [router])

  useEffect(() => {
    if (!inviteToken) return
    fetch(`${API_URL}/api/invites/${inviteToken}`).then(r => r.json()).then(d => { if (d.valid) setInviteInfo(d) }).catch(() => {})
  }, [inviteToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password || !confirm) { setError('Fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const result = signup(email.trim().toLowerCase(), password)
    if (!result.success) { setError(result.error || 'Signup failed.'); setLoading(false); return }
    if (inviteToken && inviteInfo) {
      await fetch(`${API_URL}/api/invites/${inviteToken}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), name }) }).catch(() => {})
    }
    login(email.trim().toLowerCase(), password)
    router.push(inviteInfo ? '/' : '/setup')
    setLoading(false)
  }

  return (
    <div className="bg-plate min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8"><Logo size="lg" /></div>
        {inviteInfo && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center"
            style={{ background: 'rgba(198,139,58,0.12)', border: '1px solid rgba(198,139,58,0.4)', fontFamily: 'Georgia, serif' }}>
            <p className="font-bold" style={{ color: '#C68B3A' }}>Team Invite</p>
            <p style={{ color: 'rgba(245,240,232,0.7)' }}>Join as <strong style={{ color: '#F5F0E8' }}>{inviteInfo.role}</strong></p>
          </div>
        )}
        <div className="panel p-6">
          <h1 className="text-xl font-bold text-center mb-6" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Create Account</h1>
          {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(139,26,26,0.3)', color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Your Name</label>
              <input className="input-field" placeholder="Dan Bloom" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Email</label>
              <input type="email" className="input-field" placeholder="mechanic@fleet.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Confirm Password</label>
              <input type="password" className="input-field" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Creating...' : inviteInfo ? 'Join Team' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#C68B3A', fontWeight: 'bold' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense fallback={<div className="bg-plate min-h-screen" />}><SignupContent /></Suspense>
}
