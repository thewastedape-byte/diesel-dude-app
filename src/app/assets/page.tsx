'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

interface Asset {
  id: string; name: string; year?: string; make: string; model?: string
  engine?: string; serial?: string; unit_number?: string; hours?: string
  odometer?: string; type?: string; notes?: string
}

const EMPTY: Omit<Asset,'id'> = { name:'', make:'', model:'', year:'', engine:'', serial:'', unit_number:'', hours:'', odometer:'', type:'truck', notes:'' }
const TYPES = ['truck','excavator','loader','grader','crane','dozer','scraper','generator','forklift','semi','other']
function genId() { return Date.now().toString(36) + Math.random().toString(36).substring(2) }

export default function AssetsPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [activeId, setActiveId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [form, setForm] = useState<Omit<Asset,'id'>>(EMPTY)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    const raw = localStorage.getItem('dd_assets')
    if (raw) { const a = JSON.parse(raw); setAssets(a); if (a.length) setActiveId(a[0].id) }
    const active = localStorage.getItem('dd_active_asset_id')
    if (active) setActiveId(active)
  }, [router])

  const save = (updated: Asset[]) => { setAssets(updated); localStorage.setItem('dd_assets', JSON.stringify(updated)) }

  const setActive = (id: string) => {
    setActiveId(id)
    localStorage.setItem('dd_active_asset_id', id)
    const asset = assets.find(a => a.id === id)
    if (asset) localStorage.setItem('dd_active_asset', JSON.stringify(asset))
  }

  const handleSave = () => {
    if (!form.name || !form.make) { alert('Name and make are required.'); return }
    const updated = editing
      ? assets.map(a => a.id === editing.id ? { id: editing.id, ...form } : a)
      : [...assets, { id: genId(), ...form }]
    save(updated)
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }

  const del = (id: string) => { if (!confirm('Delete this asset?')) return; save(assets.filter(a => a.id !== id)) }
  const set = (k: keyof typeof EMPTY, v: string) => setForm(f => ({ ...f, [k]: v }))
  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.make.toLowerCase().includes(search.toLowerCase()) || (a.unit_number||'').toLowerCase().includes(search.toLowerCase()))
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY) }}
          className="text-xs px-3 py-1.5 rounded-lg font-bold"
          style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', border: 'none', cursor: 'pointer' }}>
          + Add Asset
        </button>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Asset Log</h1>
        <p className="text-xs mb-4" style={dimStyle}>{assets.length} assets</p>
        <input className="input-field mb-4" placeholder="Search by name, make, or unit #..." value={search} onChange={e => setSearch(e.target.value)} />

        {showForm && (
          <div className="panel p-4 mb-4">
            <h2 className="text-sm font-bold mb-3" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{editing ? 'Edit Asset' : 'Add Asset'}</h2>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs mb-1" style={labelStyle}>Asset Name *</label>
                  <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Unit 47 - CAT 336" /></div>
                <div><label className="block text-xs mb-1" style={labelStyle}>Unit Number</label>
                  <input className="input-field" value={form.unit_number||''} onChange={e => set('unit_number', e.target.value)} placeholder="Unit 47" /></div>
              </div>
              <div><label className="block text-xs mb-1" style={labelStyle}>Equipment Type</label>
                <select className="input-field" value={form.type} onChange={e => set('type', e.target.value)}
                  style={{ background: 'rgba(245,240,232,0.08)', color: '#F5F0E8' }}>
                  {TYPES.map(t => <option key={t} value={t} style={{ background: '#1a0a02' }}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs mb-1" style={labelStyle}>Year</label>
                  <input className="input-field" value={form.year||''} onChange={e => set('year', e.target.value)} placeholder="2019" /></div>
                <div><label className="block text-xs mb-1" style={labelStyle}>Make *</label>
                  <input className="input-field" value={form.make} onChange={e => set('make', e.target.value)} placeholder="CAT" /></div>
                <div><label className="block text-xs mb-1" style={labelStyle}>Model</label>
                  <input className="input-field" value={form.model||''} onChange={e => set('model', e.target.value)} placeholder="336" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs mb-1" style={labelStyle}>Engine</label>
                  <input className="input-field" value={form.engine||''} onChange={e => set('engine', e.target.value)} placeholder="CAT C9.3" /></div>
                <div><label className="block text-xs mb-1" style={labelStyle}>Serial / VIN</label>
                  <input className="input-field" value={form.serial||''} onChange={e => set('serial', e.target.value)} placeholder="CAT0336..." /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs mb-1" style={labelStyle}>Hours</label>
                  <input type="number" className="input-field" value={form.hours||''} onChange={e => set('hours', e.target.value)} placeholder="4250" /></div>
                <div><label className="block text-xs mb-1" style={labelStyle}>Odometer (mi)</label>
                  <input type="number" className="input-field" value={form.odometer||''} onChange={e => set('odometer', e.target.value)} placeholder="125000" /></div>
              </div>
              <div><label className="block text-xs mb-1" style={labelStyle}>Notes</label>
                <textarea className="input-field resize-none" rows={2} value={form.notes||''} onChange={e => set('notes', e.target.value)} placeholder="Known issues, department, operator..." /></div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn-primary flex-1" style={{ padding: '10px', fontSize: '14px' }}>Save</button>
                <button onClick={() => { setShowForm(false); setEditing(null) }}
                  className="flex-1 py-2 rounded-lg text-sm"
                  style={{ background: 'rgba(139,26,26,0.2)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(139,26,26,0.3)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🚛</p>
            <p className="text-sm" style={dimStyle}>{search ? 'No assets match.' : 'No assets yet. Add your first machine.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(asset => (
              <div key={asset.id} className="panel p-4"
                style={{ borderColor: asset.id === activeId ? 'rgba(198,139,58,0.6)' : 'rgba(198,139,58,0.2)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0" onClick={() => setActive(asset.id)} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{asset.name}</p>
                      {asset.id === activeId && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#C68B3A', color: '#3D1C02' }}>Active</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      {asset.unit_number && <p className="text-xs" style={dimStyle}>Unit: {asset.unit_number}</p>}
                      {asset.engine && <p className="text-xs" style={dimStyle}>{asset.engine}</p>}
                      {asset.serial && <p className="text-xs" style={dimStyle}>S/N: {asset.serial}</p>}
                      {asset.hours && <p className="text-xs font-bold" style={{ color: '#C68B3A', fontFamily: 'Georgia, serif' }}>{asset.hours} hrs</p>}
                      {asset.odometer && <p className="text-xs" style={dimStyle}>{parseInt(asset.odometer).toLocaleString()} mi</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditing(asset); setForm({ name:asset.name, make:asset.make, model:asset.model||'', year:asset.year||'', engine:asset.engine||'', serial:asset.serial||'', unit_number:asset.unit_number||'', hours:asset.hours||'', odometer:asset.odometer||'', type:asset.type||'truck', notes:asset.notes||'' }); setShowForm(true) }}
                      style={{ background:'rgba(198,139,58,0.1)', color:'rgba(198,139,58,0.7)', border:'1px solid rgba(198,139,58,0.2)', borderRadius:'6px', padding:'4px 8px', fontSize:'11px', cursor:'pointer' }}>Edit</button>
                    <button onClick={() => del(asset.id)}
                      style={{ background:'rgba(139,26,26,0.1)', color:'rgba(245,240,232,0.3)', border:'1px solid rgba(139,26,26,0.2)', borderRadius:'6px', padding:'4px 8px', fontSize:'11px', cursor:'pointer' }}>Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <NavBar />
    </div>
  )
}

