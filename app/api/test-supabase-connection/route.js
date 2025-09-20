export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection by trying to get the current user (should be null for unauthenticated)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle AuthSessionMissingError gracefully - this is expected on server side
    if (error && error.message.includes('Auth session missing')) {
      console.log('No auth session (expected on server side)')
    } else if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    // Test a simple database query
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Database query error:', testError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: testError
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      user: user ? { id: user.id, email: user.email } : null,
      databaseTest: 'passed'
    })

  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Connection test failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
