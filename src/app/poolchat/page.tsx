'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn, getAuth } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'
const ADMIN_EMAILS = ['thewastedape@gmail.com','howirolloldschool@gmail.com','benjamin.green7@gmail.com','zrudick@gmail.com','brittanirudick@gmail.com']

function getTeamId(email: string): string {
  if (ADMIN_EMAILS.includes(email.toLowerCase())) return 'wastedape-team'
  return email.split('@')[1] || email
}

interface ChatMessage {
  id: string; team_id: string; author_email: string
  author_name?: string; content: string; created_at: string
}

export default function PoolChatPage() {
  const router = useRouter()
  const rawAuth = getAuth()
  const isAdmin = rawAuth?.email && ADMIN_EMAILS.includes(rawAuth.email.toLowerCase())
  const auth = isAdmin ? { ...rawAuth, subscription: 'silverback' } : rawAuth
  const teamId = getTeamId(auth?.email || '')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [online, setOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, 10000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [router])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const fetchMessages = async () => {
    try {
      const r = await fetch(`${API_URL}/api/messages?team_id=${encodeURIComponent(teamId)}&limit=100`)
      if (r.ok) { setMessages(await r.json()); setOnline(true) }
      else loadLocal()
    } catch { setOnline(false); loadLocal() }
  }

  const loadLocal = () => {
    const raw = localStorage.getItem(`dd_poolchat_${teamId}`)
    if (raw) setMessages(JSON.parse(raw))
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    const optimistic: ChatMessage = {
      id: 'temp-' + Date.now(), team_id: teamId,
      author_email: auth?.email || '',
      author_name: auth?.name || auth?.email?.split('@')[0] || 'Tech',
      content: text, created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimistic])
    setInput('')
    try {
      const r = await fetch(`${API_URL}/api/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId, author_email: auth?.email || '', author_name: auth?.name || auth?.email?.split('@')[0] || 'Tech', content: text })
      })
      if (r.ok) {
        const saved = await r.json()
        setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m))
      }
    } catch {} finally { setSending(false) }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    return d.toDateString() === now.toDateString()
      ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const getInitials = (email: string, name?: string) => {
    if (name && name !== email.split('@')[0]) return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: online ? '#70c070' : '#e87070' }} />
          <span className="text-xs" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>
            Pool Chat {online ? '· Live' : '· Offline'}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-64 text-center py-12">
            <div className="text-5xl mb-4">&#128172;</div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Pool Chat</h2>
            <p className="text-sm max-w-xs" style={dimStyle}>Team messages shared across your whole crew in real time. Send the first one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => {
              const isMe = msg.author_email === auth?.email
              const prevMsg = messages[i - 1]
              const showHeader = i === 0 || prevMsg.author_email !== msg.author_email
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && showHeader ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1"
                      style={{ background: 'rgba(198,139,58,0.25)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)' }}>
                      {getInitials(msg.author_email, msg.author_name)}
                    </div>
                  ) : !isMe ? <div className="w-8 flex-shrink-0" /> : null}
                  <div className={`max-w-xs flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {showHeader && !isMe && (
                      <p className="text-xs mb-1 px-1" style={dimStyle}>{msg.author_name || msg.author_email.split('@')[0]}</p>
                    )}
                    <div className="px-3 py-2 text-sm leading-relaxed"
                      style={{
                        background: isMe ? '#8B5E1A' : 'rgba(10,4,1,0.82)',
                        color: '#FFFFFF',
                        border: isMe ? '1px solid rgba(198,139,58,0.5)' : '1px solid rgba(198,139,58,0.25)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: '600',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        opacity: msg.id.startsWith('temp-') ? 0.7 : 1,
                      }}>
                      {msg.content}
                    </div>
                    <p className="text-xs mt-0.5 px-1" style={dimStyle}>{formatTime(msg.created_at)}</p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-16 left-0 right-0 px-3 pb-2 z-40"
        style={{ background: 'rgba(20,8,2,0.90)', borderTop: '1px solid rgba(198,139,58,0.3)', paddingTop: '8px' }}>
        <div className="flex items-end gap-2">
          <textarea className="flex-1 input-field resize-none"
            placeholder="Message your crew..."
            rows={1} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            style={{ minHeight: '40px', maxHeight: '100px', paddingTop: '10px', paddingBottom: '10px' }} />
          <button onClick={sendMessage} disabled={sending || !input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: (sending || !input.trim()) ? 'rgba(198,139,58,0.15)' : '#C68B3A', color: (sending || !input.trim()) ? 'rgba(198,139,58,0.3)' : '#3D1C02', border: '1px solid rgba(198,139,58,0.3)', cursor: 'pointer' }}>
            &#x27A4;
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
