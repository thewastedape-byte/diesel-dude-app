'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, getAuth } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'
const ADMIN_EMAILS = ['thewastedape@gmail.com', 'howirolloldschool@gmail.com']

interface Message { id: string; role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'DPF regen light is on',
  'Engine throwing fault codes',
  'Turbo not boosting properly',
  'DEF system warning light',
  'Hydraulic pressure low',
  'Engine overheating under load',
]

export default function HomePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [manualMode, setManualMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const rawAuth = getAuth()
  const isAdmin = rawAuth?.email && ADMIN_EMAILS.includes(rawAuth.email.toLowerCase())
  const auth = isAdmin ? { ...rawAuth, subscription: 'silverback' } : rawAuth
  const sub = auth?.subscription || 'hitchhiker'
  const isPaid = ['grease_monkey', 'troop', 'silverback', 'team_member'].includes(sub)
  // Capitalize display name
  const displayName = auth?.name ? auth.name.charAt(0).toUpperCase() + auth.name.slice(1) : auth?.email?.split('@')[0] || 'Mechanic'

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    if (!isPaid) {
      const lastFree = parseInt(localStorage.getItem('dd_last_free') || '0')
      if (lastFree && Date.now() - lastFree < 6 * 60 * 60 * 1000) {
        setShowUpgradeBanner(true); return
      }
      localStorage.setItem('dd_last_free', Date.now().toString())
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const asset = JSON.parse(localStorage.getItem('dd_active_asset') || '{}')
      const assetContext = asset.make ? `Asset: ${asset.year || ''} ${asset.make} ${asset.model || ''}, Engine: ${asset.engine || 'diesel'}, Hours: ${asset.hours || 'unknown'}` : ''
      let endpoint = `${API_URL}/api/chat`
      let body: any = { message: msg, sessionId: localStorage.getItem('dd_session') || 'default', assetContext }
      if (imagePreview) {
        endpoint = `${API_URL}/api/analyze`
        body = { image: imagePreview, question: msg, assetContext }
        setImagePreview(null); setSelectedFile(null)
      } else if (manualMode) {
        endpoint = `${API_URL}/api/manual-search`
        body = { query: msg, assetContext }
      }
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await r.json()
      setMessages(prev => [...prev, { id: Date.now().toString() + '_r', role: 'assistant', content: data.reply || 'Unable to get a response. Please try again.' }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString() + '_e', role: 'assistant', content: 'Connection error. Check your network and try again.' }])
    } finally { setLoading(false) }
  }

  const saveToLog = (msg: Message) => {
    const asset = JSON.parse(localStorage.getItem('dd_active_asset') || '{}')
    const log = JSON.parse(localStorage.getItem('dd_repair_log') || '[]')
    log.unshift({ id: Date.now().toString(), date: new Date().toLocaleDateString(), asset: asset.name || 'Unknown', symptom: messages.find(m => m.role === 'user')?.content || '', diagnosis: msg.content, created_at: new Date().toISOString() })
    localStorage.setItem('dd_repair_log', JSON.stringify(log.slice(0, 100)))
    alert('Saved to Repair Log')
  }

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{displayName}</span>
          {!isPaid && (
            <Link href="/upgrade" className="text-xs px-3 py-1.5 rounded-lg font-bold"
              style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
              Upgrade
            </Link>
          )}
          <button onClick={() => { setMessages([]); localStorage.removeItem('dd_session') }}
            className="text-xs px-2 py-1 rounded-lg"
            style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif' }}>
            + New
          </button>
        </div>
      </header>

      {showUpgradeBanner && (
        <div className="px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: 'rgba(139,26,26,0.4)', borderBottom: '1px solid rgba(198,139,58,0.4)' }}>
          <p className="text-xs flex-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>
            Hitchhiker plan - 1 free question every 6 hours.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/upgrade" className="text-xs px-3 py-1.5 rounded-lg font-bold"
              style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
              Upgrade
            </Link>
            <button onClick={() => setShowUpgradeBanner(false)}
              style={{ color: 'rgba(245,240,232,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>x</button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-64 text-center py-8">
            <div className="text-5xl mb-4">&#128295;</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Motor Pool AI</h2>
            <p className="text-sm mb-6 max-w-xs" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
              Describe your diesel problem - fault codes, symptoms, fluid issues.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {STARTERS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 rounded-xl text-left font-bold"
                  style={{
                    background: 'rgba(20,8,2,0.85)',
                    color: '#F5F0E8',
                    border: '1px solid rgba(198,139,58,0.5)',
                    fontFamily: 'Georgia, serif',
                    textShadow: 'none',
                    cursor: 'pointer',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-xs px-4 py-3 rounded-2xl rounded-br-sm text-sm font-bold"
                      style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'system-ui, sans-serif' }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🔧</span>
                      <p className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Diesel Dude</p>
                    </div>
                    {(() => {
                      const parts = msg.content.split(/\nSOURCES:\n?/)
                      const body = parts[0]
                      const sources = parts[1] ? parts[1].split('\n').map(s => s.replace(/^-\s*/, '')).filter(Boolean) : []
                      return (
                        <>
                          <div className="panel px-4 py-3 text-sm leading-relaxed"
                            style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>
                            {body}
                          </div>
                          {sources.length > 0 && (
                            <div className="px-3 py-2 rounded-lg mt-1" style={{ background: 'rgba(198,139,58,0.06)', border: '1px solid rgba(198,139,58,0.2)' }}>
                              <p className="text-xs font-bold mb-1" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>📖 Sources</p>
                              {sources.map((s, i) => (
                                <p key={i} className="text-xs" style={{ color: 'rgba(198,139,58,0.75)', fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>• {s}</p>
                              ))}
                            </div>
                          )}
                        </>
                      )
                    })()}
                    <button onClick={() => saveToLog(msg)}
                      className="self-start text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(198,139,58,0.12)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.25)', fontFamily: 'Georgia, serif' }}>
                      Save to Log
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3"><span style={{display:"inline-block",animation:"spin 1s linear infinite",fontSize:"18px"}}>⚙️</span><span style={{color:"rgba(198,139,58,0.7)",fontFamily:"Georgia,serif",fontSize:"14px"}}>Diagnosing...</span></div>
                <div className="panel px-4 py-3 text-sm" style={dimStyle}>Diagnosing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-16 left-0 right-0 px-3 pb-2 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderTop: '1px solid rgba(198,139,58,0.25)', paddingTop: '8px' }}>
        {manualMode && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>📖 Manual Mode — searching Cummins, CAT, Detroit, Power Stroke specs</span>
            <button onClick={() => setManualMode(false)} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', cursor: 'pointer', fontSize: '14px' }}>x</button>
          </div>
        )}
        {imagePreview && (
          <div className="flex items-center gap-2 mb-2">
            <img src={imagePreview} alt="attachment" style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(198,139,58,0.4)' }} />
            <button onClick={() => { setImagePreview(null); setSelectedFile(null) }}
              style={{ background: 'rgba(139,26,26,0.3)', color: '#F5F0E8', border: 'none', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', cursor: 'pointer' }}>x</button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}}
          onChange={e => {
            const file = e.target.files?.[0]; if (!file) return
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = ev => setImagePreview(ev.target?.result as string)
            reader.readAsDataURL(file)
          }} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{display:"none"}}
          onChange={e => {
            const file = e.target.files?.[0]; if (!file) return
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = ev => setImagePreview(ev.target?.result as string)
            reader.readAsDataURL(file)
          }} />
        <div className="flex items-end gap-2">
          <button onClick={() => cameraInputRef.current?.click()}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: imagePreview ? '#C68B3A' : 'rgba(198,139,58,0.15)', color: imagePreview ? '#3D1C02' : '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontSize: '18px', cursor: 'pointer' }}>
            &#128247;
          </button>
          <button onClick={() => setManualMode(!manualMode)}
            title="Search service manuals"
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: manualMode ? '#C68B3A' : 'rgba(198,139,58,0.15)', color: manualMode ? '#3D1C02' : '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
            &#128218;
          </button>
          <textarea className="flex-1 input-field resize-none"
            placeholder="Describe fault code, symptom, or problem..."
            rows={1} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            style={{ minHeight: '42px', maxHeight: '120px', paddingTop: '11px', paddingBottom: '11px' }} />
          <button onClick={() => sendMessage()} disabled={loading || (!input.trim() && !selectedFile)}
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: (loading || (!input.trim() && !selectedFile)) ? 'rgba(198,139,58,0.15)' : '#C68B3A', color: (loading || (!input.trim() && !selectedFile)) ? 'rgba(198,139,58,0.3)' : '#3D1C02', border: '1px solid rgba(198,139,58,0.3)', cursor: 'pointer' }}>
            &#x27A4;
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  )
}




