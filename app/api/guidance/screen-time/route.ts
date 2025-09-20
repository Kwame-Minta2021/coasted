import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { studentId, dailyLimit, breakInterval, allowedHours } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Update or create guidance record
    const { data, error } = await supabaseAdmin
      .from('guidance')
      .upsert({
        guardian_id: user.id,
        student_id: studentId,
        screen_time_limit: dailyLimit || 120,
        break_interval: breakInterval || 30,
        restrictions: {
          allowed_hours: allowedHours || { start: 8, end: 20 }
        }
      }, {
        onConflict: 'guardian_id,student_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating screen time settings:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Screen time settings updated successfully',
      data
    })
  } catch (error) {
    console.error('Update screen time error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
