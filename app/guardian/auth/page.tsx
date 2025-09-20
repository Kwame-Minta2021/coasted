'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GuardianAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to unified login page
    router.replace('/login')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to unified login...</p>
      </div>
    </main>
  )
}
