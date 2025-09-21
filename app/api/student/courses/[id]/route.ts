import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET - Fetch course details for students
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params

    // Fetch course details with instructor information
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        instructors (
          id,
          name,
          bio,
          specialization,
          experience
        )
      `)
      .eq('id', courseId)
      .eq('is_published', true) // Only show published courses
      .single()

    if (courseError) {
      console.error('Error fetching course:', courseError)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Format the response to include instructor info
    const formattedCourse = {
      ...course,
      instructor: course.instructors ? {
        name: course.instructors.name,
        bio: course.instructors.bio,
        specialization: course.instructors.specialization,
        experience: course.instructors.experience
      } : null
    }

    // Remove the instructors object from the response
    delete formattedCourse.instructors

    return NextResponse.json({ success: true, course: formattedCourse })

  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
