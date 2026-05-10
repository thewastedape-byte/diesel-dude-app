'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, getAuth, logout } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const ADMIN_EMAILS = ['thewastedape@gmail.com', 'howirolloldschool@gmail.com']

export default function SettingsPage() {
  const router = useRouter()
  const [auth, setAuth] = useState<any>(null)
  const [bizName, setBizName] = useState('')
  const [bizPhone, setBizPhone] = useState('')
  const [bizAddress, setBizAddress] = useState('')
  const [bizSaved, setBizSaved] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    const a = getAuth()
    const isAdmin = a?.email && ADMIN_EMAILS.includes(a.email.toLowerCase())
    setAuth(isAdmin ? { ...a, subscription: 'motor_sergeant' } : a)
    setBizName(localStorage.getItem('dd_biz_name') || '')
    setBizPhone(localStorage.getItem('dd_biz_phone') || '')
    setBizAddress(localStorage.getItem('dd_biz_address') || '')
  }, [router])

  const saveBiz = () => {
    localStorage.setItem('dd_biz_name', bizName)
    localStorage.setItem('dd_biz_phone', bizPhone)
    localStorage.setItem('dd_biz_address', bizAddress)
    setBizSaved(true)
    setTimeout(() => setBizSaved(false), 2000)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 500000) { alert('Logo must be under 500KB'); return }
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      localStorage.setItem('dd_biz_logo', dataUrl)
      alert('Logo saved!')
    }
    reader.readAsDataURL(file)
  }

  const sub = auth?.subscription || 'shop_hand'
  const isTeam = sub === 'master_mechanic' || sub === 'motor_sergeant'
  const plans: Record<string, {name: string; desc: string}> = {
    shop_hand: { name: 'Hitchhiker (Free)', desc: '10 questions / day' },
    line_mechanic: { name: 'Grease Monkey', desc: '$19.99 / month' },
    master_mechanic: { name: 'Troop', desc: '$79 / month â€” 5 seats' },
    motor_sergeant: { name: 'Silverback', desc: '$149 / month â€” 10 seats' },
    team_member: { name: 'Team Member', desc: 'Team access' },
  }
  const plan = plans[sub] || plans.shop_hand
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <h1 className="text-xl font-bold mb-6" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Settings</h1>

        <div className="panel p-4 mb-4">
          <h2 className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Account</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: 'rgba(198,139,58,0.2)', color: '#F5F0E8', border: '2px solid rgba(198,139,58,0.4)' }}>
              {auth?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{auth?.name || 'Mechanic'}</p>
              <p className="text-sm" style={dimStyle}>{auth?.email}</p>
            </div>
          </div>
        </div>

        <div className="panel p-4 mb-4">
          <h2 className="text-xs uppercase tracking-wider mb-1" style={labelStyle}>Shop Profile</h2>
          <p className="text-xs mb-3" style={dimStyle}>Appears on work orders and invoices</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs mb-1" style={dimStyle}>Logo (PNG/JPG, max 500KB)</label>
              <label className="text-xs px-3 py-2 rounded-lg cursor-pointer inline-block"
                style={{ background: 'rgba(198,139,58,0.2)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.4)', fontFamily: 'Georgia, serif' }}>
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
            <div><label className="block text-xs mb-1" style={dimStyle}>Shop / Company Name</label>
              <input className="input-field" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="ABC Fleet Services" /></div>
            <div><label className="block text-xs mb-1" style={dimStyle}>Phone</label>
              <input className="input-field" value={bizPhone} onChange={e => setBizPhone(e.target.value)} placeholder="(555) 000-0000" /></div>
            <div><label className="block text-xs mb-1" style={dimStyle}>Address</label>
              <input className="input-field" value={bizAddress} onChange={e => setBizAddress(e.target.value)} placeholder="123 Industrial Blvd" /></div>
            <button onClick={saveBiz} className="btn-primary" style={{ fontSize: '14px', padding: '10px' }}>
              {bizSaved ? 'Saved!' : 'Save Shop Profile'}
            </button>
          </div>
        </div>

        {isTeam && (
          <div className="panel p-4 mb-4">
            <h2 className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Motor Pool Tools</h2>
            <div className="flex flex-col gap-2">
              <Link href="/team" className="flex items-center justify-between py-2"
                style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', textDecoration: 'none', borderBottom: '1px solid rgba(198,139,58,0.1)' }}>
                <div><p className="text-sm">Team Management</p>
                  <p className="text-xs mt-0.5" style={dimStyle}>Invite mechanics, manage seats</p></div>
                <span style={{ color: '#C68B3A' }}>â†’</span>
              </Link>
              <Link href="/integrations" className="flex items-center justify-between py-2"
                style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                <div><p className="text-sm">Integrations</p>
                  <p className="text-xs mt-0.5" style={dimStyle}>RTA, JDLink, Zapier, exports</p></div>
                <span style={{ color: '#C68B3A' }}>â†’</span>
              </Link>
            </div>
          </div>
        )}

        <div className="panel p-4 mb-4">
          <h2 className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{plan.name}</p>
              <p className="text-xs mt-0.5" style={dimStyle}>{plan.desc}</p>
            </div>
            {sub === 'shop_hand' && (
              <Link href="/upgrade" className="text-xs px-3 py-1.5 rounded-lg font-bold"
                style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                Upgrade
              </Link>
            )}
          </div>
        </div>

        <div className="panel p-4 mb-4" style={{ borderColor: 'rgba(139,26,26,0.4)' }}>
          <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8B1A1A', fontFamily: 'Georgia, serif' }}>Danger Zone</h2>
          <div className="flex flex-col gap-2">
            <button onClick={() => { if (!confirm('Clear all app data?')) return; ['dd_assets','dd_repair_log','dd_active_asset','dd_active_asset_id','boat_buddy_auth','boat_buddy_users'].forEach(k => localStorage.removeItem(k)); router.push('/login') }}
              className="w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(139,26,26,0.2)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(139,26,26,0.3)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Clear All Data
            </button>
            <button onClick={() => { logout(); router.push('/login') }}
              className="w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(198,139,58,0.1)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  )
}


