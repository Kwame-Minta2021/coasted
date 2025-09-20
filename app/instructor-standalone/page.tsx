'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StandaloneInstructorLogin() {
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
    } catch (error) {
      setError('Network error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '50px',
      backgroundColor: '#f5f5f5',
      margin: 0,
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          Instructor Portal
        </h1>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '20px', 
            padding: '10px', 
            backgroundColor: '#fee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Email: instructor@coastedcode.com<br/>
          Password: instructor123
        </div>
      </div>
    </div>
  )
}
