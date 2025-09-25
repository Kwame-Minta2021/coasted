'use client'

import { useEffect } from 'react'
import { trackEvent, trackPageView } from '@/components/GoogleAnalytics'

export default function TestGAPage() {
  useEffect(() => {
    // Test page view tracking
    trackPageView('/test-ga', 'Google Analytics Test Page')
    
    // Test event tracking
    trackEvent('page_visit', 'testing', 'ga_test_page')
  }, [])

  const handleTestEvent = () => {
    trackEvent('button_click', 'testing', 'test_button')
    alert('Event tracked! Check Google Analytics Real-time reports.')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Google Analytics Test
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Google Analytics Active
            </h2>
            <p className="text-green-700 text-sm">
              Measurement ID: <code className="bg-green-100 px-1 rounded">G-H2EE34FVLG</code>
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Tracking Events
            </h2>
            <p className="text-blue-700 text-sm mb-3">
              This page automatically tracks:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Page view event</li>
              <li>• Custom test event</li>
            </ul>
          </div>

          <button
            onClick={handleTestEvent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Test Event Tracking
          </button>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              🔍 How to Verify
            </h2>
            <ol className="text-yellow-700 text-sm space-y-1">
              <li>1. Open Google Analytics</li>
              <li>2. Go to Real-time reports</li>
              <li>3. Check for active users</li>
              <li>4. Look for events in Real-time</li>
            </ol>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              🛠️ Developer Tools
            </h2>
            <p className="text-gray-700 text-sm mb-2">
              Check browser console for:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• gtag function availability</li>
              <li>• dataLayer events</li>
              <li>• Network requests to Google</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
