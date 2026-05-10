'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diesel-dude-api.onrender.com'
interface PartRow { description: string; qty: string; price: string }

function WorkOrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const entryId = searchParams.get('id')

  const [asset, setAsset] = useState<any>(null)
  const [shopName, setShopName] = useState('')
  const [shopPhone, setShopPhone] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [shopLogo, setShopLogo] = useState('')
  const [problemDesc, setProblemDesc] = useState('')
  const [laborNotes, setLaborNotes] = useState('')
  const [laborHours, setLaborHours] = useState('')
  const [laborRate, setLaborRate] = useState('')
  const [techName, setTechName] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [workOrderNum, setWorkOrderNum] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [parts, setParts] = useState<PartRow[]>([
    { description: '', qty: '1', price: '' },
    { description: '', qty: '1', price: '' },
  ])

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    setShopName(localStorage.getItem('dd_biz_name') || 'Diesel Dude Motor Pool')
    setShopPhone(localStorage.getItem('dd_biz_phone') || '')
    setShopAddress(localStorage.getItem('dd_biz_address') || '')
    setShopLogo(localStorage.getItem('dd_biz_logo') || '')
    const today = new Date()
    setOrderDate(today.toISOString().split('T')[0])
    setWorkOrderNum(`WO-${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${String(today.getHours()).padStart(2,'0')}${String(today.getMinutes()).padStart(2,'0')}`)
    const activeAsset = JSON.parse(localStorage.getItem('dd_active_asset') || '{}')
    if (activeAsset.name) setAsset(activeAsset)
    if (entryId) {
      const log = JSON.parse(localStorage.getItem('dd_repair_log') || '[]')
      const entry = log.find((e: any) => e.id === entryId)
      if (entry) { setProblemDesc(entry.symptom || ''); setLaborNotes(entry.diagnosis || '') }
    }
  }, [router, entryId])

  const partsSubtotal = parts.reduce((sum, p) => sum + (parseFloat(p.qty || '1') * parseFloat(p.price || '0')), 0)
  const laborTotal = laborHours && laborRate ? parseFloat(laborHours) * parseFloat(laborRate) : 0
  const grandTotal = partsSubtotal + laborTotal
  const iStyle = { border: 'none', borderBottom: '1px solid #ccc', outline: 'none', background: 'transparent', color: '#111', fontFamily: 'Georgia, serif', fontSize: '13px', padding: '2px 4px', width: '100%' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 no-print sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <div className="flex gap-2">
          <Link href="/log" className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(198,139,58,0.2)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.4)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
            &larr; Log
          </Link>
          <button onClick={() => window.print()} className="text-xs px-3 py-1.5 rounded-lg font-bold"
            style={{ background: '#C68B3A', color: '#3D1C02', border: 'none', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
            Print
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-4 no-print" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Work Order</h1>

        <div style={{ background: '#fff', color: '#111', borderRadius: '12px', padding: '24px', maxWidth: '700px', margin: '0 auto', fontFamily: 'Georgia, serif' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '3px solid #1a1a1a' }}>
            {shopLogo
              ? <img src={shopLogo} alt="logo" style={{ height: '60px', maxWidth: '200px', objectFit: 'contain', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
              : <div style={{ fontSize: '28px', marginBottom: '4px' }}>&#128295;</div>
            }
            <input value={shopName} onChange={e => setShopName(e.target.value)}
              style={{ ...iStyle, textAlign: 'center', fontSize: '18px', fontWeight: 'bold', width: '100%' }} />
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#555', marginTop: '2px' }}>WORK ORDER / REPAIR RECORD</div>
            {shopPhone && <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{shopPhone}</div>}
            {shopAddress && <div style={{ fontSize: '10px', color: '#777', marginTop: '1px' }}>{shopAddress}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '4px' }}>Work Order #</div>
              <input value={workOrderNum} onChange={e => setWorkOrderNum(e.target.value)} style={{ ...iStyle, fontSize: '14px', fontWeight: 'bold' }} />
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '4px' }}>Date</div>
              <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} style={{ ...iStyle }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '8px' }}>Asset / Equipment</div>
            {asset ? (
              <div>
                <strong>{asset.name}</strong>
                {asset.unit_number && <span style={{ color: '#555', marginLeft: '8px' }}>Unit: {asset.unit_number}</span>}
                {asset.engine && <div style={{ fontSize: '12px', color: '#555' }}>Engine: {asset.engine}</div>}
                {asset.serial && <div style={{ fontSize: '12px', color: '#555' }}>S/N: {asset.serial}</div>}
                {asset.hours && <div style={{ fontSize: '12px', color: '#555' }}>Hours: {asset.hours}</div>}
              </div>
            ) : <input style={{ ...iStyle }} placeholder="Asset name, unit #, make/model..." />}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '4px' }}>Problem / Symptom</div>
            <textarea value={problemDesc} onChange={e => setProblemDesc(e.target.value)}
              style={{ ...iStyle, minHeight: '60px', resize: 'vertical', borderBottom: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
              placeholder="Describe the fault, symptom, or reason for service..." />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '8px' }}>Parts / Materials</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  {['Description', 'Qty', 'Unit Price', 'Total'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Description' ? 'left' : 'right', padding: '4px 6px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555' }}>{h}</th>
                  ))}
                  <th style={{ width: '24px' }}></th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p, i) => {
                  const total = parseFloat(p.qty || '1') * parseFloat(p.price || '0')
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '4px 6px' }}><input value={p.description} onChange={e => { const n = [...parts]; n[i].description = e.target.value; setParts(n) }} style={{ ...iStyle }} placeholder="Part or material name" /></td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', width: '50px' }}><input value={p.qty} onChange={e => { const n = [...parts]; n[i].qty = e.target.value; setParts(n) }} style={{ ...iStyle, textAlign: 'right' }} /></td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', width: '80px' }}><input value={p.price} onChange={e => { const n = [...parts]; n[i].price = e.target.value; setParts(n) }} style={{ ...iStyle, textAlign: 'right' }} placeholder="0.00" /></td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', width: '80px' }}>{total > 0 ? `$${total.toFixed(2)}` : '-'}</td>
                      <td><button onClick={() => setParts(parts.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>x</button></td>
                    </tr>
                  )
                })}
                <tr><td colSpan={5} style={{ padding: '4px' }}><button onClick={() => setParts([...parts, { description: '', qty: '1', price: '' }])} style={{ background: 'none', border: '1px dashed #ccc', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', color: '#888', fontSize: '12px' }}>+ Add Part</button></td></tr>
                <tr style={{ borderTop: '2px solid #333' }}>
                  <td colSpan={3} style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>Parts Subtotal</td>
                  <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{partsSubtotal > 0 ? `$${partsSubtotal.toFixed(2)}` : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '20px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '8px' }}>Labor</div>
            <textarea value={laborNotes} onChange={e => setLaborNotes(e.target.value)}
              style={{ ...iStyle, minHeight: '60px', resize: 'vertical', border: '1px solid #eee', borderRadius: '4px', padding: '6px', marginBottom: '8px' }}
              placeholder="Describe work performed..." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div><div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>Hours</div><input value={laborHours} onChange={e => setLaborHours(e.target.value)} style={{ ...iStyle }} placeholder="0.0" /></div>
              <div><div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>Rate ($/hr)</div><input value={laborRate} onChange={e => setLaborRate(e.target.value)} style={{ ...iStyle }} placeholder="0.00" /></div>
              <div><div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>Labor Total</div><div style={{ fontWeight: 'bold', paddingTop: '2px' }}>{laborTotal > 0 ? `$${laborTotal.toFixed(2)}` : '-'}</div></div>
            </div>
          </div>

          <div style={{ textAlign: 'right', padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>TOTAL DUE</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : '$_________'}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>Technician Name</div><input value={techName} onChange={e => setTechName(e.target.value)} style={{ ...iStyle }} placeholder="Name" /></div>
            <div><div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>Signature</div><div style={{ borderBottom: '1px solid #333', height: '24px' }} /></div>
          </div>

          <div style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px', fontSize: '11px', color: '#555' }}>
            <strong>Customer Authorization:</strong> I authorize the above described work to be performed.
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <div><div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Customer Name</div><div style={{ borderBottom: '1px solid #ccc', height: '20px' }} /></div>
              <div><div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Signature / Date</div><div style={{ borderBottom: '1px solid #ccc', height: '20px' }} /></div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#aaa' }}>Generated by Diesel Dude by WastedApe — AI-powered diesel diagnostics</div>
        </div>

        <div className="no-print flex flex-col gap-3 mt-4" style={{ maxWidth: '700px', margin: '16px auto 0' }}>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="btn-primary flex-1" style={{ fontSize: '14px', padding: '12px' }}>Print / Save PDF</button>
            <button onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(198,139,58,0.2)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.4)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              Email to Customer
            </button>
          </div>
          {showEmailForm && (
            <div className="panel p-4 flex flex-col gap-3">
              <input className="input-field" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              <input type="email" className="input-field" placeholder="Customer Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
              <button disabled={!customerEmail || emailSending} onClick={async () => {
                setEmailSending(true)
                try {
                  await fetch(`${API_URL}/api/send-invoice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: customerEmail, customerName, shopName, shopPhone, shopAddress, workOrderNum, asset: asset ? `${asset.name} - ${asset.engine || ''}` : '', problemDesc, parts, laborDesc: laborNotes, laborHours, laborRate, laborTotal: laborTotal.toFixed(2), partsTotal: partsSubtotal.toFixed(2), grandTotal: grandTotal.toFixed(2), techName, date: orderDate }) })
                  setEmailSent(true); setTimeout(() => { setEmailSent(false); setShowEmailForm(false) }, 3000)
                } catch {} finally { setEmailSending(false) }
              }} className="btn-primary" style={{ padding: '10px', opacity: !customerEmail ? 0.5 : 1 }}>
                {emailSending ? 'Sending...' : emailSent ? 'Sent!' : 'Send Invoice'}
              </button>
            </div>
          )}
          <Link href="/log" className="text-center py-3 rounded-xl text-sm" style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
            &larr; Back to Log
          </Link>
        </div>
      </main>
      <NavBar />
    </div>
  )
}

export default function WorkOrderPage() {
  return <Suspense fallback={<div className="bg-plate min-h-screen" />}><WorkOrderContent /></Suspense>
}

