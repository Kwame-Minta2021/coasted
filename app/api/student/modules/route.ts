import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET - Fetch published course modules for students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')
    const studentEmail = searchParams.get('student_email')

    // Get student's age group from enrollment data
    let studentAgeGroup = null
    if (studentEmail) {
      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .select('age_band')
        .eq('email', studentEmail)
        .single()

      if (enrollment && !enrollmentError) {
        studentAgeGroup = enrollment.age_band
      }
    }

    let query = supabaseAdmin
      .from('course_modules')
      .select(`
        *,
        course_content(
          id,
          title,
          description,
          content_type,
          content_url,
          duration_minutes,
          is_published,
          order_index
        ),
        courses(
          id,
          title,
          description,
          instructor
        )
      `)
      .eq('is_published', true) // Only show published modules
      .order('order_index')

    // Filter by course if specified
    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    // Filter by student's age group if available
    if (studentAgeGroup) {
      query = query.eq('age_group', studentAgeGroup)
    }

    const { data: modules, error } = await query

    if (error) {
      console.error('Failed to fetch modules:', error)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    // Filter out unpublished content
    const filteredModules = modules?.map(module => ({
      ...module,
      course_content: module.course_content?.filter(content => content.is_published)
    }))

    return NextResponse.json({ success: true, modules: filteredModules })

  } catch (error) {
    console.error('Module fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
