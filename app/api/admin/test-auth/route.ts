import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { data: adminUsers, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@coastedcode.com')

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database error', 
        details: error.message 
      }, { status: 500 })
    }

    // Test JWT secret
    const jwtSecret = process.env.JWT_SECRET
    const hasJwtSecret = !!jwtSecret

    return NextResponse.json({
      success: true,
      data: {
        adminUserExists: adminUsers && adminUsers.length > 0,
        adminUser: adminUsers?.[0] || null,
        hasJwtSecret,
        jwtSecretLength: jwtSecret?.length || 0,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
