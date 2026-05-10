'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DIAGRAMS } from '@/lib/diagrams'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

export default function DiagramsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }
  const cats = [...new Set(DIAGRAMS.map(d => d.category))]

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <span className="text-xs" style={labelStyle}>📖 Library</span>
      </header>

      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(15,6,2,0.72)' }}>
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
            <p className="text-sm font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>
              {DIAGRAMS.find(d => d.id === selected)?.title}
            </p>
            <button onClick={() => setSelected(null)}
              style={{ background: 'rgba(139,26,26,0.3)', color: '#F5F0E8', border: '1px solid rgba(139,26,26,0.5)', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <img src={DIAGRAMS.find(d => d.id === selected)?.path} alt={selected}
              style={{ width: '100%', maxWidth: '900px', display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Library</h1>
        <p className="text-xs mb-4" style={dimStyle}>Diagrams, specs, and service manuals</p>

        {/* Service Manuals Section */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Service Manuals</p>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Cummins ISX / ISB / ISC', note: 'Search via AI — type your model' },
              { name: 'CAT C7 / C9 / C15', note: 'Search via AI — type your model' },
              { name: 'Detroit Series 60 / DD13 / DD15', note: 'Search via AI — type your model' },
              { name: 'Ford Power Stroke 6.7 / 7.3', note: 'Search via AI — type your model' },
              { name: 'Duramax LML / LBZ / LMM', note: 'Search via AI — type your model' },
            ].map(m => (
              <div key={m.name} className="panel p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{m.name}</p>
                  <p className="text-xs" style={dimStyle}>{m.note}</p>
                </div>
                <a href="/" style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', textDecoration: 'none', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>Ask AI</a>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>System Diagrams</p>
        <p className="text-xs mb-4" style={dimStyle}>{DIAGRAMS.length} diagrams — tap any to view full size</p>

        {cats.map(cat => (
          <div key={cat} className="mb-5">
            <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>{cat}</p>
            <div className="flex flex-col gap-3">
              {DIAGRAMS.filter(d => d.category === cat).map(d => (
                <button key={d.id} onClick={() => setSelected(d.id)}
                  className="panel p-4 text-left w-full"
                  style={{ cursor: 'pointer' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{d.title}</p>
                  <p className="text-xs" style={dimStyle}>{d.description}</p>
                  <p className="text-xs mt-2" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>Tap to view</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
      <NavBar />
    </div>
  )
}

