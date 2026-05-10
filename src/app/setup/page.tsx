'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

const STEPS = [
  {
    id: 'account', icon: '👤', title: 'Create Your Account',
    desc: 'Sign up to access Diesel Dude.',
    details: ['Go to dieseldude.thewastedape.com', 'Click "Create Account"', 'Enter your email and password', 'Click Continue'],
  },
  {
    id: 'asset', icon: '🚛', title: 'Add Your First Asset',
    desc: 'Add a truck, machine, or piece of equipment.',
    details: ['Click the Assets tab', 'Click "+ Add Asset"', 'Enter unit name, year, make, model, and engine type', 'Add hours or odometer reading', 'Click Save'],
    action: { label: 'Go to Assets', href: '/assets' },
    tip: 'The more info you add, the more accurate the AI diagnoses. Engine type is especially important.',
  },
  {
    id: 'shop', icon: '🏢', title: 'Set Up Your Shop Profile',
    desc: 'Your shop name and contact info appear on every work order.',
    details: ['Click Settings', 'Find "Shop Profile"', 'Enter your shop name, phone, and address', 'Click Save Shop Profile'],
    action: { label: 'Go to Settings', href: '/settings' },
  },
  {
    id: 'chat', icon: '🧠', title: 'Ask the AI Your First Question',
    desc: 'Describe the fault, symptom, or problem in plain English.',
    details: ['Click the AI tab', 'Type your problem — fault code, symptom, noise, smell', 'Click Send', 'Read the diagnosis and recommended steps', 'Click Save to Log to save it'],
    action: { label: 'Open AI Chat', href: '/' },
    tip: 'Include the fault code if you have one. Example: "P0401 on a 2019 Freightliner DD15" gets a much more specific answer.',
  },
  {
    id: 'codes', icon: '⚠️', title: 'Look Up a Fault Code',
    desc: 'Enter any OBD2, J1939, Cummins, CAT, or Detroit code for an instant explanation.',
    details: ['Click the Codes tab (or Library)', 'Type your fault code', 'Click Look Up', 'Read the plain-English explanation and fix steps'],
    action: { label: 'Open Fault Codes', href: '/codes' },
  },
  {
    id: 'workorder', icon: '📄', title: 'Create a Work Order',
    desc: 'Turn a saved diagnosis into a professional work order.',
    details: ['Go to the Log tab', 'Click a saved entry', 'Click WO to open the Work Order', 'Asset and shop info auto-fill', 'Add parts and labor', 'Print or email to customer'],
    action: { label: 'Open Log', href: '/log' },
  },
]

