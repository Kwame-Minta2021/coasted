'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@coastedcode.com');
  const [password, setPassword] = useState('test123456');
  const [message, setMessage] = useState('');
  const { signIn, signUp, user, signOut } = useAuth();

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/auth/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName: 'Test User' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Test user created successfully!');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    }
  };

  const testConfig = async () => {
    try {
      const response = await fetch('/api/auth/test');
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Server config test successful! Check console for details.`);
        console.log('Firebase Server Config Test:', data);
      } else {
        setMessage(`❌ Server config test failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Server config test error: ${error}`);
    }
  };

  const testClientConfig = async () => {
    try {
      const response = await fetch('/api/auth/client-test');
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Client config test successful! Check console for details.`);
        console.log('Firebase Client Config Test:', data);
      } else {
        setMessage(`❌ Client config test failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Client config test error: ${error}`);
    }
  };

  const runDiagnostics = async () => {
    try {
      const response = await fetch('/api/auth/diagnose');
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Diagnostics completed! Check console for full report.`);
        console.log('Firebase Diagnostics:', data);
      } else {
        setMessage(`❌ Diagnostics failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Diagnostics error: ${error}`);
    }
  };

  const getSetupGuide = async () => {
    try {
      const response = await fetch('/api/auth/setup-guide');
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Setup guide loaded! Check console for instructions.`);
        console.log('Firebase Setup Guide:', data);
      } else {
        setMessage(`❌ Setup guide failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Setup guide error: ${error}`);
    }
  };

  const handleSignIn = async () => {
    try {
      console.log('🔐 Attempting sign in with:', email);
      await signIn(email, password);
      setMessage('✅ Sign in successful!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      setMessage(`❌ Sign in failed: ${error.message}`);
    }
  };

  const handleSignUp = async () => {
    try {
      console.log('📝 Attempting sign up with:', email);
      await signUp(email, password);
      setMessage('✅ Sign up successful!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setMessage(`❌ Sign up failed: ${error.message}`);
    }
  };

  const testSimpleSignup = async () => {
    try {
      const response = await fetch('/api/auth/simple-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName: 'Test User' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Simple signup test: ${data.message}`);
      } else {
        setMessage(`❌ Simple signup test failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Simple signup test error: ${error}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('✅ Sign out successful!');
    } catch (error: any) {
      setMessage(`❌ Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Authentication Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-2">
                         <button
               onClick={testConfig}
               className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
             >
               Test Server Config
             </button>
             
                           <button
                onClick={testClientConfig}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Test Client Config
              </button>
              
              <button
                onClick={runDiagnostics}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700"
              >
                Run Diagnostics
              </button>
              
              <button
                onClick={getSetupGuide}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
              >
                Get Setup Guide
              </button>
            
                         <button
               onClick={createTestUser}
               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
             >
               Create Test User (Admin)
             </button>
             
             <button
               onClick={testSimpleSignup}
               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
             >
               Test Simple Signup
             </button>
            
            <button
              onClick={handleSignIn}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Sign In
            </button>
            
            <button
              onClick={handleSignUp}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Sign Up
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          {message && (
            <div className="mt-4 p-3 rounded-md bg-gray-100">
              <p className="text-sm">{message}</p>
            </div>
          )}

          {user && (
            <div className="mt-4 p-3 rounded-md bg-green-100">
              <p className="text-sm font-medium">✅ Currently signed in as:</p>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm">UID: {user.uid}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
