'use client'
import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { validatePin } from '@/lib/pin-client'

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (pin: string) => void
  title?: string
  description?: string
}

export default function PinModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  title = "Enter Guardian PIN",
  description = "Enter your 6-digit PIN to continue."
}: PinModalProps) {
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPin('')
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePin(pin)) {
      setError('Please enter a valid 6-digit PIN')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onVerify(pin)
    } catch (error) {
      setError('Invalid PIN. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-background rounded-2xl shadow-2xl border border-border max-w-md w-full p-6"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground transition-colors duration-300">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground transition-colors duration-300 mt-1">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground transition-colors duration-300 mb-2">
              Guardian PIN (6 digits)
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setPin(digitsOnly)
                  setError('')
                }}
                className="cc-input pr-10 text-center text-lg tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                required
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                disabled={isSubmitting}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || pin.length !== 6}
              className="flex-1 cc-btn-primary cc-cta-ring disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify PIN'}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Having trouble? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
