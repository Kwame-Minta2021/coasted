'use client'
import { useState, useEffect } from 'react'
import { Clock, Users, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import PinModal from '@/components/modals/PinModal'

interface ScreenTimeCardProps {
  guardianId?: string
  students: any[]
}

const TIME_PRESETS = [
  { label: '15 minutes', value: 15 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '45 minutes', value: 45 * 60 },
  { label: '1 hour', value: 60 * 60 },
  { label: '1.5 hours', value: 90 * 60 },
  { label: '2 hours', value: 120 * 60 },
]

export default function ScreenTimeCard({ guardianId, students }: ScreenTimeCardProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedLimit, setSelectedLimit] = useState(60 * 60) // 1 hour default
  const [customLimit, setCustomLimit] = useState('')
  const [usageData, setUsageData] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinAction, setPinAction] = useState<'set' | 'reset'>('set')
  const [targetStudentId, setTargetStudentId] = useState('')

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0].id)
    }
    loadUsageData()
  }, [students, selectedStudent])

  const loadUsageData = async () => {
    if (!selectedStudent) return

    // Mock data for demo
    setUsageData({
      [selectedStudent]: {
        used: 1800, // 30 minutes
        limit: 3600, // 1 hour
      }
    })
  }

  const handleSetLimit = async () => {
    if (!selectedStudent) return

    setStatus('loading')
    setMessage('')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Screen time limit updated successfully (Demo Mode)')
      loadUsageData()
    }, 1000)
  }

  const handleResetUsage = (studentId: string) => {
    setPinAction('reset')
    setTargetStudentId(studentId)
    setShowPinModal(true)
  }

  const handlePinVerified = async (pin: string) => {
    if (pinAction === 'reset') {
      setStatus('loading')
      
      // Simulate API call
      setTimeout(() => {
        setStatus('success')
        setMessage('Daily usage reset successfully (Demo Mode)')
        loadUsageData()
      }, 1000)
    }
    setShowPinModal(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatRemaining = (used: number, limit: number) => {
    const remaining = limit - used
    if (remaining <= 0) {
      return 'Time limit reached'
    }
    return `${formatTime(remaining)} remaining`
  }

  return (
    <div className="cc-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
            Screen Time Limits
          </h3>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            Set daily screen time limits for each child
          </p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No students found. Add students to set screen time limits.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="cc-input"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name || student.email}
                </option>
              ))}
            </select>
          </div>

          {/* Current Usage Display */}
          {selectedStudent && usageData[selectedStudent] && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-card-foreground transition-colors duration-300">
                  Today's Usage
                </span>
                <button
                  onClick={() => handleResetUsage(selectedStudent)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
              <div className="text-2xl font-bold text-card-foreground transition-colors duration-300">
                {formatTime(usageData[selectedStudent].used || 0)}
              </div>
              <div className="text-sm text-muted-foreground transition-colors duration-300">
                {formatRemaining(usageData[selectedStudent].used || 0, usageData[selectedStudent].limit || 0)}
              </div>
            </div>
          )}

          {/* Limit Setting */}
          <div>
            <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-2">
              Daily Limit
            </label>
            
            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setSelectedLimit(preset.value)
                    setCustomLimit('')
                  }}
                  className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${
                    selectedLimit === preset.value && !customLimit
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Limit */}
            <div className="flex gap-2">
              <input
                type="number"
                value={customLimit}
                onChange={(e) => {
                  setCustomLimit(e.target.value)
                  setSelectedLimit(0)
                }}
                placeholder="Custom (minutes)"
                className="cc-input flex-1"
                min="1"
                max="480"
              />
              <span className="text-sm text-muted-foreground self-center">minutes</span>
            </div>
          </div>

          {/* Set Limit Button */}
          <button
            onClick={handleSetLimit}
            disabled={status === 'loading' || !selectedStudent}
            className="cc-btn-primary cc-cta-ring disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            {status === 'loading' ? 'Setting Limit...' : 'Set Daily Limit'}
          </button>

          {/* Status Messages */}
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
        </div>
      )}

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerify={handlePinVerified}
        title="Enter Guardian PIN"
        description="Enter your 6-digit PIN to confirm this action."
      />
    </div>
  )
}
