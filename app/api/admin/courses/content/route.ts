import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentData = await request.json()
    const {
      course_id,
      module_id,
      title,
      description,
      content_type,
      content_url,
      platform = 'youtube',
      duration_minutes,
      order_index = 0
    } = contentData

    if (!course_id || !title || !content_type) {
      return NextResponse.json({ 
        error: 'Course ID, title, and content type are required' 
      }, { status: 400 })
    }

    const { data: content, error } = await supabaseAdmin
      .from('course_content')
      .insert({
        course_id,
        module_id,
        title,
        description,
        content_type,
        content_url,
        platform,
        duration_minutes,
        order_index,
        created_by: admin.adminId
      })
      .select(`
        *,
        course_modules(title),
        courses(title, level, category)
      `)
      .single()

    if (error) {
      console.error('Content creation error:', error)
      return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'create',
        resource_type: 'course_content',
        resource_id: content.id,
        details: { title, content_type, course_id }
      })

    return NextResponse.json({ success: true, content })

  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')
    const moduleId = searchParams.get('module_id')
    const contentType = searchParams.get('content_type')

    let query = supabaseAdmin
      .from('course_content')
      .select(`
        *,
        course_modules(title),
        courses(title, level, category),
        admin_users(name)
      `)
      .order('order_index')

    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }
    
    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data: content, error } = await query

    if (error) {
      console.error('Content fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }

    return NextResponse.json({ success: true, content })

  } catch (error) {
    console.error('Content fetch error:', error)
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
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 })
    }

    const { data: content, error } = await supabaseAdmin
      .from('course_content')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        course_modules(title),
        courses(title, level, category)
      `)
      .single()

    if (error) {
      console.error('Content update error:', error)
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'update',
        resource_type: 'course_content',
        resource_id: id,
        details: updateData
      })

    return NextResponse.json({ success: true, content })

  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('course_content')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Content deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'delete',
        resource_type: 'course_content',
        resource_id: id
      })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
