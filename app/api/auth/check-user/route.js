import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Checking user status for email:', email)
    console.log('Supabase admin client available:', !!supabaseAdmin)

    // First check if user exists in users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name, role, age_band, status')
      .eq('email', email.toLowerCase())
      .single()

    // If user exists in users table, return success
    if (user && !userError) {
      console.log('User found in users table:', user.id)
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.display_name,
          role: user.role,
          ageBand: user.age_band,
          status: user.status
        }
      })
    }

    // If user not found in users table, check enrollments table
    console.log('User not found in users table, checking enrollments...')
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('id, email, parent_name, child_name, age_band, payment_status')
      .eq('email', email.toLowerCase())
      .single()

    if (enrollment && !enrollmentError) {
      console.log('Enrollment found:', enrollment.id)
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          uid: enrollment.id,
          email: enrollment.email,
          displayName: enrollment.parent_name,
          role: 'student',
          ageBand: enrollment.age_band,
          status: enrollment.payment_status === 'completed' ? 'active' : 'pending'
        }
      })
    }

    // No user or enrollment found
    console.log('No user or enrollment found for email:', email)
    return NextResponse.json({
      success: true,
      exists: false,
      user: null
    })

  } catch (error) {
    console.error('Error checking user:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || ''

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Reuse the POST logic by calling Supabase directly
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name, role, age_band, status')
      .eq('email', email.toLowerCase())
      .single()

    if (user && !userError) {
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.display_name,
          role: user.role,
          ageBand: user.age_band,
          status: user.status
        }
      })
    }

    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('id, email, parent_name, child_name, age_band, payment_status')
      .eq('email', email.toLowerCase())
      .single()

    if (enrollment && !enrollmentError) {
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          uid: enrollment.id,
          email: enrollment.email,
          displayName: enrollment.parent_name,
          role: 'student',
          ageBand: enrollment.age_band,
          status: enrollment.payment_status === 'completed' ? 'active' : 'pending'
        }
      })
    }

    return NextResponse.json({ success: true, exists: false, user: null })
  } catch (error) {
    console.error('Error checking user (GET):', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
