'use client'
import { useState } from 'react'
import { Target, Play, Users, BookOpen, AlertTriangle } from 'lucide-react'
import { TRACKS } from '@/lib/tracks'

interface FocusModeCardProps {
  guardianId?: string
  students: any[]
}

export default function FocusModeCard({ guardianId, students }: FocusModeCardProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedTrack, setSelectedTrack] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleStartFocusSession = () => {
    if (!selectedStudent || !selectedTrack) {
      setStatus('error')
      setMessage('Please select both a student and a track')
      return
    }

    setStatus('loading')
    setMessage('')

    // Navigate to lessons page with focus mode parameters
    const focusUrl = `/dashboard/lessons?focus=1&student=${selectedStudent}&course=${selectedTrack}`
    window.location.href = focusUrl
  }

  return (
    <div className="cc-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
            Focus Mode
          </h3>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            Start a distraction-free learning session
          </p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No students found. Add students to start focus sessions.</p>
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
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name || student.email}
                </option>
              ))}
            </select>
          </div>

          {/* Track Selection */}
          <div>
            <label className="block text-sm font-medium text-card-foreground transition-colors duration-300 mb-2">
              Select Learning Track
            </label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="cc-input"
            >
              <option value="">Choose a track...</option>
              {TRACKS.map((track) => (
                <option key={track.slug} value={track.slug}>
                  {track.name} — {track.ages}
                </option>
              ))}
            </select>
          </div>

          {/* Start Focus Session Button */}
          <button
            onClick={handleStartFocusSession}
            disabled={status === 'loading' || !selectedStudent || !selectedTrack}
            className="cc-btn-primary cc-cta-ring disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {status === 'loading' ? 'Starting Focus Session...' : 'Start Focus Session'}
          </button>

          {/* Error Message */}
          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">{message}</span>
            </div>
          )}

          {/* Focus Mode Information */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">ℹ</span>
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300 mb-2">
                  Focus Mode Features
                </h4>
                <ul className="text-sm text-muted-foreground transition-colors duration-300 space-y-1">
                  <li>• Full-screen learning environment</li>
                  <li>• Tab switching detection and content pausing</li>
                  <li>• Screen wake lock to prevent sleep</li>
                  <li>• Guardian PIN required to exit</li>
                  <li>• Automatic screen time tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground transition-colors duration-300 mb-2">
                  Important Notes
                </h4>
                <ul className="text-sm text-muted-foreground transition-colors duration-300 space-y-1">
                  <li>• Focus mode will go full-screen automatically</li>
                  <li>• Switching tabs or windows will pause content</li>
                  <li>• Exiting focus mode requires your guardian PIN</li>
                  <li>• Screen time limits are still enforced</li>
                  <li>• Students can request help via the "Having trouble?" link</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
