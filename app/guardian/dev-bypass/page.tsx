'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DevBypassPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const enableBypass = async () => {
    setLoading(true)
    
    // Set a development bypass cookie
    document.cookie = 'dev-bypass=true; path=/; max-age=3600'
    
    // Redirect to guidance page
    router.push('/guardian/guidance')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Development Bypass
        </h1>
        <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
          This page allows you to test the guidance system without Firebase authentication.
          <br /><br />
          <strong>⚠️ Only use this in development!</strong>
        </p>
        
        <button
          onClick={enableBypass}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enabling...' : 'Enable Development Bypass'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          <a href="/guardian/auth" className="text-blue-600 hover:underline">
            Or go to normal authentication
          </a>
        </p>
      </div>
    </main>
  )
}
