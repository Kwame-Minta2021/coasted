'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function StudentFab() {
  const [dest, setDest] = useState('/login')
  useEffect(() => {
    try {
      const raw = localStorage.getItem('student')
      const s = raw ? JSON.parse(raw) : null
      setDest(s?.email ? '/student' : '/login')
    } catch { setDest('/login') }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-5 right-5 z-[60]"
    >
      <Link
        href={dest}
        aria-label="Open Student Portal"
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:opacity-95 focus:outline-none"
      >
        <span aria-hidden className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
          🎒
        </span>
        <span>Student Portal</span>
      </Link>
      <div className="pointer-events-none absolute -z-10 -right-2 -bottom-2 h-14 w-14 rounded-full bg-blue-400/20 blur-xl" />
    </motion.div>
  )
}
