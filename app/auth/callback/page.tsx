'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      // Handle AuthSessionMissingError gracefully
      if (error && error.message.includes('Auth session missing')) {
        console.log('No session found in auth callback')
        router.replace('/login')
      } else if (data.session?.user) {
        router.replace('/student')
      } else {
        router.replace('/login')
      }
    }).catch((error) => {
      console.error('Auth callback error:', error)
      router.replace('/student/login')
    })
    
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) router.replace('/student')
    })
    return () => sub?.subscription?.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen grid place-items-center">
      <p className="text-slate-600">Signing you in…</p>
    </div>
  )
}


