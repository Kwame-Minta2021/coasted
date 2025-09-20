'use client';

import { useState } from 'react';

export default function AuthSetupGuidePage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Enable Firebase Authentication',
      description: 'Enable Email/Password authentication in Firebase Console',
      action: 'Go to Firebase Console > Authentication > Sign-in method',
      url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/authentication/providers',
      details: [
        'Click on "Email/Password" provider',
        'Toggle the "Enable" switch to ON',
        'Click "Save" to enable email/password authentication'
      ]
    },
    {
      id: 2,
      title: 'Add Authorized Domains',
      description: 'Add your domain to the authorized domains list',
      action: 'Go to Firebase Console > Authentication > Settings > Authorized domains',
      url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/authentication/settings',
      details: [
        'Add "coasted-code-test.vercel.app" to the list',
        'Add "localhost" for local development',
        'Add "127.0.0.1" for local development'
      ]
    },
    {
      id: 3,
      title: 'Verify Project Configuration',
      description: 'Check that your Firebase project settings are correct',
      action: 'Go to Firebase Console > Project Settings > General',
      url: 'https://console.firebase.google.com/project/coasted-code-e4ae6/settings/general',
      details: [
        'Verify Project ID: "coasted-code-e4ae6"',
        'Check that the project is properly configured',
        'Ensure billing is set up if needed'
      ]
    },
    {
      id: 4,
      title: 'Check Vercel Environment Variables',
      description: 'Ensure all environment variables are set in Vercel',
      action: 'Go to Vercel Dashboard > Your Project > Settings > Environment Variables',
      url: 'https://vercel.com/dashboard',
      details: [
        'PAYSTACK_SECRET_KEY (should be set)',
        'NEXT_PUBLIC_SITE_URL (should be set)',
        'FIREBASE_PROJECT_ID (optional)',
        'FIREBASE_CLIENT_EMAIL (optional)',
        'FIREBASE_PRIVATE_KEY (optional)'
      ]
    },
    {
      id: 5,
      title: 'Test Authentication',
      description: 'Use the test page to verify everything works',
      action: 'Visit the authentication test page',
      url: '/test-auth',
      details: [
        'Click "Test Client Config" to verify Firebase config',
        'Try signing up with a new email',
        'Try signing in with existing credentials',
        'Test forgot password functionality'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Firebase Authentication Setup Guide
          </h1>
          <p className="text-lg text-gray-600">
            Follow these steps to fix authentication issues in your Coasted Code application
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Steps Navigation */}
            <div className="lg:w-1/3">
              <h2 className="text-xl font-semibold mb-4">Setup Steps</h2>
              <div className="space-y-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeStep === step.id
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activeStep === step.id ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.id}
                      </div>
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm opacity-75">{step.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="lg:w-2/3">
              {steps.map((step) => (
                <div key={step.id} className={activeStep === step.id ? 'block' : 'hidden'}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                        !
                      </div>
                      <span className="font-semibold text-blue-800">Action Required</span>
                    </div>
                    <p className="text-blue-700 mb-3">{step.action}</p>
                    <a
                      href={step.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Open Link →
                    </a>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Detailed Steps:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Troubleshooting Tips</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• If login fails, check browser console for error messages</li>
            <li>• Ensure Firebase Authentication is enabled in Firebase Console</li>
            <li>• Verify your domain is in the authorized domains list</li>
            <li>• Check that environment variables are properly set in Vercel</li>
            <li>• Try clearing browser cache and cookies</li>
            <li>• Use the test page at /test-auth to debug authentication issues</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/test-auth"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Authentication Test Page
          </a>
        </div>
      </div>
    </div>
  );
}
