export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Test the client-side Supabase configuration
    const { supabase } = await import('@/lib/supabase/client')
    
    console.log('Testing client-side Supabase...')
    
    // Test basic connection
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle AuthSessionMissingError gracefully - this is expected on server side
    if (error && error.message.includes('Auth session missing')) {
      console.log('No auth session (expected on server side)')
    } else if (error) {
      console.error('Client Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Client-side Supabase connection successful',
      user: user ? { id: user.id, email: user.email } : null
    })

  } catch (error) {
    console.error('Client Supabase test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Client Supabase test failed', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
