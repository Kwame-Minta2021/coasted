'use client'
import { useState } from 'react'

export default function SimpleEnrollForm() {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [formData, setFormData] = useState({
    student_name: '',
    parent_email: '',
    parent_phone: '',
    notes: ''
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    try {
      console.log('Submitting form data:', formData)
      
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: 'general',
          course_title: 'General Interest'
        })
      })
      
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      
      const result = await res.json()
      console.log('Response data:', result)
      
      if (res.ok && result.ok) {
        console.log('Success! Setting status to ok')
        setStatus('ok')
        setFormData({ student_name: '', parent_email: '', parent_phone: '', notes: '' })
      } else {
        console.error('Enrollment failed - res.ok:', res.ok, 'result.ok:', result.ok)
        console.error('Full result:', result)
        setStatus('error')
        setErrorMessage(result.error || 'Failed to submit enrollment')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="cc-card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300 mb-4">
        Enroll Your Child
      </h3>
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-1">
            Student Name *
          </label>
          <input
            type="text"
            required
            value={formData.student_name}
            onChange={(e) => setFormData(prev => ({ ...prev, student_name: e.target.value }))}
            placeholder="Full name"
            className="cc-input w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-1">
            Parent Email *
          </label>
          <input
            type="email"
            required
            value={formData.parent_email}
            onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
            placeholder="your@email.com"
            className="cc-input w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-1">
            Parent Phone *
          </label>
          <input
            type="tel"
            required
            value={formData.parent_phone}
            onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
            placeholder="+233 XX XXX XXXX"
            className="cc-input w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Child's age, preferred schedule, learning needs..."
            rows={3}
            className="cc-input w-full resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="cc-btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Enrollment'}
        </button>
        
        {status === 'ok' && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              ✅ Enrollment submitted successfully! We'll email you with next steps.
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <a href="/guardian/auth" className="underline">
                Create Guardian Account →
              </a> to manage your student's learning.
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              ❌ {errorMessage || 'Something went wrong. Please try again or contact us directly.'}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
