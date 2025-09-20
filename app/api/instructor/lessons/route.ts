import { NextRequest, NextResponse } from 'next/server'
import { verifyInstructorToken } from '@/lib/instructor-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('module_id')

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
    }

    // Verify instructor owns the module
    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('created_by')
      .eq('id', moduleId)
      .single()

    if (module?.created_by !== instructor.instructorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: lessons, error } = await supabaseAdmin
      .from('course_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index')

    if (error) {
      console.error('Failed to fetch lessons:', error)
      return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lessons })

  } catch (error) {
    console.error('Lesson fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessonData = await request.json()
    const {
      module_id,
      title,
      description,
      content_type,
      video_url,
      video_platform,
      materials,
      interactive_content,
      duration_minutes,
      order_index
    } = lessonData

    // Verify instructor owns the module
    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('created_by')
      .eq('id', module_id)
      .single()

    if (module?.created_by !== instructor.instructorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: lesson, error } = await supabaseAdmin
      .from('course_lessons')
      .insert({
        module_id,
        title,
        description,
        content_type,
        video_url,
        video_platform,
        materials,
        interactive_content,
        duration_minutes,
        order_index
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create lesson:', error)
      return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lesson })

  } catch (error) {
    console.error('Lesson creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
