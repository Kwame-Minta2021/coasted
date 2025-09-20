'use client'
import { useMemo, useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PaywallGuard from '@/components/PaywallGuard'
import LessonItem from '@/components/LessonItem'
import { SAMPLE_LESSONS } from '@/lib/sampleData'
import { useFocusMode } from '@/hooks/useFocusMode'
// Firebase auth removed for UI-only demo
import PinModal from '@/components/modals/PinModal'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, Lock, Play, X } from 'lucide-react'

function LessonsContent() {
  const searchParams = useSearchParams()
  const [showPinModal, setShowPinModal] = useState(false)
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)
  const [showFocusViolationModal, setShowFocusViolationModal] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const lastHeartbeatRef = useRef<number>(0)

  const student = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('student') || '{"id":"","name":"","email":""}')
    : { id:'', email:'' }



  // Focus mode parameters from URL
  const isFocusMode = searchParams.get('focus') === '1'
  const focusStudentId = searchParams.get('student')
  const focusCourseId = searchParams.get('course') // Fixed: was courseId

  // Focus mode hook
  const focusMode = useFocusMode({
    onViolation: () => {
      setIsPaused(true)
      setShowFocusViolationModal(true)
    },
    onExit: () => {
      // Handle focus mode exit
    }
  })

  // Start focus mode if parameters are present
  useEffect(() => {
    if (isFocusMode && focusStudentId && focusCourseId) {
      focusMode.startFocus()
    }
  }, [isFocusMode, focusStudentId, focusCourseId])

  // Heartbeat system for screen time tracking
  useEffect(() => {
    if (isFocusMode && focusStudentId) {
      const startHeartbeat = () => {
        heartbeatRef.current = setInterval(async () => {
          const now = Date.now()
          const timeSinceLastHeartbeat = now - lastHeartbeatRef.current
          
          // Only send heartbeat if at least 10 seconds have passed
          if (timeSinceLastHeartbeat >= 10000) {
                         // Demo mode: simulate time tracking
             // In a real app, this would send heartbeat to API
             setTimeRemaining(30 * 60) // Demo: 30 minutes remaining
             lastHeartbeatRef.current = now
          }
        }, 15000) // Check every 15 seconds
      }

      startHeartbeat()
      lastHeartbeatRef.current = Date.now()

      return () => {
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current)
        }
      }
    }
  }, [isFocusMode, focusStudentId, focusCourseId])

  const handlePinVerify = async (pin: string): Promise<boolean> => {
    // Demo mode: accept any PIN
    if (showFocusViolationModal) {
      setShowFocusViolationModal(false)
      setIsPaused(false)
    } else if (showTimesUpModal) {
      setShowTimesUpModal(false)
      setIsPaused(false)
    }
    return true
  }

  const handleExitFocus = async () => {
    await focusMode.stopFocus(true)
    // Navigate back to guidance page
    window.location.href = '/guardian/guidance'
  }

  const overview = (
    <div>
      <h2 className="text-lg font-semibold">What you'll learn</h2>
      <ul className="mt-2 list-disc pl-5 text-sm">
        <li>Build projects with guided steps</li>
        <li>Join live Google Meet sessions</li>
        <li>Earn badges and show your work</li>
      </ul>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Lessons</h1>
      
      {/* Focus Mode Status */}
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cc-card p-4 bg-primary/5 border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground transition-colors duration-300">
                  Focus Mode Active
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300">
                  {timeRemaining > 0 ? `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s remaining` : 'Time tracking active'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPinModal(true)}
              className="cc-btn-primary px-4 py-2 text-sm"
            >
              Exit Focus
            </button>
          </div>
        </motion.div>
      )}

      <PaywallGuard isPremium={false} showUpgrade={true}>
        <div className={`grid gap-4 md:grid-cols-2 ${isPaused ? 'pointer-events-none opacity-50' : ''}`}>
          {SAMPLE_LESSONS.map(lesson => (
          <LessonItem 
            key={lesson.id} 
            id={lesson.id}
            title={lesson.title}
            duration={lesson.duration}
            isCompleted={lesson.status === 'completed'}
            isLocked={lesson.status === 'not_started'}
            onClick={() => {
              // Handle lesson click
              console.log('Lesson clicked:', lesson.id)
            }}
          />
        ))}
        </div>
      </PaywallGuard>

      {/* Focus Violation Modal */}
      <AnimatePresence>
        {showFocusViolationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="cc-card w-full max-w-md p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground transition-colors duration-300 mb-2">
                Focus Mode Paused
              </h2>
              <p className="text-muted-foreground transition-colors duration-300 mb-6">
                You switched away from the lesson. Please return to continue learning.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFocusViolationModal(false)
                    setIsPaused(false)
                  }}
                  className="cc-btn-primary flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Return to Lesson
                </button>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="cc-btn-primary flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit (PIN)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time's Up Modal */}
      <AnimatePresence>
        {showTimesUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="cc-card w-full max-w-md p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground transition-colors duration-300 mb-2">
                Time's Up!
              </h2>
              <p className="text-muted-foreground transition-colors duration-300 mb-6">
                You've reached your daily screen time limit. The lesson is now paused.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="cc-btn-primary w-full"
                >
                  Request More Time (PIN)
                </button>
                <button
                  onClick={handleExitFocus}
                  className="w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Exit Focus Mode
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerify={handlePinVerify}
        title={showTimesUpModal ? "Request More Time" : "Exit Focus Mode"}
        description={showTimesUpModal ? "Enter your PIN to request more screen time" : "Enter your PIN to exit focus mode"}
      />
    </div>
  )
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading lessons...</div>}>
      <LessonsContent />
    </Suspense>
  );
}
