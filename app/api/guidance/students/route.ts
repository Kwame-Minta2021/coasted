import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
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

    // Get students under guidance for this guardian
    const { data: guidanceData, error: guidanceError } = await supabaseAdmin
      .from('guidance')
      .select(`
        student_id,
        screen_time_limit,
        focus_mode_enabled,
        pin_enabled,
        restrictions,
        users!guidance_student_id_fkey(
          id,
          display_name,
          email,
          age_band
        )
      `)
      .eq('guardian_id', user.id)

    if (guidanceError) {
      console.error('Error fetching guidance data:', guidanceError)
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
    }

    // Transform data to match expected format
    const students = guidanceData.map(item => ({
      id: item.student_id,
      name: (item.users as any)?.display_name || 'Unknown',
      email: (item.users as any)?.email || '',
      age: (item.users as any)?.age_band || 'Unknown',
      screenTimeLimit: item.screen_time_limit,
      focusModeEnabled: item.focus_mode_enabled,
      pinEnabled: item.pin_enabled,
      restrictions: item.restrictions
    }))

    return NextResponse.json({ 
      success: true,
      students,
      message: 'Students loaded successfully'
    })
  } catch (error) {
    console.error('Error loading students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}