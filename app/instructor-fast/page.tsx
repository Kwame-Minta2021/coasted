'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FastInstructorLogin() {
  const [email, setEmail] = useState('instructor@coastedcode.com')
  const [password, setPassword] = useState('instructor123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/instructor/simple-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        localStorage.setItem('instructorToken', data.token)
        localStorage.setItem('instructorData', JSON.stringify(data.instructor))
        router.push('/instructor/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error: any) {
      setError('Network error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '50px' }}>
      <h1>Instructor Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br/>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br/>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            required
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isLoading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
