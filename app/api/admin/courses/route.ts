import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')

    let query = supabaseAdmin
      .from('courses')
      .select(`
        *,
        course_modules(
          id,
          title,
          description,
          order_index,
          is_published,
          course_content(
            id,
            title,
            content_type,
            is_published,
            order_index
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (level) {
      query = query.eq('level', level)
    }
    
    if (category) {
      query = query.eq('category', category)
    }

    const { data: courses, error } = await query

    if (error) {
      console.error('Courses fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({ success: true, courses })

  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseData = await request.json()
    const {
      title,
      description,
      level,
      category,
      price,
      duration,
      instructor,
      is_published = false
    } = courseData

    if (!title || !level || !price) {
      return NextResponse.json({ 
        error: 'Title, level, and price are required' 
      }, { status: 400 })
    }

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        description,
        level,
        category,
        price,
        duration,
        instructor
      })
      .select()
      .single()

    if (error) {
      console.error('Course creation error:', error)
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'create',
        resource_type: 'course',
        resource_id: course.id,
        details: { title, level, price }
      })

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Course update error:', error)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'update',
        resource_type: 'course',
        resource_id: id,
        details: updateData
      })

    return NextResponse.json({ success: true, course })

  } catch (error) {
    console.error('Course update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
