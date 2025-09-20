'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkEnvironment() {
      try {
        // Check environment variables
        const envCheck = await fetch('/api/check-env');
        const envData = await envCheck.json();
        setEnvStatus(envData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkEnvironment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading debug information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Debug Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            This suggests there's an issue with the API routes or environment configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="grid gap-6">
          {/* Environment Variables Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              {envStatus && Object.entries(envStatus).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-mono text-sm">{key}:</span>
                  <span className={`text-sm ${value === '✔️ Loaded' ? 'text-green-600' : 'text-red-600'}`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Client-side Environment Check */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Client-side Environment</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-mono text-sm">NODE_ENV:</span>
                <span className="text-sm">{process.env.NODE_ENV || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-mono text-sm">NEXT_PUBLIC_SITE_URL:</span>
                <span className="text-sm">{process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-mono text-sm">NEXT_PUBLIC_FIREBASE_API_KEY:</span>
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 
                    `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 10)}...` : 
                    'Not set'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/api/test-env'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Test Environment API
              </button>
              <button
                onClick={() => window.location.href = '/api/auth/firebase-status'}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Check Firebase Status
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">Recommendations</h2>
            <div className="space-y-2 text-yellow-700">
              <p>• If environment variables show "❌ Missing", add them to your Vercel project settings</p>
              <p>• Make sure the Firebase service account file is in your repository</p>
              <p>• Check Vercel deployment logs for any build errors</p>
              <p>• Ensure all required environment variables are set in Vercel dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
