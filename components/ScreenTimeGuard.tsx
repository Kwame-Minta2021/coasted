'use client'
import { useEffect, useRef, useState } from 'react'
import { addUsageSeconds, getSettings, getTodayUsedSeconds } from '@/lib/screenTime'

export default function ScreenTimeGuard({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false)
  const [remaining, setRemaining] = useState<number>(0)
  const accRef = useRef(0)
  const lastTick = useRef<number | null>(null)

  useEffect(() => {
    function tick(ts: number) {
      const { minutesPerDay = 60 } = getSettings()
      const quota = minutesPerDay * 60
      const used = getTodayUsedSeconds()
      const nowRemaining = Math.max(0, quota - used - accRef.current)
      setRemaining(nowRemaining)

      if (nowRemaining <= 0) {
        if (!locked) setLocked(true)
        lastTick.current = null
        return
      }
      if (document.hidden) {
        lastTick.current = null
      } else {
        if (lastTick.current != null) {
          const delta = (ts - lastTick.current) / 1000
          accRef.current += delta
          if (accRef.current >= 5) { // batch writes
            addUsageSeconds(accRef.current)
            accRef.current = 0
          }
        }
        lastTick.current = ts
      }
      if (!locked) requestAnimationFrame(tick)
    }
    const f = requestAnimationFrame(tick)
    const vis = () => { lastTick.current = null }
    document.addEventListener('visibilitychange', vis)
    window.addEventListener('blur', vis)
    return () => {
      cancelAnimationFrame(f)
      document.removeEventListener('visibilitychange', vis)
      window.removeEventListener('blur', vis)
      if (accRef.current > 0) addUsageSeconds(accRef.current)
    }
  }, [locked])

  if (!locked) return <>{children}</>

  const mins = Math.ceil(remaining / 60)

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-20 grid place-items-center">
        <div className="my-16 w-full max-w-md rounded-2xl border bg-white p-6 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl">⏳</div>
          <h3 className="mt-2 text-lg font-semibold">Screen time limit reached</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            You’ve used today’s study time. Please come back tomorrow.
          </p>
          <p className="mt-2 text-sm">Time resets at midnight. Remaining: <span className="font-semibold">{mins} min</span></p>
          <a href="/dashboard/parent" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Parent Controls
          </a>
        </div>
      </div>
      <div className="opacity-40">{children}</div>
    </div>
  )
}
