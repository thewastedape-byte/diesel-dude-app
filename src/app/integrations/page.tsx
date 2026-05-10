'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, getAuth } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'

export default function IntegrationsPage() {
  const router = useRouter()
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEvent, setWebhookEvent] = useState('job.completed')
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    const raw = localStorage.getItem('dd_webhooks')
    if (raw) setWebhooks(JSON.parse(raw))
  }, [router])

  const addWebhook = () => {
    if (!webhookUrl.startsWith('http')) { alert('Enter a valid URL'); return }
    const updated = [...webhooks, { url: webhookUrl, event: webhookEvent, id: Date.now().toString() }]
    setWebhooks(updated)
    localStorage.setItem('dd_webhooks', JSON.stringify(updated))
    setWebhookUrl('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const deleteWebhook = (id: string) => {
    const updated = webhooks.filter(w => w.id !== id)
    setWebhooks(updated)
    localStorage.setItem('dd_webhooks', JSON.stringify(updated))
  }

  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <Link href="/settings" className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(198,139,58,0.2)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.4)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
          Back
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Integrations</h1>
        <p className="text-xs mb-5" style={dimStyle}>Connect Diesel Dude to your other software</p>

        {/* Zapier */}
        <div className="panel p-4 mb-4" style={{ background: 'rgba(255,100,0,0.06)', border: '1px solid rgba(255,100,0,0.25)' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#x26A1;</span>
            <div className="flex-1">
              <p className="text-sm font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Connect with Zapier</p>
              <p className="text-xs mb-3" style={dimStyle}>Connect to QuickBooks, Google Sheets, Slack, RTA, and 6,000+ apps. No code needed.</p>
              <a href="https://zapier.com" target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg inline-block"
                style={{ background: 'rgba(255,100,0,0.25)', color: '#ff9966', border: '1px solid rgba(255,100,0,0.4)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                Open Zapier
              </a>
            </div>
          </div>
        </div>

        {/* Coming soon integrations */}
        <div className="panel p-4 mb-4">
          <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Direct Integrations</p>
          {[
            { name: 'RTA Fleet Management', desc: 'Push work orders directly to RTA' },
            { name: 'JDLink (John Deere)', desc: 'Pull live fault codes and hours from machines' },
            { name: 'Cat VisionLink', desc: 'Pull CAT equipment data and fault codes' },
            { name: 'Samsara', desc: 'Fleet GPS and telematics sync' },
            { name: 'QuickBooks Online', desc: 'Push invoices automatically' },
          ].map(app => (
            <div key={app.name} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: '1px solid rgba(198,139,58,0.1)' }}>
              <div>
                <p className="text-sm" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{app.name}</p>
                <p className="text-xs" style={dimStyle}>{app.desc}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(198,139,58,0.15)', color: 'rgba(198,139,58,0.6)', fontFamily: 'Georgia, serif' }}>
                Coming Soon
              </span>
            </div>
          ))}
        </div>

        {/* Webhook setup */}
        <div className="panel p-4 mb-4">
          <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Webhooks ({webhooks.length})</p>
          <div className="flex flex-col gap-3 mb-3">
            <input className="input-field" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..." />
            <select className="input-field" value={webhookEvent} onChange={e => setWebhookEvent(e.target.value)}
              style={{ background: 'rgba(245,240,232,0.08)', color: '#F5F0E8' }}>
              <option value="job.completed" style={{ background: '#1a0a02' }}>job.completed</option>
              <option value="job.created" style={{ background: '#1a0a02' }}>job.created</option>
              <option value="invoice.created" style={{ background: '#1a0a02' }}>invoice.created</option>
            </select>
            <button onClick={addWebhook} className="btn-primary" style={{ padding: '10px', fontSize: '14px' }}>
              {saved ? 'Saved!' : '+ Add Webhook'}
            </button>
          </div>
          {webhooks.map(wh => (
            <div key={wh.id} className="flex items-center justify-between py-2"
              style={{ borderTop: '1px solid rgba(198,139,58,0.1)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate" style={{ color: '#C68B3A', fontFamily: 'monospace' }}>{wh.url}</p>
                <p className="text-xs" style={dimStyle}>{wh.event}</p>
              </div>
              <button onClick={() => deleteWebhook(wh.id)}
                style={{ background: 'rgba(139,26,26,0.2)', color: 'rgba(245,240,232,0.4)', border: '1px solid rgba(139,26,26,0.3)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}>
                Del
              </button>
            </div>
          ))}
        </div>

        {/* CSV Export */}
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Export Data (CSV)</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Repair Log', key: 'dd_repair_log', file: 'dd-repair-log.csv' },
              { label: 'Assets', key: 'dd_assets', file: 'dd-assets.csv' },
            ].map(({ label, key, file }) => (
              <button key={key} onClick={() => {
                const data = JSON.parse(localStorage.getItem(key) || '[]')
                if (!data.length) { alert('No data to export'); return }
                const headers = Object.keys(data[0]).join(',')
                const rows = data.map((r: any) => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
                const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = file; a.click()
              }}
                className="py-3 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(198,139,58,0.12)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.25)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  )
}

