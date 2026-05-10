'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'

const COMMON_CODES = [
  // OBD2 - EGR
  { code: 'P0401', system: 'EGR', desc: 'EGR Insufficient Flow' },
  { code: 'P0402', system: 'EGR', desc: 'EGR Excessive Flow' },
  { code: 'P0403', system: 'EGR', desc: 'EGR Control Circuit Malfunction' },
  { code: 'P0404', system: 'EGR', desc: 'EGR Control Circuit Range/Performance' },
  // OBD2 - Fuel
  { code: 'P0087', system: 'Fuel', desc: 'Fuel Rail/System Pressure Too Low' },
  { code: 'P0088', system: 'Fuel', desc: 'Fuel Rail/System Pressure Too High' },
  { code: 'P0191', system: 'Fuel', desc: 'Fuel Rail Pressure Sensor Range' },
  { code: 'P0193', system: 'Fuel', desc: 'Fuel Rail Pressure Sensor High' },
  { code: 'P0094', system: 'Fuel', desc: 'Fuel System Leak Detected - Small Leak' },
  // OBD2 - DPF/Aftertreatment
  { code: 'P2002', system: 'DPF', desc: 'DPF Efficiency Below Threshold Bank 1' },
  { code: 'P2003', system: 'DPF', desc: 'DPF Efficiency Below Threshold Bank 2' },
  { code: 'P244A', system: 'DPF', desc: 'DPF Differential Pressure Too Low' },
  { code: 'P244B', system: 'DPF', desc: 'DPF Differential Pressure Too High' },
  { code: 'P2463', system: 'DPF', desc: 'DPF Soot Accumulation' },
  // OBD2 - SCR/DEF
  { code: 'P20EE', system: 'SCR', desc: 'SCR NOx Catalyst Efficiency Below Threshold' },
  { code: 'P207F', system: 'SCR', desc: 'Reductant Quality Performance' },
  { code: 'P11DC', system: 'SCR', desc: 'Reductant Injection - Too Little Detected' },
  { code: 'P20BA', system: 'SCR', desc: 'Reductant Heater A Performance' },
  // OBD2 - Turbo
  { code: 'P0045', system: 'Turbo', desc: 'Turbo Boost Control Solenoid A Open' },
  { code: 'P0046', system: 'Turbo', desc: 'Turbo Boost Control Solenoid A Range' },
  { code: 'P0234', system: 'Turbo', desc: 'Turbocharger Overboost Condition' },
  { code: 'P0299', system: 'Turbo', desc: 'Turbocharger Underboost Condition' },
  { code: 'P0243', system: 'Turbo', desc: 'Turbocharger Wastegate Solenoid A' },
  // OBD2 - Exhaust
  { code: 'P0472', system: 'Exhaust', desc: 'Exhaust Pressure Sensor A Low' },
  { code: 'P0473', system: 'Exhaust', desc: 'Exhaust Pressure Sensor A High' },
  { code: 'P0478', system: 'Exhaust', desc: 'Exhaust Pressure Control Valve A High' },
  // OBD2 - Intake/Cooling
  { code: 'P0542', system: 'Intake', desc: 'Intake Air Heater A Circuit High' },
  { code: 'P0543', system: 'Intake', desc: 'Intake Air Heater A Circuit Open' },
  { code: 'P0128', system: 'Cooling', desc: 'Coolant Temp Below Thermostat Temp' },
  { code: 'P0217', system: 'Cooling', desc: 'Engine Coolant Over Temperature' },
  { code: 'P0218', system: 'Cooling', desc: 'Transmission Over Temperature' },
  // Cummins specific
  { code: '2636', system: 'Cummins', desc: 'Fuel Delivery Pressure - Low' },
  { code: '3714', system: 'Cummins', desc: 'VGT Actuator - Abnormal Rate of Change' },
  { code: '2449', system: 'Cummins', desc: 'Aftertreatment DEF Quality - Degraded' },
  { code: '3868', system: 'Cummins', desc: 'Aftertreatment SCR Operator Inducement' },
  { code: '1636', system: 'Cummins', desc: 'Injection Control Pressure - Low' },
  { code: '1896', system: 'Cummins', desc: 'DPF Differential Pressure Sensor - Low' },
  { code: '4076', system: 'Cummins', desc: 'NOx Sensor - Out of Range High' },
  // J1939 SPN codes
  { code: 'SPN 94', system: 'J1939', desc: 'Fuel Delivery Pressure' },
  { code: 'SPN 110', system: 'J1939', desc: 'Engine Coolant Temperature' },
  { code: 'SPN 157', system: 'J1939', desc: 'Injector Metering Rail 1 Pressure' },
  { code: 'SPN 3226', system: 'J1939', desc: 'Aftertreatment 1 Outlet NOx' },
  { code: 'SPN 3251', system: 'J1939', desc: 'Aftertreatment 1 DPF Differential Pressure' },
  { code: 'SPN 3364', system: 'J1939', desc: 'Aftertreatment 1 SCR Catalyst Efficiency' },
  { code: 'SPN 3516', system: 'J1939', desc: 'Aftertreatment 1 DEF Concentration' },
  { code: 'SPN 641', system: 'J1939', desc: 'VGT Actuator Control' },
  { code: 'SPN 190', system: 'J1939', desc: 'Engine Speed' },
  { code: 'SPN 100', system: 'J1939', desc: 'Engine Oil Pressure' },
  // CAT codes
  { code: 'E2128', system: 'CAT', desc: 'High Exhaust Temperature - Engine Protection' },
  { code: 'E3689', system: 'CAT', desc: 'DPF Differential Pressure High' },
  { code: 'E3726', system: 'CAT', desc: 'DEF Quality Fault' },
  { code: 'E1916', system: 'CAT', desc: 'EGR System Fault' },
  // Detroit DDL codes
  { code: 'SPN 4364', system: 'Detroit', desc: 'EGR Rate Too Low' },
  { code: 'SPN 3720', system: 'Detroit', desc: 'DEF Level Low' },
]

function CodesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => { if (!isLoggedIn()) router.replace('/login') }, [router])

  const lookupCode = async (c?: string) => {
    const query = (c || code).trim()
    if (!query) return
    setCode(query)
    setLoading(true)
    setResult('')
    try {
      const r = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Diesel fault code: ${query}. What does this code mean, what are the common causes, and what are the diagnostic steps to fix it? Be specific and practical for a working mechanic.`, sessionId: 'code_lookup' })
      })
      const data = await r.json()
      setResult(data.reply || 'No result found.')
    } catch { setResult('Connection error. Try again.') }
    finally { setLoading(false) }
  }

  const systemOrder = ['All', 'EGR', 'Fuel', 'DPF', 'SCR', 'Turbo', 'Exhaust', 'Intake', 'Cooling', 'Cummins', 'J1939', 'CAT', 'Detroit']
  const systems = systemOrder.filter(s => s === 'All' || COMMON_CODES.some(c => c.system === s))
  const filtered = filter === 'All' ? COMMON_CODES : COMMON_CODES.filter(c => c.system === filter)
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <span className="text-xs" style={labelStyle}>Fault Code Lookup</span>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Fault Code Lookup</h1>
        <p className="text-xs mb-4" style={dimStyle}>OBD2, J1939, Cummins, CAT, Detroit, Allison</p>

        <div className="panel p-4 mb-5">
          <label className="block text-xs mb-2" style={labelStyle}>Enter Fault Code</label>
          <div className="flex gap-2">
            <input className="input-field flex-1" value={code} onChange={e => setCode(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') lookupCode() }}
              placeholder="P0401, SPN 94, 3714, CAT E2128..." />
            <button onClick={() => lookupCode()} disabled={loading || !code.trim()}
              style={{ background: (!code.trim() || loading) ? 'rgba(198,139,58,0.2)' : '#C68B3A', color: (!code.trim() || loading) ? 'rgba(198,139,58,0.4)' : '#3D1C02', border: 'none', borderRadius: '10px', padding: '10px 16px', fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? '...' : 'Look Up'}
            </button>
          </div>
        </div>

        {(loading || result) && (
          <div className="panel p-4 mb-5">
            {loading ? (
              <p className="text-sm" style={dimStyle}>Looking up code...</p>
            ) : (
              <>
                <p className="text-xs font-bold mb-2" style={labelStyle}>Code: {code.toUpperCase()}</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{result}</p>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {systems.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
              style={{ background: filter === s ? '#C68B3A' : 'rgba(198,139,58,0.1)', color: filter === s ? '#3D1C02' : '#C68B3A', border: '1px solid rgba(198,139,58,0.25)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>

        <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Common Diesel Codes</p>
        <div className="flex flex-col gap-2">
          {filtered.map(c => (
            <button key={c.code} onClick={() => lookupCode(c.code)}
              className="panel p-3 text-left w-full"
              style={{ borderColor: 'rgba(198,139,58,0.15)', cursor: 'pointer' }}>
              <div className="flex items-center gap-3">
                <code className="text-xs px-2 py-0.5 rounded flex-shrink-0 font-bold"
                  style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', fontFamily: 'monospace' }}>{c.code}</code>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{c.desc}</p>
                  <p className="text-xs mt-0.5" style={dimStyle}>{c.system}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
      <NavBar />
    </div>
  )
}

export default function CodesPage() {
  return <Suspense fallback={<div className="bg-plate min-h-screen" />}><CodesContent /></Suspense>
}

