'use client'
import { useState } from 'react'
// this is the track enroll form of the applicat
export default function TrackEnrollForm({ trackSlug, trackName }:{ trackSlug:string; trackName:string }) {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    fd.append('kind', 'track_enquiry')
    fd.append('track', trackSlug)
    const res = await fetch('/api/partner', { method: 'POST', body: fd })
    setStatus(res.ok ? 'ok' : 'error')
    // Remove form reset to prevent errors
  }
  return (
    <form onSubmit={submit} className="mt-4 grid gap-3">
      <input name="parent" required placeholder="Parent/Guardian name" className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"/>
      <input name="email" required type="email" placeholder="Email" className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"/>
      <input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"/>
      <textarea name="notes" placeholder={`Child's age, preferred schedule for ${trackName}`} className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"/>
      <button disabled={status==='loading'} className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
        {status==='loading' ? 'Sending…' : 'Request to Enroll'}
      </button>
      {status==='ok' && <p className="text-sm text-emerald-600">Thanks! We'll confirm the next cohort by email.</p>}
      {status==='error' && <p className="text-sm text-red-600">Something went wrong—please try again.</p>}
    </form>
  )
}
