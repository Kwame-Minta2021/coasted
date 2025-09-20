'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Student = { id: string; name: string; email: string }

export default function RequireStudent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<'checking'|'ok'|'redirect'>('checking')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('student')
      if (!raw) { setState('redirect'); router.replace('/login'); return }
      const s: Student = JSON.parse(raw)
      if (!s?.name || !s?.email) { setState('redirect'); router.replace('/login'); return }
      setState('ok')
    } catch {
      setState('redirect')
      router.replace('/login')
    }
  }, [router])

  if (state === 'ok') return <>{children}</>
  // lightweight, accessible loading/redirect state
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border p-6 dark:border-slate-800">
        <p className="text-sm">Redirecting to sign in… If nothing happens, <a href="/login" className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </main>
  )
}
