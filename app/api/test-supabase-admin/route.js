import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase admin client...')
    
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase admin error:', error)
      return NextResponse.json({
        success: false,
        error: 'Supabase admin connection failed: ' + error.message
      }, { status: 500 })
    }

    console.log('Supabase admin connection successful')

    // Test auth admin
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      if (authError) {
        console.error('Supabase auth admin error:', authError)
        return NextResponse.json({
          success: false,
          error: 'Supabase auth admin failed: ' + authError.message
        }, { status: 500 })
      }
      console.log('Supabase auth admin working, user count:', authData.users.length)
    } catch (authError) {
      console.error('Supabase auth admin exception:', authError)
      return NextResponse.json({
        success: false,
        error: 'Supabase auth admin exception: ' + authError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase admin client is working correctly',
      data: {
        connectionTest: 'passed',
        authAdminTest: 'passed'
      }
    })

  } catch (error) {
    console.error('Supabase admin test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed: ' + error.message
    }, { status: 500 })
  }
}
