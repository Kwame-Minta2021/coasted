'use client'
import { useState, useEffect } from 'react'

import PinCard from '@/components/guidance/PinCard'
import ScreenTimeCard from '@/components/guidance/ScreenTimeCard'
import FocusModeCard from '@/components/guidance/FocusModeCard'


interface GuidanceShellProps {
  guardianId?: string
}

export default function GuidanceShell({ guardianId }: GuidanceShellProps) {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    setStudents([
      { id: '1', name: 'Demo Student 1', email: 'student1@demo.com' },
      { id: '2', name: 'Demo Student 2', email: 'student2@demo.com' }
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Guidance</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="cc-btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl transition-colors duration-300">
          Parental Guidance
        </h1>
        <p className="mt-4 text-lg text-muted-foreground transition-colors duration-300 max-w-3xl mx-auto">
          Set up parental controls, screen time limits, and focus mode to ensure safe and productive learning.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* PIN Card */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <PinCard guardianId={guardianId} />
        </div>

        {/* Screen Time Card */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <ScreenTimeCard guardianId={guardianId} students={students} />
        </div>

        {/* Focus Mode Card */}
        <div className="opacity-0 animate-fade-in-up lg:col-span-2" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <FocusModeCard guardianId={guardianId} students={students} />
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-200">Demo Mode</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This is a demonstration version. Authentication and database features are disabled.
        </p>
      </div>
    </div>
  )
}
