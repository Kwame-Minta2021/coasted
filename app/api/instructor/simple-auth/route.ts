import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Simple auth attempt:', { email })

    const { data: instructor, error } = await supabaseAdmin
      .from('instructors')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    if (error || !instructor) {
      console.log('Instructor not found:', error?.message)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Simple password comparison for testing
    const isValidPassword = password === 'instructor123'

    if (!isValidPassword) {
      console.log('Invalid password for instructor:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create a proper JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'coasted-code-instructor-secret-key-2024'

    const token = jwt.sign(
      { 
        instructorId: instructor.id, 
        email: instructor.email,
        type: 'instructor'
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Extended to 7 days for better development experience
    )

    console.log('Simple auth successful:', { email, id: instructor.id })

    return NextResponse.json({
      success: true,
      token,
      instructor: {
        id: instructor.id,
        email: instructor.email,
        name: instructor.name,
        bio: instructor.bio,
        specialization: instructor.specialization,
        profile_image: instructor.profile_image,
        timezone: instructor.timezone,
        status: instructor.status
      }
    })

  } catch (error) {
    console.error('Simple auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
