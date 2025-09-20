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
    const courseId = searchParams.get('course_id')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Verify instructor owns the course
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    if (course?.instructor_id !== instructor.instructorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: modules, error } = await supabaseAdmin
      .from('course_modules')
      .select(`
        *,
        course_lessons(
          id,
          title,
          content_type,
          duration_minutes,
          is_published,
          order_index
        )
      `)
      .eq('course_id', courseId)
      .order('order_index')

    if (error) {
      console.error('Failed to fetch modules:', error)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    return NextResponse.json({ success: true, modules })

  } catch (error) {
    console.error('Module fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleData = await request.json()
    const {
      course_id,
      title,
      description,
      age_group,
      estimated_duration,
      learning_objectives,
      prerequisites
    } = moduleData

    // Verify instructor owns the course
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('instructor_id')
      .eq('id', course_id)
      .single()

    if (course?.instructor_id !== instructor.instructorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: module, error } = await supabaseAdmin
      .from('course_modules')
      .insert({
        course_id,
        title,
        description,
        age_group,
        estimated_duration,
        learning_objectives,
        prerequisites,
        created_by: instructor.instructorId
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create module:', error)
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    }

    return NextResponse.json({ success: true, module })

  } catch (error) {
    console.error('Module creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
