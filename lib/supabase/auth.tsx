'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './client'

// Utility function to handle auth errors consistently
const handleAuthError = (error: any, context: string) => {
  if (error.message.includes('Auth session missing')) {
    console.log(`${context}: No active session (user not authenticated)`)
    return { shouldClearSession: true, isError: false }
  } else if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
    console.log(`${context}: Refresh token invalid or expired - clearing session`)
    return { shouldClearSession: true, isError: false }
  } else if (error.message.includes('Invalid login credentials')) {
    console.log(`${context}: Invalid credentials - clearing session`)
    return { shouldClearSession: true, isError: false }
  } else {
    console.error(`${context}: Auth error:`, error)
    return { shouldClearSession: false, isError: true }
  }
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  authInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    console.log('🚀 Initializing Supabase authentication...')
    
    let isMounted = true
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        // Handle various auth errors gracefully during initial load
        if (error) {
          const { shouldClearSession } = handleAuthError(error, 'Initial session load')
          if (shouldClearSession) {
            setSession(null)
            setUser(null)
          }
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error: any) {
        // This catch block handles unexpected errors that are thrown
        // This catch block should not be reached for normal auth errors
        // as they should be returned in the error field, not thrown
        if (!isMounted) return
        
        // Handle network connectivity issues
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          console.warn('Network connectivity issue - Supabase connection failed. Retrying...')
          // Retry after a short delay
          setTimeout(() => {
            if (isMounted) {
              getInitialSession()
            }
          }, 2000)
          return
        }
        
        // Handle auth errors gracefully - these are expected when no user is logged in
        if (error.message && (
          error.message.includes('Auth session missing') ||
          error.message.includes('Invalid login credentials') ||
          error.message.includes('Invalid Refresh Token')
        )) {
          // Don't log these as errors - they're expected when no user is logged in
          setSession(null)
          setUser(null)
        } else {
          console.error('Unexpected error in getInitialSession:', error)
          setSession(null)
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setAuthInitialized(true)
        }
      }
    }

    // Wrap the initialization call to catch any unhandled errors
    const initializeAuth = async () => {
      try {
        await getInitialSession()
      } catch (error: any) {
        console.error('Error during auth initialization:', error)
        setSession(null)
        setUser(null)
        setLoading(false)
        setAuthInitialized(true)
      }
    }
    
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return
        
        console.log('=== AUTH STATE CHANGE ===')
        console.log('Event:', event)
        console.log('Session:', session ? 'Present' : 'None')
        console.log('User:', session?.user?.email || 'None')
        console.log('========================')
        
        // Handle token refresh errors gracefully
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
          setSession(null)
          setUser(null)
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in')
          setSession(session)
          setUser(session?.user ?? null)
        } else {
          // For other events, update state normally
          setSession(session)
          setUser(session?.user ?? null)
        }
        
        setLoading(false)
        setAuthInitialized(true)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Don't log expected errors as errors - they're handled gracefully
        if (error.message.includes('Invalid login credentials')) {
          error.message = 'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message.includes('Email not confirmed')) {
          error.message = 'Please check your email and click the confirmation link before signing in.'
        }
        return { user: null, error }
      }
      
      console.log('✅ Sign in successful:', data.user?.email)
      return { user: data.user, error: null }
    } catch (error: any) {
      console.error('Unexpected sign in error:', error)
      
      // Handle network connectivity issues
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const networkError = new Error('Network connection failed. Please check your internet connection and try again.') as any
        return { user: null, error: networkError }
      }
      
      // Convert any unexpected errors to a proper error object
      const authError = error as any // Cast to any to match AuthError type
      return { user: null, error: authError }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      console.log('Signing up with:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { user: null, error }
      }
      
      console.log('✅ Sign up successful:', data.user?.email)
      return { user: data.user, error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { user: null, error }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...')
      
      // Clear local state first
      setUser(null)
      setSession(null)
      
      // Try to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      // Handle various auth errors gracefully
      if (error) {
        const { shouldClearSession } = handleAuthError(error, 'Sign out')
        // Even with errors, we consider sign out successful since local state is cleared
        return { error: null }
      }
      
      console.log('✅ Sign out successful')
      return { error: null }
    } catch (error: any) {
      // Handle "Auth session missing" and other expected errors gracefully
      if (error.message && (
        error.message.includes('Auth session missing') ||
        error.message.includes('Invalid Refresh Token') ||
        error.message.includes('Refresh Token Not Found')
      )) {
        console.log('Sign out: No active session to sign out from (this is normal)')
        // Clear local state and consider sign out successful
        setUser(null)
        setSession(null)
        return { error: null }
      }
      
      console.error('Sign out error:', error)
      // Even if there's an unexpected error, clear the local state
      setUser(null)
      setSession(null)
      return { error: null } // Consider sign out successful since local state is cleared
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      console.log('Resetting password for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('Password reset error:', error)
        return { error }
      }
      
      console.log('✅ Password reset email sent')
      return { error: null }
    } catch (error: any) {
      console.error('Password reset error:', error)
      return { error }
    }
  }, [])

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    authInitialized
  }), [user, session, loading, signIn, signUp, signOut, resetPassword, authInitialized])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
