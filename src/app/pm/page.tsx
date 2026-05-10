'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

interface PMTask {
  id: string
  name: string
  intervalType: 'hours' | 'miles' | 'months'
  interval: number
  lastDone?: number
  lastDate?: string
  notes?: string
  custom?: boolean
}

const DEFAULT_TASKS: PMTask[] = [
  { id: 'oil', name: 'Engine Oil & Filter', intervalType: 'hours', interval: 500 },
  { id: 'fuel', name: 'Fuel Filter', intervalType: 'hours', interval: 500 },
  { id: 'dpf', name: 'DPF Cleaning', intervalType: 'hours', interval: 3000 },
  { id: 'def', name: 'DEF System Inspection', intervalType: 'months', interval: 6 },
  { id: 'coolant', name: 'Coolant Flush', intervalType: 'hours', interval: 2000 },
  { id: 'air', name: 'Air Filter', intervalType: 'hours', interval: 1000 },
  { id: 'injector', name: 'Injector Service', intervalType: 'hours', interval: 5000 },
  { id: 'turbo', name: 'Turbo Inspection', intervalType: 'hours', interval: 2500 },
  { id: 'belt', name: 'Belt & Hose Inspection', intervalType: 'months', interval: 12 },
  { id: 'impeller', name: 'Raw Water Pump Impeller', intervalType: 'hours', interval: 1000 },
]

