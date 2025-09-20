'use client'
import { useState } from 'react'
import type { Course } from '@/types/course'

export default function EnrollModal({ course, onClose }: { course: Course, onClose: ()=>void }) {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    setStatus('loading')
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, courseId: course.id, courseTitle: course.title })
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl dark:border-border transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">Enroll in {course.title}</h3>
            <p className="text-sm text-muted-foreground transition-colors duration-300">{course.level} • {course.mode}</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
          >
            Close
          </button>
        </div>
        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <input 
            name="studentName" 
            required 
            placeholder="Student full name" 
            className="cc-input"
          />
          <input 
            name="parentEmail" 
            type="email" 
            required 
            placeholder="Parent email" 
            className="cc-input"
          />
          <input 
            name="parentPhone" 
            placeholder="Parent phone" 
            className="cc-input"
          />
          <textarea 
            name="notes" 
            placeholder="Notes (allergies, learning needs)" 
            className="cc-input resize-none"
            rows={3}
          />
          <button 
            disabled={status==='loading'} 
            className="cc-btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status==='loading' ? 'Submitting…' : 'Submit enrollment'}
          </button>
          {status==='ok' && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
              Submitted! We'll email you shortly.
            </p>
          )}
          {status==='error' && (
            <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-300">
              Something went wrong. Try again.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
