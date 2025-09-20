'use client'

import { useState } from 'react'

export default function GuardianAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Simulate authentication process
    setTimeout(() => {
      setLoading(false)
      // For demo purposes, redirect to student portal
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'sign_in' ? 'Guardian Sign In' : 'Guardian Sign Up'}
        </h1>
        <p className="text-center text-sm text-gray-600 mb-4">
          Demo mode - no actual authentication
        </p>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Loading...' : mode === 'sign_in' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {mode === 'sign_in' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in')}
            className="text-blue-600 hover:underline"
          >
            {mode === 'sign_in' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  )
}
