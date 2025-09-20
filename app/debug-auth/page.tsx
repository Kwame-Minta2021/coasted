'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth';

export default function DebugAuthPage() {
  const { user, loading, signIn, signUp, signOut, authInitialized } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      console.log('🔐 Debug: Attempting sign in with:', email);
      await signIn(email, password);
      setMessage('✅ Sign in successful!');
    } catch (error: any) {
      console.error('Debug: Sign in error:', error);
      setMessage(`❌ Sign in failed: ${error.message}`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      console.log('📝 Debug: Attempting sign up with:', email);
      await signUp(email, password);
      setMessage('✅ Sign up successful!');
    } catch (error: any) {
      console.error('Debug: Sign up error:', error);
      setMessage(`❌ Sign up failed: ${error.message}`);
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

  const handleCreateTestUser = async () => {
    if (!email) {
      setMessage('❌ Please enter an email first');
      return;
    }

    try {
      setMessage('Creating test user...');
      const response = await fetch('/api/auth/test-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'coastedcode2024',
          displayName: 'Test Student'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Test user created successfully! You can now sign in with email: ${email} and password: coastedcode2024`);
      } else {
        setMessage(`❌ Failed to create test user: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error creating test user: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Auth Initialized:</strong> {authInitialized ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'None'}</p>
            <p><strong>User Email Verified:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          
          <form onSubmit={handleSignIn} className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="password"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={handleCreateTestUser}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Create Test User
              </button>
            </div>
          </form>

          {user && (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <p className="text-sm text-gray-600 mb-2">
            Try these credentials that should have been created after payment:
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Email:</strong> (use the email from your payment)</p>
            <p><strong>Password:</strong> coastedcode2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
