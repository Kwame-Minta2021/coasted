'use client'
import { useEffect, useRef, useState } from 'react'

export default function LessonPlayer({ studentId, lessonId, videoUrl }:{ studentId: string; lessonId: string; videoUrl: string }) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    fetch(`/api/progress/remaining/${studentId}`).then(r=>r.json()).then(d=>{
      setRemaining(d.remaining_seconds ?? 0)
    }).catch(()=> setRemaining(0))
  }, [studentId])

  useEffect(() => {
    if (remaining === null || remaining <= 0) return
    timerRef.current = setInterval(async () => {
      const res = await fetch('/api/progress/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, lessonId, seconds: 15 })
      })
      if (res.status === 429) {
        setRemaining(0)
        clearInterval(timerRef.current)
        return
      }
      const j = await res.json().catch(()=>({}))
      if (typeof j.remaining_seconds === 'number') {
        setRemaining(j.remaining_seconds)
        if (j.remaining_seconds <= 0) clearInterval(timerRef.current)
      }
    }, 15000)
    return () => clearInterval(timerRef.current)
  }, [remaining, studentId, lessonId])

  return (
    <div className="rounded-2xl border p-4 dark:border-slate-800">
      <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">Remaining screen time: {remaining ?? '…'}s</div>
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        className="w-full rounded-xl"
        onPlay={(e) => {
          if ((remaining ?? 0) <= 0) {
            alert('Screen time limit reached for today.')
            ;(e.currentTarget as HTMLVideoElement).pause()
          }
        }}
        onTimeUpdate={(e) => {
          if ((remaining ?? 0) <= 0) {
            (e.currentTarget as HTMLVideoElement).pause()
          }
        }}
      />
      {remaining !== null && remaining <= 0 && (
        <div className="mt-3 rounded-xl bg-amber-100 p-3 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
          Screen time limit reached. Please continue tomorrow. 🌙
        </div>
      )}
    </div>
  )
}