export default function PMPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<PMTask[]>([])
  const [asset, setAsset] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ name: '', intervalType: 'hours', interval: 500 })
  const [currentHours, setCurrentHours] = useState<number>(0)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return }
    const saved = localStorage.getItem('dd_pm_tasks')
    setTasks(saved ? JSON.parse(saved) : DEFAULT_TASKS)
    const activeAsset = JSON.parse(localStorage.getItem('dd_active_asset') || '{}')
    setAsset(activeAsset)
    if (activeAsset.hours) setCurrentHours(parseInt(activeAsset.hours) || 0)
  }, [router])

  const saveTasks = (updated: PMTask[]) => {
    setTasks(updated)
    localStorage.setItem('dd_pm_tasks', JSON.stringify(updated))
  }

  const markDone = (id: string) => {
    const updated = tasks.map(t => t.id === id ? {
      ...t,
      lastDone: currentHours,
      lastDate: new Date().toLocaleDateString()
    } : t)
    saveTasks(updated)
  }

  const getStatus = (task: PMTask): 'overdue' | 'due_soon' | 'ok' | 'unknown' => {
    if (!task.lastDone && !task.lastDate) return 'unknown'
    if (task.intervalType === 'hours' && task.lastDone !== undefined) {
      const hoursUntilDue = (task.lastDone + task.interval) - currentHours
      if (hoursUntilDue <= 0) return 'overdue'
      if (hoursUntilDue <= task.interval * 0.1) return 'due_soon'
      return 'ok'
    }
    if (task.intervalType === 'months' && task.lastDate) {
      const lastDate = new Date(task.lastDate)
      const nextDue = new Date(lastDate)
      nextDue.setMonth(nextDue.getMonth() + task.interval)
      const daysLeft = Math.floor((nextDue.getTime() - Date.now()) / 86400000)
      if (daysLeft <= 0) return 'overdue'
      if (daysLeft <= 14) return 'due_soon'
      return 'ok'
    }
    return 'unknown'
  }

  const getNextDue = (task: PMTask): string => {
    if (!task.lastDone && !task.lastDate) return 'Not recorded'
    if (task.intervalType === 'hours' && task.lastDone !== undefined) {
      return `${task.lastDone + task.interval} hrs`
    }
    if (task.intervalType === 'months' && task.lastDate) {
      const d = new Date(task.lastDate)
      d.setMonth(d.getMonth() + task.interval)
      return d.toLocaleDateString()
    }
    return '—'
  }

  const STATUS_COLORS: Record<string, string> = {
    overdue: '#e87070', due_soon: '#C68B3A', ok: '#70c070', unknown: 'rgba(245,240,232,0.3)'
  }
  const STATUS_LABELS: Record<string, string> = {
    overdue: 'DUE NOW', due_soon: 'DUE SOON', ok: 'OK', unknown: 'Not set'
  }

  const dimStyle = { color: 'rgba(245,240,232,0.55)', fontFamily: 'Georgia, serif' }
  const labelStyle = { color: '#C68B3A', fontFamily: 'Georgia, serif' }

  const addTask = () => {
    if (!newTask.name) return
    const task: PMTask = { id: Date.now().toString(), ...newTask, interval: Number(newTask.interval), custom: true }
    saveTasks([...tasks, task])
    setNewTask({ name: '', intervalType: 'hours', interval: 500 })
    setShowAdd(false)
  }

  const deleteTask = (id: string) => {
    if (!confirm('Remove this PM task?')) return
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const overdue = tasks.filter(t => getStatus(t) === 'overdue').length
  const dueSoon = tasks.filter(t => getStatus(t) === 'due_soon').length

  return (
    <div className="bg-plate min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'rgba(20,8,2,0.70)', borderBottom: '1px solid rgba(198,139,58,0.3)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')}
            style={{ background: 'rgba(198,139,58,0.12)', border: '1px solid rgba(198,139,58,0.3)', borderRadius: '8px', padding: '6px 10px', color: '#C68B3A', cursor: 'pointer', fontSize: '16px' }}>←</button>
          <Logo size="sm" />
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="text-xs px-3 py-1.5 rounded-lg font-bold"
          style={{ background: '#C68B3A', color: '#3D1C02', fontFamily: 'Georgia, serif', border: 'none', cursor: 'pointer' }}>
          + Add Task
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>PM Schedule</h1>

        {asset?.name && (
          <p className="text-xs mb-2" style={labelStyle}>Asset: {asset.name} {currentHours > 0 ? `— ${currentHours} hrs` : ''}</p>
        )}

        {(overdue > 0 || dueSoon > 0) && (
          <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(232,112,112,0.1)', border: '1px solid rgba(232,112,112,0.3)' }}>
            <p className="text-xs font-bold" style={{ color: '#e87070', fontFamily: 'Georgia, serif' }}>
              {overdue > 0 && `${overdue} overdue`}{overdue > 0 && dueSoon > 0 && ' · '}{dueSoon > 0 && `${dueSoon} due soon`}
            </p>
          </div>
        )}

        {/* Current hours input */}
        <div className="panel p-3 mb-4">
          <label className="block text-xs mb-2" style={dimStyle}>Current Engine Hours (for calculations)</label>
          <input type="number" className="input-field" value={currentHours || ''} onChange={e => setCurrentHours(parseInt(e.target.value) || 0)}
            placeholder="Enter current hours" />
        </div>

        {/* Add task form */}
        {showAdd && (
          <div className="panel p-4 mb-4">
            <h3 className="text-sm font-bold mb-3" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>Add Custom PM Task</h3>
            <div className="flex flex-col gap-3">
              <input className="input-field" placeholder="Task name (e.g. Transmission fluid)" value={newTask.name} onChange={e => setNewTask(t => ({ ...t, name: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <select className="input-field" value={newTask.intervalType} onChange={e => setNewTask(t => ({ ...t, intervalType: e.target.value as any }))}
                  style={{ background: 'rgba(245,240,232,0.08)', color: '#F5F0E8' }}>
                  <option value="hours" style={{ background: '#1a0a02' }}>Hours</option>
                  <option value="miles" style={{ background: '#1a0a02' }}>Miles</option>
                  <option value="months" style={{ background: '#1a0a02' }}>Months</option>
                </select>
                <input type="number" className="input-field" value={newTask.interval} onChange={e => setNewTask(t => ({ ...t, interval: parseInt(e.target.value) || 500 }))} placeholder="Interval" />
              </div>
              <div className="flex gap-2">
                <button onClick={addTask} className="btn-primary flex-1" style={{ fontSize: '14px', padding: '10px' }}>Add Task</button>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', background: 'rgba(139,26,26,0.2)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(139,26,26,0.3)', borderRadius: '10px', fontFamily: 'Georgia, serif', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {tasks.map(task => {
            const status = getStatus(task)
            const statusColor = STATUS_COLORS[status]
            return (
              <div key={task.id} className="panel p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold" style={{ color: '#F5F0E8', fontFamily: 'Georgia, serif' }}>{task.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={dimStyle}>
                      <span>Every {task.interval} {task.intervalType}</span>
                      {task.lastDate && <span>Last: {task.lastDate}</span>}
                      {task.lastDone !== undefined && <span>At: {task.lastDone} hrs</span>}
                      <span style={{ color: statusColor }}>Next: {getNextDue(task)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => markDone(task.id)}
                      style={{ background: 'rgba(112,192,112,0.15)', color: '#70c070', border: '1px solid rgba(112,192,112,0.3)', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
                      Done
                    </button>
                    {task.custom && (
                      <button onClick={() => deleteTask(task.id)}
                        style={{ background: 'rgba(139,26,26,0.15)', color: 'rgba(245,240,232,0.3)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: '8px', padding: '6px 8px', fontSize: '11px', cursor: 'pointer' }}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <NavBar />
    </div>
  )
}