export default function SetupPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('dd_setup_progress')
    if (saved) {
      const parsed = JSON.parse(saved)
      setCompleted(parsed)
      // Find first incomplete step
      const firstIncomplete = STEPS.findIndex(s => !parsed[s.id])
      if (firstIncomplete >= 0) setCurrent(firstIncomplete)
    }
  }, [])

  const markDone = (id: string) => {
    const updated = { ...completed, [id]: true }
    setCompleted(updated)
    localStorage.setItem('dd_setup_progress', JSON.stringify(updated))
    if (current < STEPS.length - 1) setCurrent(current + 1)
  }

  const resetProgress = () => {
    setCompleted({})
    setCurrent(0)
    localStorage.removeItem('dd_setup_progress')
  }

  const doneCount = Object.values(completed).filter(Boolean).length
  const allDone = doneCount >= STEPS.length
  const step = STEPS[current]

  const dimStyle = { color: 'rgba(245,240,232,0.6)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.90)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold" style={labelStyle}>{doneCount} / {STEPS.length} complete</span>
          {doneCount > 0 && (
            <button onClick={resetProgress} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.3)', cursor: 'pointer', fontSize: '12px', fontFamily: 'Georgia, serif' }}>
              Reset
            </button>
          )}
          <Link href="/" style={{ background: 'rgba(198,139,58,0.15)', border: '1px solid rgba(198,139,58,0.35)', borderRadius: '8px', padding: '6px 14px', color: '#C68B3A', textDecoration: 'none', fontSize: '13px', fontFamily: 'Georgia, serif' }}>
            Skip to App →
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Title + Progress bar */}
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Setup Guide</h1>
          <p className="text-sm mb-5" style={dimStyle}>Get your motor pool running in {STEPS.length} steps</p>

          <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(198,139,58,0.15)' }}>
            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${(doneCount / STEPS.length) * 100}%`, background: '#C68B3A' }} />
          </div>

          {allDone ? (
            /* All done state */
            <div className="panel p-8 text-center">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Motor Pool is online!</h2>
              <p className="text-sm mb-6" style={dimStyle}>You're all set. Head to the AI to start diagnosing.</p>
              <Link href="/" className="btn-primary inline-block px-8 py-3" style={{ textDecoration: 'none', width: 'auto', fontSize: '15px' }}>
                Go to AI Chat →
              </Link>
            </div>
          ) : (
            <div className="setup-grid">

              {/* Step list sidebar */}
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>All Steps</p>
                {STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => setCurrent(i)}
                    className="w-full flex items-center gap-3 py-3 text-left"
                    style={{
                      borderBottom: i < STEPS.length - 1 ? '1px solid rgba(198,139,58,0.12)' : 'none',
                      background: i === current ? 'rgba(198,139,58,0.08)' : 'none',
                      borderRadius: i === current ? '8px' : '0',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      border: i === current ? '1px solid rgba(198,139,58,0.25)' : 'none',
                      marginBottom: i < STEPS.length - 1 ? '2px' : '0',
                    }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold',
                      background: completed[s.id] ? 'rgba(112,192,112,0.25)' : i === current ? '#C68B3A' : 'rgba(198,139,58,0.15)',
                      color: completed[s.id] ? '#70c070' : i === current ? '#3D1C02' : 'rgba(245,240,232,0.5)',
                      flexShrink: 0,
                    }}>
                      {completed[s.id] ? '✓' : i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '12px', fontFamily: 'Georgia, serif',
                        color: completed[s.id] ? 'rgba(245,240,232,0.35)' : i === current ? '#F5F0E8' : 'rgba(245,240,232,0.6)',
                        textDecoration: completed[s.id] ? 'line-through' : 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{s.title}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active step panel */}
              <div className="panel p-6">
                <div className="flex items-start gap-4 mb-5">
                  <span style={{ fontSize: '36px', lineHeight: 1 }}>{step.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={labelStyle}>Step {current + 1} of {STEPS.length}</p>
                    <h2 className="text-lg font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{step.title}</h2>
                    <p className="text-sm mt-1" style={dimStyle}>{step.desc}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  {step.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span style={{
                        flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                        background: 'rgba(198,139,58,0.2)', color: '#C68B3A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold', fontFamily: 'Georgia, serif'
                      }}>{i + 1}</span>
                      <p className="text-sm" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', lineHeight: '1.6', paddingTop: '2px' }}>{d}</p>
                    </div>
                  ))}
                </div>

                {step.tip && (
                  <div className="px-4 py-3 rounded-xl mb-5" style={{ background: 'rgba(198,139,58,0.08)', border: '1px solid rgba(198,139,58,0.2)' }}>
                    <p className="text-sm" style={{ color: 'rgba(198,139,58,0.9)', fontFamily: 'Georgia, serif' }}>
                      <strong>Tip:</strong> {step.tip}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  {step.action && (
                    <Link href={step.action.href}
                      className="flex-1 py-3 rounded-xl text-sm text-center font-bold"
                      style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                      {step.action.label} →
                    </Link>
                  )}
                  <button onClick={() => markDone(step.id)}
                    className={`${step.action ? '' : 'w-full'} flex-1 py-3 rounded-xl text-sm font-bold`}
                    style={{
                      background: completed[step.id] ? 'rgba(112,192,112,0.2)' : '#C68B3A',
                      color: completed[step.id] ? '#70c070' : '#3D1C02',
                      border: completed[step.id] ? '1px solid rgba(112,192,112,0.3)' : 'none',
                      fontFamily: 'Georgia, serif', cursor: 'pointer'
                    }}>
                    {completed[step.id] ? '✓ Done' : 'Mark Complete →'}
                  </button>
                </div>

                {/* Prev/Next navigation */}
                <div className="flex justify-between mt-4">
                  <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                    style={{ background: 'none', border: 'none', color: current === 0 ? 'rgba(245,240,232,0.2)' : 'rgba(245,240,232,0.5)', cursor: current === 0 ? 'default' : 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                    ← Previous
                  </button>
                  <button onClick={() => setCurrent(Math.min(STEPS.length - 1, current + 1))} disabled={current === STEPS.length - 1}
                    style={{ background: 'none', border: 'none', color: current === STEPS.length - 1 ? 'rgba(245,240,232,0.2)' : 'rgba(245,240,232,0.5)', cursor: current === STEPS.length - 1 ? 'default' : 'pointer', fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                    Next →
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  )
}
