import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET - Fetch enrolled courses and their modules for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentEmail = searchParams.get('email')

    if (!studentEmail) {
      return NextResponse.json({ error: 'Student email is required' }, { status: 400 })
    }

    // First, get the student's enrollment data
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('course_enrolled, age_band')
      .eq('email', studentEmail)
      .single()

    if (enrollmentError) {
      console.error('Failed to fetch enrollment:', enrollmentError)
      return NextResponse.json({ error: 'Student not enrolled' }, { status: 404 })
    }

    // Get the enrolled course details
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        instructors(
          id,
          name,
          bio,
          specialization
        )
      `)
      .eq('id', enrollment.course_enrolled)
      .single()

    if (courseError) {
      console.error('Failed to fetch course:', courseError)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get published modules for the enrolled course
    const { data: modules, error: modulesError } = await supabaseAdmin
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
        )
      `)
      .eq('course_id', enrollment.course_enrolled)
      .eq('is_published', true)
      .order('order_index')

    if (modulesError) {
      console.error('Failed to fetch modules:', modulesError)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    // Filter out unpublished content
    const filteredModules = modules?.map(module => ({
      ...module,
      course_content: module.course_content?.filter(content => content.is_published)
    }))

    // Format the response
    const response = {
      course: {
        ...course,
        instructor: course.instructors ? {
          name: course.instructors.name,
          bio: course.instructors.bio,
          specialization: course.instructors.specialization
        } : null
      },
      modules: filteredModules,
      enrollment: {
        ageBand: enrollment.age_band,
        enrolledAt: enrollment.created_at
      }
    }

    // Remove the instructors object from the response
    delete response.course.instructors

    return NextResponse.json({ success: true, data: response })

  } catch (error) {
    console.error('Enrolled courses fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
