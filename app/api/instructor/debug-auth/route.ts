import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword } from '@/lib/instructor-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Debug Auth - Input:', { email, password: password ? '***' : 'empty' })

    // Get instructor user from database
    const { data: instructor, error } = await supabaseAdmin
      .from('instructors')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    console.log('Debug Auth - Database query result:', { 
      instructor: instructor ? { 
        id: instructor.id, 
        email: instructor.email, 
        password_hash: instructor.password_hash?.substring(0, 20) + '...',
        status: instructor.status
      } : null,
      error: error?.message 
    })

    if (error || !instructor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Instructor not found', 
        details: error?.message 
      }, { status: 401 })
    }

    // Test password verification
    console.log('Debug Auth - Testing password verification...')
    const isValidPassword = await verifyPassword(password, instructor.password_hash)
    console.log('Debug Auth - Password verification result:', isValidPassword)

    return NextResponse.json({
      success: true,
      data: {
        instructorFound: true,
        instructorId: instructor.id,
        instructorEmail: instructor.email,
        instructorStatus: instructor.status,
        passwordHashLength: instructor.password_hash?.length || 0,
        passwordHashPrefix: instructor.password_hash?.substring(0, 20) + '...',
        passwordVerification: isValidPassword,
        inputPassword: password,
        inputEmail: email
      }
    })

  } catch (error) {
    console.error('Debug Auth - Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
