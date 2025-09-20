import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', token)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.display_name,
        ageBand: user.age_band,
        role: user.role,
        enrollmentDate: user.enrollment_date,
        courseEnrolled: user.course_enrolled,
        status: user.status,
        address: user.address,
        emergencyContact: user.emergency_contact,
        preferences: user.preferences
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const updateData = await request.json()

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', token)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.display_name,
        updatedAt: user.updated_at
      }
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
