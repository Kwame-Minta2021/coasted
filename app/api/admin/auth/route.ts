import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, createAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Get admin user from database
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        admin_id: admin.id,
        action: 'login',
        resource_type: 'admin_session',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    // Create session
    const session = createAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    })

    return NextResponse.json(session)

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'coasted-code-admin-secret-key-2024'
    
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get fresh admin data
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, last_login')
      .eq('id', decoded.adminId)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        last_login: admin.last_login
      }
    })

  } catch (error) {
    console.error('Admin token verification error:', error)
    return NextResponse.json({ error: 'Token verification failed' }, { status: 401 })
  }
}
