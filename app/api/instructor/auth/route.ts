import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createInstructorSession } from '@/lib/instructor-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Instructor login attempt:', { email })

    const { data: instructor, error } = await supabaseAdmin
      .from('instructors')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    if (error || !instructor) {
      console.log('Instructor not found or inactive:', error?.message)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, instructor.password_hash)
    if (!isValidPassword) {
      console.log('Invalid password for instructor:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last login
    await supabaseAdmin
      .from('instructors')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', instructor.id)

    const session = createInstructorSession(instructor)

    console.log('Instructor login successful:', { email, id: instructor.id })

    return NextResponse.json(session)

  } catch (error) {
    console.error('Instructor authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
