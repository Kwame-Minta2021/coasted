'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MinimalLogin() {
  const [email, setEmail] = useState('instructor@coastedcode.com')
  const [password, setPassword] = useState('instructor123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/instructor/simple-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('instructorToken', data.token)
        localStorage.setItem('instructorData', JSON.stringify(data.instructor))
        router.push('/instructor/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Instructor Login</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '8px', width: '200px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '8px', width: '200px' }}
        />
      </div>
      
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: loading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </div>
  )
}
