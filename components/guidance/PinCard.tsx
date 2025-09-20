'use client'
import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { validatePin, generateSalt, hashPin } from '@/lib/pin-client'

interface PinCardProps {
  guardianId?: string
}

export default function PinCard({ guardianId }: PinCardProps) {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [hasExistingPin, setHasExistingPin] = useState(false)

  useEffect(() => {
    // Mock existing PIN check for demo
    setHasExistingPin(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePin(pin)) {
      setStatus('error')
      setMessage('PIN must be exactly 6 digits')
      return
    }

    if (pin !== confirmPin) {
      setStatus('error')
      setMessage('PINs do not match')
      return
    }

    setStatus('loading')
    setMessage('')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage(hasExistingPin ? 'PIN updated successfully (Demo Mode)' : 'PIN set successfully (Demo Mode)')
      setPin('')
      setConfirmPin('')
      setHasExistingPin(true)
    }, 1000)
  }

  return (
    <div className="cc-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
            Guardian PIN
          </h3>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            {hasExistingPin ? 'Change your 6-digit security PIN' : 'Set a 6-digit security PIN'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-2">
            {hasExistingPin ? 'New PIN' : 'PIN'} (6 digits)
          </label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="cc-input pr-10"
              placeholder="000000"
              maxLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-2">
            Confirm PIN
          </label>
          <div className="relative">
            <input
              type={showConfirmPin ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="cc-input pr-10"
              placeholder="000000"
              maxLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="cc-btn-primary cc-cta-ring disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {status === 'loading' ? 'Setting PIN...' : hasExistingPin ? 'Update PIN' : 'Set PIN'}
        </button>

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-600 dark:text-red-400">{message}</span>
          </div>
        )}
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 text-sm">ℹ</span>
          </div>
          <div>
            <h4 className="font-medium text-card-foreground transition-colors duration-300">
              PIN Protection
            </h4>
            <p className="text-sm text-muted-foreground transition-colors duration-300">
              Your PIN is required to reset screen time limits, exit focus mode, and override time restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
