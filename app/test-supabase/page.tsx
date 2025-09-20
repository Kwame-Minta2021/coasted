'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2, Database, Users, BookOpen, Target, Shield, CreditCard, Clock } from 'lucide-react'

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL'
  message: string
  details?: any
}

interface TestResults {
  timestamp: string
  tests: TestResult[]
  summary: {
    total: number
    passed: number
    failed: number
  }
}

export default function TestSupabasePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    if (!checkEnvironment()) return
    
    setIsRunning(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
      } else {
        setError(data.error || 'Test failed')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run tests')
    } finally {
      setIsRunning(false)
    }
  }

  const checkEnvironment = () => {
    const missingVars = []
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push('SUPABASE_SERVICE_ROLE_KEY')
    
    if (missingVars.length > 0) {
      setError(`Missing environment variables: ${missingVars.join(', ')}. Please add them to .env.local`)
      return false
    }
    return true
  }

  const testEnrollment = async () => {
    if (!checkEnvironment()) return
    
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch('/api/test-enrollment', {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        setError(null)
        alert('Test enrollment created successfully!')
      } else {
        setError(data.error || 'Enrollment test failed')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create test enrollment')
    } finally {
      setIsRunning(false)
    }
  }

  const getTestIcon = (testName: string) => {
    const iconMap: { [key: string]: any } = {
      'Database Connection': Database,
      'Users Table Access': Users,
      'Enrollments Table Access': Users,
      'Courses Table Access': BookOpen,
      'Progress Table Access': Target,
      'Guidance Table Access': Shield,
      'Payments Table Access': CreditCard,
      'Subscriptions Table Access': Clock,
      'Row Level Security': Shield,
      'Environment Variables': Database
    }
    
    const IconComponent = iconMap[testName] || Database
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Supabase Migration Test Suite
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your Firebase to Supabase migration
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              {isRunning ? 'Running Tests...' : 'Run Database Tests'}
            </button>

            <button
              onClick={testEnrollment}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Users className="w-5 h-5" />
              )}
              {isRunning ? 'Creating...' : 'Test Enrollment'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200 font-medium">Error</span>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Test Summary
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {results.summary.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {results.summary.passed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.summary.failed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Last run: {new Date(results.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Test Results
                </h2>
                <div className="space-y-3">
                  {results.tests.map((test, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        test.status === 'PASS'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {test.status === 'PASS' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        {getTestIcon(test.name)}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {test.name}
                          </div>
                          <div className={`text-sm ${
                            test.status === 'PASS'
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {test.message}
                          </div>
                          {test.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                                View Details
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🚀 Next Steps
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>1. <strong>Set up Supabase Project:</strong> Create a new project at <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">supabase.com/dashboard</a></p>
              <p>2. <strong>Run Migration Script:</strong> Execute the SQL script in <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">supabase/migrations/001_initial_schema.sql</code></p>
              <p>3. <strong>Update Environment Variables:</strong> Add your Supabase credentials to <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">.env.local</code></p>
              <p>4. <strong>Run Tests:</strong> Click "Run Database Tests" to verify everything is working</p>
              <p>5. <strong>Test Enrollment:</strong> Click "Test Enrollment" to create a sample enrollment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
