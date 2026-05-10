'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

interface Job {
  id: string; date: string; asset: string; symptom: string
  status: 'open' | 'in_progress' | 'complete' | 'invoiced'
  tech?: string
}

const STATUS_COLORS: Record<string, string> = {
  open: 'rgba(198,139,58,0.3)',
  in_progress: 'rgba(112,160,212,0.3)',
  complete: 'rgba(112,192,112,0.3)',
  invoiced: 'rgba(140,100,200,0.3)',
}
const STATUS_TEXT: Record<string, string> = {
  open: '#C68B3A', in_progress: '#70a0d4', complete: '#70c070', invoiced: '#8c64c8'
}
const NEXT_STATUS: Record<string, string> = {
  open: 'in_progress', in_progress: 'complete', complete: 'invoiced'
}
const STATUS_LABELS: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress', complete: 'Complete', invoiced: 'Invoiced'
}

export default function ServicePage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    // Load jobs from repair log
    const log = JSON.parse(localStorage.getItem('dd_repair_log') || '[]')
    const existing = JSON.parse(localStorage.getItem('dd_jobs') || '[]')
    // Merge repair log into jobs if not already there
    const jobIds = new Set(existing.map((j: Job) => j.id))
    const newJobs = log.filter((e: any) => !jobIds.has(e.id)).map((e: any) => ({
      id: e.id, date: e.date, asset: e.asset || 'Unknown', symptom: e.symptom || '', status: 'open' as const
    }))
    const allJobs = [...existing, ...newJobs]
    setJobs(allJobs)
    localStorage.setItem('dd_jobs', JSON.stringify(allJobs))
  }, [router])

  const advance = (id: string) => {
    const updated = jobs.map(j => j.id === id && NEXT_STATUS[j.status] ? { ...j, status: NEXT_STATUS[j.status] as Job['status'] } : j)
    setJobs(updated)
    localStorage.setItem('dd_jobs', JSON.stringify(updated))
  }

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)
  const dimStyle = { color: 'rgba(245,240,232,0.5)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.72)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <Logo size="sm" />
        <Link href="/" className="text-xs px-3 py-1.5 rounded-lg font-bold"
          style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
          + New Job
        </Link>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Service Department</h1>
        <p className="text-xs mb-4" style={dimStyle}>{jobs.length} total jobs</p>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['all', 'open', 'in_progress', 'complete', 'invoiced'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
              style={{ background: filter === f ? '#C68B3A' : 'rgba(198,139,58,0.1)', color: filter === f ? '#3D1C02' : '#C68B3A', border: '1px solid rgba(198,139,58,0.25)', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>
              {STATUS_LABELS[f] || 'All'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔩</p>
            <p className="text-sm mb-4" style={dimStyle}>No jobs yet. Ask the AI to diagnose a problem and save it to the log.</p>
            <Link href="/" className="btn-primary inline-block px-6 py-3 text-sm" style={{ textDecoration: 'none', width: 'auto' }}>
              Start Diagnosis
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(job => (
              <div key={job.id} className="panel p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: STATUS_COLORS[job.status], color: STATUS_TEXT[job.status] }}>
                        {STATUS_LABELS[job.status]}
                      </span>
                      <p className="text-xs" style={dimStyle}>{job.date}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{job.asset}</p>
                    <p className="text-xs mt-0.5 truncate" style={dimStyle}>{job.symptom}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {NEXT_STATUS[job.status] && (
                      <button onClick={() => advance(job.id)}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(198,139,58,0.15)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.3)', fontFamily: 'Georgia, serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {STATUS_LABELS[NEXT_STATUS[job.status]]} →
                      </button>
                    )}
                    <Link href={`/workorder?id=${job.id}`}
                      className="text-xs px-2 py-1 rounded-lg text-center"
                      style={{ background: 'rgba(198,139,58,0.1)', color: '#C68B3A', border: '1px solid rgba(198,139,58,0.2)', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>
                      Work Order
                    </Link>
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

