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

    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        course_modules(
          id,
          title,
          order_index
        )
      `)
      .eq('instructor_id', instructor.instructorId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch courses:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({ success: true, courses })

  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseData = await request.json()
    const {
      title,
      description,
      age_group,
      difficulty_level,
      category,
      learning_objectives,
      video_links,
      prerequisites,
      duration_weeks,
      max_students,
      is_published,
      course_image,
      tags
    } = courseData

    console.log('Creating course:', { title, instructorId: instructor.instructorId })

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        description,
        instructor_id: instructor.instructorId,
        age_group,
        difficulty_level,
        category,
        learning_objectives,
        video_links: video_links || [],
        prerequisites: prerequisites || [],
        duration_weeks: duration_weeks || 4,
        max_students: max_students || 20,
        is_published: is_published || false,
        course_image: course_image || '',
        tags: tags || [],
        level: difficulty_level === 1 ? 'beginner' : difficulty_level === 2 ? 'intermediate' : 'advanced'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create course:', error)
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    console.log('Course created successfully:', course.id)

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
