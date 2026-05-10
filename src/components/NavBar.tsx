'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAuth } from '@/lib/auth'

const ADMIN_EMAILS = ['thewastedape@gmail.com', 'howirolloldschool@gmail.com', 'benjamin.green7@gmail.com', 'zrudick@gmail.com', 'brittanirudick@gmail.com']

export default function NavBar() {
  const pathname = usePathname()
  const rawAuth = getAuth()
  const isAdmin = rawAuth?.email && ADMIN_EMAILS.includes(rawAuth.email.toLowerCase())
  const auth = isAdmin ? { ...rawAuth, subscription: 'silverback' } : rawAuth
  const sub = auth?.subscription || 'hitchhiker'
  const isTeam = sub === 'troop' || sub === 'silverback'

  if (isTeam) {
    return (
      <nav className="nav-bar fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <span className="nav-icon">🧠</span><span>AI</span>
        </Link>
        <Link href="/service" className={`nav-item ${pathname === '/service' ? 'active' : ''}`}>
          <span className="nav-icon">🔩</span><span>Service</span>
        </Link>
        <Link href="/poolchat" className={`nav-item ${pathname === '/poolchat' ? 'active' : ''}`}>
          <span className="nav-icon">💬</span><span>Pool Chat</span>
        </Link>
        <Link href="/pm" className={`nav-item ${pathname === '/pm' ? 'active' : ''}`}>
          <span className="nav-icon">📅</span><span>PM</span>
        </Link>
        <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span><span>Settings</span>
        </Link>
      </nav>
    )
  }

  return (
    <nav className="nav-bar fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
        <span className="nav-icon">🧠</span><span>AI</span>
      </Link>
      <Link href="/assets" className={`nav-item ${pathname === '/assets' ? 'active' : ''}`}>
        <span className="nav-icon">🚛</span><span>Assets</span>
      </Link>
      <Link href="/codes" className={`nav-item ${pathname === '/codes' ? 'active' : ''}`}>
        <span className="nav-icon">⚠️</span><span>Codes</span>
      </Link>
      <Link href="/diagrams" className={`nav-item ${pathname === '/diagrams' ? 'active' : ''}`}>
        <span className="nav-icon">📐</span><span>Diagrams</span>
      </Link>
      <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
        <span className="nav-icon">⚙️</span><span>Settings</span>
      </Link>
    </nav>
  )
}
