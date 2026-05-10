'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

interface LogEntry { id: string; date: string; asset: string; symptom: string; diagnosis: string; created_at: string }

export default function LogPage() {
  const router = useRouter()
  const [log, setLog] = useState<LogEntry[]>([])

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    const raw = localStorage.getItem('dd_repair_log')
    if (raw) setLog(JSON.parse(raw))
  }, [router])

  const deleteEntry = (id: string) => {
    if (!confirm('Delete this entry?')) return
    const updated = log.filter(e => e.id !== id)
    setLog(updated)
    localStorage.setItem('dd_repair_log', JSON.stringify(updated))
  }

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <span className="text-xs" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Repair Log</span>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Repair Log</h1>
        <p className="text-xs mb-5" style={dimStyle}>{log.length} entries</p>

        {log.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔧</p>
            <p className="text-sm mb-4" style={dimStyle}>No repairs logged yet.</p>
            <Link href="/" className="btn-primary inline-block px-6 py-3 text-sm" style={{ textDecoration: 'none', width: 'auto' }}>
              Ask AI a Question
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {log.map(entry => (
              <div key={entry.id} className="panel p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{entry.date}</p>
                    <p className="text-sm font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{entry.asset}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/workorder?id=${entry.id}`}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.25)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                      Work Order
                    </Link>
                    <button onClick={() => deleteEntry(entry.id)}
                      style={{ background:'rgba(139,26,26,0.1)', color:'rgba(245,240,232,0.3)', border:'1px solid rgba(139,26,26,0.2)', borderRadius:'6px', padding:'4px 8px', fontSize:'11px', cursor:'pointer' }}>
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-xs mb-1 font-bold" style={dimStyle}>Problem:</p>
                <p className="text-sm mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{entry.symptom}</p>
                <p className="text-xs mb-1 font-bold" style={dimStyle}>Diagnosis:</p>
                <p className="text-sm" style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'Georgia, serif' }}>
                  {entry.diagnosis.substring(0, 200)}{entry.diagnosis.length > 200 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  )
}

