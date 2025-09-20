'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');

  const checkFirebaseStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/firebase-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAdminSDK = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/test-admin');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const listUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/list-users');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName: 'Test User'
        })
      });
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createFrederickUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/create-frederick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'coastedcode2024'
        })
      });
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password);
      setStatus({ success: 'Sign up successful!' });
    } catch (error: any) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      setStatus({ success: 'Sign in successful!' });
    } catch (error: any) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setStatus({ success: 'Sign out successful!' });
    } catch (error: any) {
      setStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Firebase Authentication Test</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Current User</h2>
              <div className="bg-gray-100 p-3 rounded">
                {user ? (
                  <div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>UID:</strong> {user.uid}</p>
                    <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No user signed in</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Test Credentials</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={checkFirebaseStatus}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Check Firebase Status
              </button>
              
              <button
                onClick={testAdminSDK}
                disabled={loading}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Test Admin SDK
              </button>
              
              <button
                onClick={listUsers}
                disabled={loading}
                className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                List All Users
              </button>
              
              <button
                onClick={createTestUser}
                disabled={loading}
                className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                Create Test User (Admin)
              </button>
              
              <button
                onClick={createFrederickUser}
                disabled={loading}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Create Frederick User (Admin)
              </button>
              
              <button
                onClick={testSignUp}
                disabled={loading}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Test Sign Up
              </button>
              
              <button
                onClick={testSignIn}
                disabled={loading}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Test Sign In
              </button>
              
              <button
                onClick={testSignOut}
                disabled={loading}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Test Sign Out
              </button>
            </div>

            {status && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Status</h2>
                <div className={`p-3 rounded ${
                  status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(status, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
