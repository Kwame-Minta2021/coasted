import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aotcrxiqwdmndiarpjko.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdGNyeGlxd2RtbmRpYXJwamtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDQzOTksImV4cCI6MjA3MjY4MDM5OX0.z7HluNxY6ifwuoy3XrVhHdUljv7pAvXgYfe9i0FVdrY'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdGNyeGlxd2RtbmRpYXJwamtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzEwNDM5OSwiZXhwIjoyMDcyNjgwMzk5fQ.joUIlVY0GkYGhc9ARL3cfAjQM0JKUlpQBBZ5C-7cRuM'

// Log environment status for debugging
console.log('Supabase Config:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!supabaseServiceKey,
  url: supabaseUrl
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'coasted-code-app'
    }
  }
})

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default supabase
