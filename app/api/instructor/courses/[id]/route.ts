import { NextRequest, NextResponse } from 'next/server'
import { verifyInstructorToken } from '@/lib/instructor-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

// GET - Fetch individual course details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Fetch course details
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('instructor_id', instructor.instructorId)
      .single()

    if (courseError) {
      console.error('Error fetching course:', courseError)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id
    const updateData = await request.json()

    // Validate required fields
    if (!updateData.title || !updateData.description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // Update course
    const { data: course, error: updateError } = await supabaseAdmin
      .from('courses')
      .update({
        title: updateData.title,
        description: updateData.description,
        age_group: updateData.age_group,
        difficulty_level: updateData.difficulty_level,
        category: updateData.category,
        learning_objectives: updateData.learning_objectives?.filter((obj: string) => obj.trim()) || [],
        video_links: updateData.video_links?.filter((link: string) => link.trim()) || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .eq('instructor_id', instructor.instructorId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating course:', updateError)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await verifyInstructorToken(request)
    if (!instructor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Delete course
    const { error: deleteError } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('instructor_id', instructor.instructorId)

    if (deleteError) {
      console.error('Error deleting course:', deleteError)
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' })

  } catch (error) {
    console.error('Course delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
