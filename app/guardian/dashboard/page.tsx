'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, Target, Settings, Plus } from 'lucide-react'
import Link from 'next/link'

export default function GuardianDashboard() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo
    setStudents([
      { id: '1', name: 'Demo Student 1', email: 'student1@demo.com' },
      { id: '2', name: 'Demo Student 2', email: 'student2@demo.com' }
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl transition-colors duration-300">
          Guardian Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground transition-colors duration-300 max-w-3xl mx-auto">
          Monitor and manage your children's learning progress, screen time, and educational activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="cc-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground transition-colors duration-300">Students</p>
              <p className="text-2xl font-bold text-card-foreground transition-colors duration-300">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="cc-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground transition-colors duration-300">Total Screen Time</p>
              <p className="text-2xl font-bold text-card-foreground transition-colors duration-300">2.5h</p>
            </div>
          </div>
        </div>

        <div className="cc-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground transition-colors duration-300">Lessons Completed</p>
              <p className="text-2xl font-bold text-card-foreground transition-colors duration-300">12</p>
            </div>
          </div>
        </div>

        <div className="cc-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground transition-colors duration-300">Active Controls</p>
              <p className="text-2xl font-bold text-card-foreground transition-colors duration-300">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Link href="/guardian/guidance" className="cc-card p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
              Parental Controls
            </h3>
          </div>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            Set up screen time limits, PIN protection, and focus mode settings.
          </p>
        </Link>

        <Link href="/dashboard/lessons" className="cc-card p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60 transition-colors duration-200">
              <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
              View Lessons
            </h3>
          </div>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            Browse available lessons and track your children's progress.
          </p>
        </Link>

        <Link href="/dashboard/enroll" className="cc-card p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors duration-200">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-300">
              Enroll Students
            </h3>
          </div>
          <p className="text-sm text-muted-foreground transition-colors duration-300">
            Add new students to your account and manage enrollments.
          </p>
        </Link>
      </div>

      {/* Students List */}
      <div className="cc-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground transition-colors duration-300">
            Your Students
          </h2>
          <Link href="/dashboard/enroll" className="cc-btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No students enrolled yet.</p>
            <Link href="/dashboard/enroll" className="cc-btn-primary">
              Enroll Your First Student
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-card-foreground transition-colors duration-300">
                    {student.name}
                  </h3>
                  <p className="text-sm text-muted-foreground transition-colors duration-300">
                    {student.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground transition-colors duration-300">
                    Screen time: 1.2h today
                  </span>
                  <Link href={`/guardian/child/${student.id}/controls`} className="cc-btn-secondary text-sm">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
