'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugSupabasePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSupabaseConnectivity = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic internet connectivity
      addResult('Testing basic internet connectivity...');
      const response = await fetch('https://www.google.com', { method: 'HEAD' });
      addResult(`✅ Basic internet: ${response.status === 200 ? 'Connected' : 'Status: ' + response.status}`);
    } catch (error) {
      addResult(`❌ Basic internet: Failed - ${error}`);
    }

    try {
      // Test 2: Supabase API connectivity
      addResult('Testing Supabase API connectivity...');
      const response = await fetch('https://api.supabase.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      addResult('✅ Supabase API: Accessible');
    } catch (error) {
      addResult(`❌ Supabase API: Failed - ${error}`);
    }

    try {
      // Test 3: Supabase project specific
      addResult('Testing Supabase project connectivity...');
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      if (error) {
        addResult(`❌ Supabase project: Failed - ${error.message}`);
      } else {
        addResult('✅ Supabase project: Connected successfully');
      }
    } catch (error) {
      addResult(`❌ Supabase project: Failed - ${error}`);
    }

    try {
      // Test 4: Supabase auth
      addResult('Testing Supabase auth...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // Handle AuthSessionMissingError gracefully - this is expected when no user is logged in
      if (error && error.message.includes('Auth session missing')) {
        addResult(`✅ Supabase auth: Working (No active session - expected when not logged in)`);
      } else if (error) {
        addResult(`❌ Supabase auth: Failed - ${error.message}`);
      } else {
        addResult(`✅ Supabase auth: Working (Session: ${session ? 'Active' : 'None'})`);
      }
    } catch (error) {
      addResult(`❌ Supabase auth: Failed - ${error}`);
    }

    // Test 5: Browser information
    addResult(`🌐 Browser: ${navigator.userAgent}`);
    addResult(`📱 Online: ${navigator.onLine ? 'Yes' : 'No'}`);
    addResult(`🔗 Connection: ${(navigator as any).connection?.effectiveType || 'Unknown'}`);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Connection Debug</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Supabase Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Supabase URL:</span> 
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div>
              <span className="font-medium">Anon Key:</span> 
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div>
              <span className="font-medium">Service Role Key:</span> 
              <span className={process.env.SUPABASE_SERVICE_ROLE_KEY ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
              </span>
            </div>
            <div>
              <span className="font-medium">Environment:</span> 
              <span className="text-blue-600 ml-2">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testSupabaseConnectivity}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Testing...' : 'Run Supabase Tests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
