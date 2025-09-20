'use client'
import { useMemo, useState } from 'react'
import { TRACKS } from '@/lib/tracks'

type Payload = {
  studentName: string
  parentEmail: string
  parentPhone?: string
  notes?: string
  trackSlug: string
  trackName: string
}

export default function EnrollPage() {
  const [trackSlug, setTrackSlug] = useState(TRACKS[0]?.slug ?? '')
  const active = useMemo(() => TRACKS.find(t => t.slug === trackSlug), [trackSlug])
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const student = JSON.parse(localStorage.getItem('student') || '{"name":"", "email":""}')
    const body: Payload = {
      studentName: student.name || String(fd.get('studentName') || ''),
      parentEmail: String(fd.get('parentEmail') || student.email || ''),
      parentPhone: String(fd.get('parentPhone') || ''),
      notes: String(fd.get('notes') || ''),
      trackSlug,
      trackName: active?.name || trackSlug,
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          courseId: trackSlug,
          courseTitle: active?.name || trackSlug,
        })
      })
      setStatus(res.ok ? 'ok' : 'error')
      // Remove form reset to prevent errors
    } catch { setStatus('error') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-300">Enroll</h1>
          <p className="mt-1 text-muted-foreground transition-colors duration-300">
            Choose a track and submit your details. We'll confirm the next cohort.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Track picker */}
        <div className="cc-card p-5">
          <label className="text-sm font-medium text-card-foreground transition-colors duration-300">Track</label>
          <select 
            value={trackSlug} 
            onChange={e=>setTrackSlug(e.target.value)} 
            className="cc-input mt-2 w-full"
          >
            {TRACKS.map(t => <option key={t.slug} value={t.slug}>{t.name} — {t.ages}</option>)}
          </select>

          {active && (
            <div className="mt-4 cc-card p-4 text-sm">
              <div className="font-semibold text-card-foreground transition-colors duration-300">{active.name}</div>
              <div className="mt-1 text-muted-foreground transition-colors duration-300">{active.tagline}</div>
              <div className="mt-2 text-muted-foreground transition-colors duration-300">
                {active.duration} • {active.cadence} • {active.delivery}
              </div>
              <ul className="mt-3 list-disc pl-5 text-muted-foreground transition-colors duration-300">
                {active.outcomes.slice(0,3).map((o,i)=><li key={i}>{o}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="cc-card p-5">
          <div className="grid gap-3">
            <input 
              name="studentName" 
              placeholder="Student full name" 
              className="cc-input" 
            />
            <input 
              name="parentEmail" 
              type="email" 
              required 
              placeholder="Parent/Guardian email" 
              className="cc-input" 
            />
            <input 
              name="parentPhone" 
              placeholder="Parent/Guardian phone (optional)" 
              className="cc-input" 
            />
            <textarea 
              name="notes" 
              placeholder="Notes (child's age, preferred schedule, learning needs)" 
              className="cc-input resize-none"
              rows={3}
            />
            <button 
              disabled={status==='loading'} 
              className="cc-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status==='loading' ? 'Submitting…' : 'Submit enrollment'}
            </button>
            {status==='ok' && (
              <div className="space-y-2">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                  Submitted! We'll email you with next steps.
                </p>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  <a href="/guardian/auth" className="text-primary hover:underline transition-colors duration-300">
                    Create Guardian Account →
                  </a> to complete purchase and manage your student's learning.
                </p>
              </div>
            )}
            {status==='error' && (
              <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-300">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </form>

        {/* Premium Features */}
        <div className="cc-card p-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
              Premium Includes
            </h3>
            <p className="text-sm text-muted-foreground transition-colors duration-300">
              Everything you need for successful learning
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300">
                  All lessons & tutorials unlocked
                </h4>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Access to complete course content
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300">
                  Live Google Meet classes
                </h4>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Interactive sessions with instructors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300">
                  Project feedback & badges
                </h4>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Track progress and earn achievements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300">
                  Parent dashboard with screen-time controls
                </h4>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Monitor and manage learning time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300">
                  Certificate of completion
                </h4>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  Official recognition of achievements
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary transition-colors duration-300 mb-1">
                GHS 149
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300">
                One-time payment per track
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
