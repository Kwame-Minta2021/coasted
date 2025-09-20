export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Testing login with:', email)

    // Try to sign in with the provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.status
      })
    }

    console.log('Login successful:', data.user?.id)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Simple login test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Login test failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
