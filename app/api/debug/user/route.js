export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Check Supabase Auth users
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = usersList?.users?.find(user => user.email === email)

    // Check users table
    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    // Check enrollments
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', email)
      .single()

    return NextResponse.json({
      email,
      authUser: authUser ? {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at,
        created_at: authUser.created_at,
        user_metadata: authUser.user_metadata
      } : null,
      userRecord: userRecord || null,
      enrollment: enrollment || null,
      errors: {
        auth: listError,
        user: userError,
        enrollment: enrollmentError
      }
    })

  } catch (error) {
    console.error('Debug user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
