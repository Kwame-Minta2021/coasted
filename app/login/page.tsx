'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Code, BookOpen, Users, Award } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | 'instructor' | 'guardian'>('student');
  const { signIn, user } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Attempting login with:', email, 'as', userType);
      
      if (userType === 'student') {
        // Use Supabase Auth for students
        const { user, error } = await signIn(email, password);
        
        console.log('Student login result:', { user: user?.email, error: error?.message });
        
        if (error) {
          console.log('Student login failed with error:', error.message);
          setError(error.message || 'Login failed. Please try again.');
        } else if (user) {
          console.log('Student login successful, redirecting...');
          setMessage('Login successful! Redirecting...');
          
          setTimeout(() => {
            router.push('/student');
          }, 1000);
        }
      } else if (userType === 'admin') {
        // Admin authentication
        const response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.admin));
          setMessage('Admin login successful! Redirecting...');
          
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1000);
        } else {
          setError(data.error || 'Admin login failed');
        }
      } else if (userType === 'instructor') {
        // Instructor authentication
        const response = await fetch('/api/instructor/simple-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem('instructorToken', data.token);
          localStorage.setItem('instructorData', JSON.stringify(data.instructor));
          setMessage('Instructor login successful! Redirecting...');
          
          setTimeout(() => {
            router.push('/instructor/dashboard');
          }, 1000);
        } else {
          setError(data.error || 'Instructor login failed');
        }
      } else if (userType === 'guardian') {
        // Guardian authentication (demo mode)
        setMessage('Guardian login successful! Redirecting...');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If user is already signed in, redirect to student dashboard
  useEffect(() => {
    if (isClient && user) {
      // Use setTimeout to defer navigation until after the current render cycle
      const timeoutId = setTimeout(() => {
        router.push('/student');
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isClient, user, router]);

  // Show loading while redirecting - only check user state after client-side hydration
  if (isClient && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/20 dark:bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-4 mb-10">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Coasted Code</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Learn. Build. Create.</p>
              </div>
            </div>

            {/* Enhanced Hero Content */}
            <div className="mb-16">
              <h2 className="text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
                Welcome back,
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  let's continue building.
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Sign in with your enrollment credentials to access your student portal, 
                interactive lessons, and track your coding progress.
              </p>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Interactive Lessons</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hands-on coding exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Expert Guidance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Learn from industry professionals</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Track Progress</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Monitor your achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Enhanced Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Coasted Code</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Learn. Build. Create.</p>
              </div>
            </div>

            {/* Enhanced Login Card */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 p-10 relative overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Welcome Back</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Sign in to your {userType === 'student' ? 'student' : userType === 'instructor' ? 'instructor' : userType === 'admin' ? 'admin' : 'guardian'} portal
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleLogin}>
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Sign in as
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'student', label: 'Student', icon: '👨‍🎓', color: 'blue' },
                        { value: 'instructor', label: 'Instructor', icon: '👨‍🏫', color: 'green' },
                        { value: 'admin', label: 'Admin', icon: '👨‍💼', color: 'purple' },
                        { value: 'guardian', label: 'Guardian', icon: '👨‍👩‍👧‍👦', color: 'orange' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setUserType(type.value as any)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                            userType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20 text-${type.color}-700 dark:text-${type.color}-300`
                              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-lg">{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Email Field */}
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Enhanced Password Field */}
                  <div className="space-y-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-14 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-100 dark:hover:bg-slate-600 rounded-r-2xl transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Error Message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Enhanced Success Message */}
                  {message && (
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5 flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-green-700 dark:text-green-300 font-medium">{message}</p>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-6 w-6" />
                      </>
                    )}
                  </button>

                  {/* Demo Credentials */}
                  {userType !== 'student' && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mt-6">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Demo Credentials:</h3>
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {userType === 'admin' && (
                          <>
                            <p><strong>Email:</strong> admin@coastedcode.com</p>
                            <p><strong>Password:</strong> admin123</p>
                          </>
                        )}
                        {userType === 'instructor' && (
                          <>
                            <p><strong>Email:</strong> instructor@coastedcode.com</p>
                            <p><strong>Password:</strong> instructor123</p>
                          </>
                        )}
                        {userType === 'guardian' && (
                          <>
                            <p><strong>Email:</strong> Any email</p>
                            <p><strong>Password:</strong> Any password</p>
                            <p className="text-xs text-slate-500">(Demo mode - no actual authentication)</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Sign Up Link */}
                  <div className="text-center pt-6">
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Don't have an account?{' '}
                      <Link 
                        href="/enroll" 
                        className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                      >
                        Enroll now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


