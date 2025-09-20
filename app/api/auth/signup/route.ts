import { NextRequest, NextResponse } from 'next/server'
import { createUserWithAuth } from '@/lib/supabase/users'

export async function POST(request: NextRequest) {
  try {
    const { email, password, userData } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Create user with Supabase Auth and database profile
    const result = await createUserWithAuth(email, password, userData)

    return NextResponse.json({
      success: true,
      user: {
        id: result.auth.user.id,
        email: result.auth.user.email,
        display_name: result.profile.display_name,
        role: result.profile.role
      }
    })
  } catch (error: any) {
    console.error('Sign up error:', error)
    
    // Handle specific Supabase errors
    if (error.message?.includes('already registered')) {
      return NextResponse.json({ 
        success: false, 
        error: 'User already exists' 
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
