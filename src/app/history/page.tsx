'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

interface HistoryEntry {
  id: string
  date: string
  preview: string
  messages: Array<{ role: string; content: string }>
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<HistoryEntry[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    // Load from repair log as history proxy
    const log = JSON.parse(localStorage.getItem('dd_repair_log') || '[]')
    const hist: HistoryEntry[] = log.map((e: any) => ({
      id: e.id,
      date: e.date,
      preview: e.symptom?.substring(0, 80) || 'Diagnostic session',
      messages: [
        { role: 'user', content: e.symptom || '' },
        { role: 'assistant', content: e.diagnosis || '' }
      ]
    }))
    setSessions(hist)
  }, [router])

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <span className="text-xs" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Chat History</span>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Chat History</h1>
        <p className="text-xs mb-5" style={dimStyle}>{sessions.length} saved sessions</p>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm" style={dimStyle}>No chat history yet. Ask the AI a question and save it to the log.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map(s => (
              <div key={s.id} className="panel p-4">
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{s.date}</p>
                      <p className="text-sm mt-0.5 truncate" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{s.preview}</p>
                    </div>
                    <span style={{ color: '#C68B3A', fontSize: '14px' }}>{expanded === s.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expanded === s.id && (
                  <div className="mt-3 pt-3 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(198,139,58,0.2)' }}>
                    {s.messages.filter(m => m.content).map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-xs px-3 py-2 rounded-xl text-sm"
                          style={{ background: m.role === 'user' ? '#C68B3A' : 'rgba(20,8,2,0.8)', color: m.role === 'user' ? '#3D1C02' : '#F5F0E8', fontFamily: 'Georgia, serif', border: m.role === 'assistant' ? '1px solid rgba(198,139,58,0.3)' : 'none' }}>
                          {m.content.substring(0, 300)}{m.content.length > 300 ? '...' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  )
}

