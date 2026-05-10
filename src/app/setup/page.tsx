'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

const STEPS = [
  {
    id: 'account', icon: '\uD83D\uDC64', title: 'Step 1 \u2014 Create Your Account',
    desc: 'Sign up to access Diesel Dude.',
    details: ['Go to dieseldude.thewastedape.com', 'Tap "Create Account"', 'Enter your email and password', 'Tap Continue'],
  },
  {
    id: 'asset', icon: '\uD83D\uDE9B', title: 'Step 2 \u2014 Add Your First Asset',
    desc: 'Add a truck, machine, or piece of equipment.',
    details: ['Tap the Assets tab at the bottom', 'Tap "+ Add Asset"', 'Enter unit name, year, make, model, and engine', 'Add hours or odometer reading', 'Tap Save'],
    action: { label: 'Go to Assets', href: '/assets' },
    tip: 'The more info you add, the more accurate the AI diagnoses. Engine type is especially important.',
  },
  {
    id: 'shop', icon: '\uD83C\uDFE2', title: 'Step 3 \u2014 Set Up Your Shop Profile',
    desc: 'Your shop name and contact info appear on every work order.',
    details: ['Tap Settings', 'Find "Shop Profile"', 'Enter your shop name, phone, and address', 'Tap Save Shop Profile'],
    action: { label: 'Go to Settings', href: '/settings' },
  },
  {
    id: 'chat', icon: '\uD83E\uDDE0', title: 'Step 4 \u2014 Ask the AI Your First Question',
    desc: 'Describe the fault, symptom, or problem in plain English.',
    details: ['Tap the AI tab', 'Type your problem \u2014 fault code, symptom, noise, smell', 'Tap Send', 'Read the diagnosis and recommended steps', 'Tap Save to Log to save it'],
    action: { label: 'Open AI Chat', href: '/' },
    tip: 'Include the fault code if you have one. Example: "P0401 on a 2019 Freightliner DD15" gets a much more specific answer.',
  },
  {
    id: 'codes', icon: '\u26A0\uFE0F', title: 'Step 5 \u2014 Look Up a Fault Code',
    desc: 'Enter any OBD2, J1939, Cummins, CAT, or Detroit code for an instant explanation.',
    details: ['Tap the Codes tab', 'Type your fault code', 'Tap Look Up', 'Read the plain-English explanation and fix steps'],
    action: { label: 'Open Fault Codes', href: '/codes' },
  },
  {
    id: 'workorder', icon: '\uD83D\uDCC4', title: 'Step 6 \u2014 Create a Work Order',
    desc: 'Turn a saved diagnosis into a professional work order.',
    details: ['Go to the Log tab', 'Tap a saved entry', 'Tap WO to open the Work Order', 'Asset and shop info auto-fill', 'Add parts and labor', 'Print or email to customer'],
    action: { label: 'Open Log', href: '/log' },
  },
]

export default function SetupPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('dd_setup_progress')
    if (saved) setCompleted(JSON.parse(saved))
  }, [])

  const markDone = (id: string) => {
    const updated = { ...completed, [id]: true }
    setCompleted(updated)
    localStorage.setItem('dd_setup_progress', JSON.stringify(updated))
    const newDone = Object.values(updated).filter(Boolean).length
    if (newDone >= STEPS.length) {
      // All done — go to AI chat after short delay
      setTimeout(() => router.push('/'), 1000)
    } else if (current < STEPS.length - 1) {
      setCurrent(current + 1)
    }
  }

  const doneCount = Object.values(completed).filter(Boolean).length
  const step = STEPS[current]
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <span className="text-xs" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{doneCount} / {STEPS.length} complete</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Setup Guide</h1>
        <p className="text-xs mb-5" style={dimStyle}>Get your motor pool running in 6 steps</p>

        <div className="w-full h-2 rounded-full mb-5" style={{ background: 'rgba(198,139,58,0.15)' }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${(doneCount/STEPS.length)*100}%`, background: '#C68B3A' }} />
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setCurrent(i)}
              className="flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center"
              style={{ background: completed[s.id] ? 'rgba(112,192,112,0.3)' : i === current ? '#C68B3A' : 'rgba(198,139,58,0.15)', color: completed[s.id] ? '#70c070' : i === current ? '#3D1C02' : 'rgba(245,240,232,0.4)', border: 'none', cursor: 'pointer' }}>
              {completed[s.id] ? '\u2713' : i + 1}
            </button>
          ))}
        </div>

        <div className="panel p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">{step.icon}</span>
            <div>
              <h2 className="text-base font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{step.title}</h2>
              <p className="text-sm mt-1" style={dimStyle}>{step.desc}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {step.details.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(198,139,58,0.2)', color: '#C68B3A', minWidth: '20px', fontSize: '11px' }}>{i+1}</span>
                <p className="text-sm" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif', lineHeight: '1.5' }}>{d}</p>
              </div>
            ))}
          </div>
          {step.tip && (
            <div className="px-3 py-2 rounded-lg mb-4" style={{ background: 'rgba(198,139,58,0.08)', border: '1px solid rgba(198,139,58,0.2)' }}>
              <p className="text-xs" style={{ color: 'rgba(198,139,58,0.8)', fontFamily: 'Georgia, serif' }}>Tip: {step.tip}</p>
            </div>
          )}
          <div className="flex gap-2">
            {step.action && (
              <Link href={step.action.href} className="flex-1 py-3 rounded-xl text-sm text-center font-bold"
                style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                {step.action.label} &rarr;
              </Link>
            )}
            <button onClick={() => markDone(step.id)}
              className={`${step.action ? '' : 'w-full'} flex-1 py-3 rounded-xl text-sm font-bold`}
              style={{ background: completed[step.id] ? 'rgba(112,192,112,0.2)' : '#C68B3A', color: completed[step.id] ? '#70c070' : '#3D1C02', border: completed[step.id] ? '1px solid rgba(112,192,112,0.3)' : 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              {completed[step.id] ? 'Done' : 'Mark Complete'}
            </button>
          </div>
        </div>

        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>All Steps</p>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setCurrent(i)} className="w-full flex items-center gap-3 py-2.5 text-left"
              style={{ borderBottom: i < STEPS.length - 1 ? '1px solid rgba(198,139,58,0.1)' : 'none', background: 'none', cursor: 'pointer' }}>
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm flex-1" style={{ color: completed[s.id] ? 'rgba(245,240,232,0.3)' : '#F5F0E8', fontFamily: 'Georgia, serif', textDecoration: completed[s.id] ? 'line-through' : 'none' }}>{s.title}</p>
              {i === current && <span className="text-xs" style={{ color: '#C68B3A' }}>&larr; here</span>}
            </button>
          ))}
        </div>

        {doneCount === STEPS.length && (
          <div className="panel p-5 mt-4 text-center">
            <p className="text-3xl mb-2">&#128295;</p>
            <p className="text-base font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Motor Pool online!</p>
            <Link href="/" className="btn-primary inline-block px-6 py-3 mt-3" style={{ textDecoration: 'none', width: 'auto' }}>Go to AI Chat</Link>
          </div>
        )}
      </main>
    </div>
  )
}

