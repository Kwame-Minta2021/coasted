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
    const courseId = searchParams.get('course_id')

    let query = supabaseAdmin
      .from('course_modules')
      .select(`
        *,
        courses(title, level, category),
        course_content(
          id,
          title,
          content_type,
          is_published,
          order_index
        )
      `)
      .order('order_index')

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: modules, error } = await query

    if (error) {
      console.error('Modules fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
    }

    return NextResponse.json({ success: true, modules })

  } catch (error) {
    console.error('Modules fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleData = await request.json()
    const {
      course_id,
      title,
      description,
      order_index = 0,
      is_published = false
    } = moduleData

    if (!course_id || !title) {
      return NextResponse.json({ 
        error: 'Course ID and title are required' 
      }, { status: 400 })
    }

    const { data: module, error } = await supabaseAdmin
      .from('course_modules')
      .insert({
        course_id,
        title,
        description,
        order_index,
        is_published
      })
      .select(`
        *,
        courses(title, level, category)
      `)
      .single()

    if (error) {
      console.error('Module creation error:', error)
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'create',
        resource_type: 'course_module',
        resource_id: module.id,
        details: { title, course_id }
      })

    return NextResponse.json({ success: true, module })

  } catch (error) {
    console.error('Module creation error:', error)
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
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
    }

    const { data: module, error } = await supabaseAdmin
      .from('course_modules')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        courses(title, level, category)
      `)
      .single()

    if (error) {
      console.error('Module update error:', error)
      return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'update',
        resource_type: 'course_module',
        resource_id: id,
        details: updateData
      })

    return NextResponse.json({ success: true, module })

  } catch (error) {
    console.error('Module update error:', error)
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
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('course_modules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Module deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 })
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.adminId,
        action: 'delete',
        resource_type: 'course_module',
        resource_id: id
      })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Module deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}