'use client';

import { useState } from "react";
import Link from 'next/link';

// Mock data for demo purposes
const mockGuardianData = {
  premiumActive: true,
  customerId: 'demo-customer-123'
};

export default function GuardianBillingPage() {
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async () => {
    setProcessing(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setProcessing(false);
      alert('Demo: Subscription would be processed here. In a real app, this would redirect to Stripe Checkout.');
    }, 2000);
  };

  const handleManageBilling = async () => {
    setProcessing(true);
    
    // Simulate billing portal access
    setTimeout(() => {
      setProcessing(false);
      alert('Demo: Billing portal would open here. In a real app, this would redirect to Stripe Customer Portal.');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your premium subscription
          </p>
        </div>

        <div className="grid gap-8">
          {/* Current Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Current Status
            </h2>
            
            {mockGuardianData.premiumActive ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
                    Premium Active
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  You have access to all premium features including advanced screen time controls and focus mode management.
                </p>
                <button
                  onClick={handleManageBilling}
                  disabled={processing}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Loading...' : 'Manage Billing'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Free Plan
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upgrade to Premium to unlock advanced screen time controls and focus mode features.
                </p>
                <button
                  onClick={handleSubscribe}
                  disabled={processing}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Loading...' : 'Upgrade to Premium'}
                </button>
              </div>
            )}
          </div>

          {/* Premium Features */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Premium Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Advanced Screen Time Controls</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set detailed daily limits and schedule windows
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Focus Mode Management</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create and manage focus sessions for distraction-free learning
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Route Blocking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Block specific websites and routes during restricted times
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Real-time Monitoring</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track usage in real-time with detailed analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Pricing
            </h2>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold mb-2">$9.99<span className="text-lg font-normal">/month</span></div>
                <p className="text-blue-100 mb-6">
                  All premium features for unlimited children
                </p>
                {!mockGuardianData.premiumActive && (
                  <button
                    onClick={handleSubscribe}
                    disabled={processing}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Start Free Trial'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link
              href="/guardian"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
