'use client'
import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '@/lib/screenTime'
import Link from 'next/link'

export default function ParentControlsPage() {
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [minutes, setMinutes] = useState<number>(60)
  const [ok, setOk] = useState(false)
  const settings = getSettings()

  useEffect(() => {
    if (settings.minutesPerDay) setMinutes(settings.minutesPerDay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function unlock(e: React.FormEvent) {
    e.preventDefault()
    if (!settings.pin || pin === settings.pin) setOk(true)
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    const m = Math.max(15, Math.min(240, Number(minutes) || 60))
    saveSettings({ minutesPerDay: m, pin: newPin || settings.pin })
    alert('Saved!')
  }

  if (!ok && settings.pin) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Parent Controls</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Enter your PIN to manage screen time.</p>
        <form onSubmit={unlock} className="grid gap-3">
          <input value={pin} onChange={e=>setPin(e.target.value)} type="password" placeholder="PIN" className="rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold">Unlock</button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-extrabold tracking-tight">Parent Controls</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Set a daily learning time limit. When time is up, lessons lock until tomorrow.
        </p>
        <p className="mt-2 text-sm"><Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link></p>
      </div>

      <form onSubmit={save} className="rounded-2xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Daily limit (minutes)</span>
            <input
              value={minutes}
              onChange={e=>setMinutes(Number(e.target.value))}
              type="number" min={15} max={240}
              className="rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
            <span className="text-xs text-slate-500">Between 15 and 240.</span>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Set/Change PIN (optional)</span>
            <input
              value={newPin}
              onChange={e=>setNewPin(e.target.value)}
              placeholder={settings.pin ? 'Enter new PIN' : 'Create a PIN'}
              className="rounded-xl border px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
            <span className="text-xs text-slate-500">Leave blank to keep current PIN.</span>
          </label>
        </div>
        <button className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700">Save</button>
      </form>
    </div>
  )
}
